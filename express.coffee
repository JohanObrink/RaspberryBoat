express = require 'express'

# app
app = express.createServer()
module.exports = app

# configuration
bootstrap = require 'bootstrap-stylus'
stylus = require 'stylus'

compile = (str, path) ->
	stylus(str).set('filename', path).use(bootstrap())

# config method
app.configure = () ->
  app.set('views', __dirname + '/views')
  app.set('view engine', 'jade')
  app.use(express.bodyParser())
  app.use(express.methodOverride())
  app.use(stylus.middleware({ src: __dirname + '/public', compile: compile }))
  app.use(app.router)
  app.use(express.static(__dirname + '/public'))

# config
app.configure 'development', () ->
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }))

app.configure 'production', () ->
  app.use(express.errorHandler())


# Routes
app.get '/', (req, res) ->
  res.render 'index'

app.get '/video', (req, res) ->
  res.render 'video'