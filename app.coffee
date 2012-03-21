# create app
app = require('./express.js')
app.listen 8081

#connect now
require('./now.js').connect app