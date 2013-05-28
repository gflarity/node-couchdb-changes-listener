var http = require('http');
var util = require('util');

var events = require( 'events' );

var ChangesParser = function ChangesParser( host, port, path) {

    this.options = {
        host: host, 
        port: port,
        path: path, // !! note that path must start with '/' !"
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
            // remove \n at end of incoming line
            chunk = chunk.replace(/\n+$/, '');
            // heartbeat cause CouchDB to send empty lines that cause JSON.parse throw an error, we must check before parsing.
            if (chunk) {
                that.emit( 'change', JSON.parse(chunk) );                
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
