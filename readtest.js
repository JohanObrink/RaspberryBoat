var reader = require('./fileLineReader.js').createReader('files/test.log');

console.log(reader.readLine() + ' ' + reader.eof());
console.log(reader.readLine() + ' ' + reader.eof());

reader = require('./fileLineReader.js').createReader('test.txt');

console.log(reader.readLine() + ' ' + reader.eof());
console.log(reader.readLine() + ' ' + reader.eof());