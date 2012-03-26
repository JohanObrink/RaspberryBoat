# create app
app = require('./express.js')
app.listen 8080

#connect now
require('./now.js').connect app