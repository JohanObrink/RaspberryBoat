var maestro = require('usbmaestro')

console.log( maestro.ping() );

maestro.connect();

maestro.setTarget( 0, 1400 );

maestro.disconnect();
