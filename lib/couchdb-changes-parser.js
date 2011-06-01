var http = require('http');
var util = require('util');

var events = require( 'events' );

var ChangesParser = function ChangesParser( host, port, path) {

    this.options = {
        host: host, 
        port: port,
        path: path,
        method: 'GET'
    };

};
exports.ChangesParser = ChangesParser;
util.inherits( ChangesParser, events.EventEmitter );

ChangesParser.prototype.connect = function connect() {
    
    var that = this;
    
    var on_response = function on_response( res ) {
        
        res.setEncoding('utf8');
    
    	var is_first = true;
        var string_buffer = '';
    	var on_data = function on_data( chunk ) {
    
    	    if ( is_first ) {
    		is_first = false;
        		return;
    	    }
            
            if ( chunk.length >= 3 && (chunk.slice( chunk.length - 3, chunk.length ) === '},\n' ) ) {        
        	    //remove ,\n
                string_buffer += chunk;
        	    var json_string = string_buffer.slice( 0, string_buffer.length - 2 );
        	    var json = JSON.parse( json_string );
                string_buffer = '';
        	    that.emit( 'change', json );
                
            }
            else {
                string_buffer += chunk;                    
            }
    	};
    	res.on('data', on_data );
    };
    var req = http.request( this.options, on_response );
    
    req.on('error', function(e) {
    	console.log('problem with request: ' + e.message);
        });
    
    req.end();

};