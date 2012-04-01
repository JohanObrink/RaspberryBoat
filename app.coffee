# create app
port = 8080
app = require('./express.js')
app.listen port

console.log 'Listening on :' + port

#connect now
require('./now.js').connect app