serialport = require 'serialport'
nmea = require 'nmea'

class Tracker

  constructor: () ->

  connect: (path, baud, callback) ->
    try
      port = new serialport.SerialPort path, { baudrate: baud, parser: serialport.parsers.readline '\r\n' }
      callback(null)

      port.on 'data', @onData
    catch err
      callback(err)
    this

  disconnect: () ->
    delete port
    this

  on: (type, callback) ->
    unless @callbacks?
      @callbacks = {}
    @callbacks[type] = callback
    this

  call: (type, err, data) ->
    if @callbacks?[type]?
      @callbacks[type](err, data)
    this

  onData: (line) =>
    @call 'data', null, line
    data = nmea.parse line
    if data?
      switch data.type
        when 'satellite-list-partial' then @parseSatelliteListMessage data
        when 'fix'
          if !!data.lon and !!data.lat
            data.lat = @nmeaToDecimal data.lat
            data.lon = @nmeaToDecimal data.lon
            @call 'fix', null, data

  parseSatelliteListMessage: (data) ->
    if @satelliteListPartial?
      @satelliteListPartial.satellites = @satelliteListPartial.satellites.concat data.satellites
    else
      @satelliteListPartial = data

    if @satelliteListPartial.numMsgs is data.msgNum
      @satelliteListPartial.msgNum = data.msgNum
      @call 'satellite-list', null, @satelliteListPartial
      @satelliteListPartial = null

  nmeaToDecimal: (val) ->
    #10141.82531
    deg = val.substring 0, val.indexOf('.') - 2
    min = val.substring deg.length

    parseInt(deg, 10) + (parseFloat(min) / 60)


exports.Tracker = Tracker
exports.createTracker = () ->
  new Tracker() 