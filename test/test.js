var ChangesParser = require( '../lib/couchdb-changes-parser').ChangesParser;

var changes_parser = new ChangesParser( 'localhost', 5985, '/foo/_changes?include_docs=true&feed=continous' );
changes_parser.on( 'change', 
    function( change ) { 
        console.log( JSON.stringify(change) ) 
        } );
changes_parser.connect();


