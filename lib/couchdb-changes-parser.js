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
    	var on_data = function on_data( chunk ) {
    
    	    if ( is_first ) {
    		is_first = false;
        		return;
    	    }
            
            var ending = chunk.slice( chunk.length - 3, chunk.length );
            if ( ending === '},\n' ) {
        
        	    //remove ,\n
        	    var json_string = chunk.slice( 0, chunk.length - 2 );
        	    var json = JSON.parse( json_string );
        	    that.emit( 'change', json );
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