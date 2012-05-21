var maestro = require('./bin/usbmaestro')

console.log( maestro.ping() );

maestro.connect();

maestro.setTarget( 0, 0 );

setTimeout(maestro.setTarget, 500, 0, 1500);

//maestro.setTarget( 2, 1620 );

//setTimeout(maestro.setTarget, 1000, 2, 0);

//maestro.disconnect();
