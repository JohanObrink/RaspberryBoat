serialport = require 'serialport'
nmea = require 'nmea'
reader = require('./fileLineReader.js').FileLineReader

class Tracker

	connect: (path, baud, callback) ->
    try
      port = new serialport.SerialPort path, { baudrate: baud, parser: serialport.parsers.readline '\r\n' }
      callback(null)

      port.on 'data', @onData
    catch error
      callback(error)
    this
  
  onSatelliteList: (callback) ->
    @satelliteListCallback = callback
  
  onFix: (callback) ->
    @fixCallback = callback

  onData: (line) =>
    data = nmea.parse line
    if data?
      switch data.type
        when 'satellite-list-partial' then @parseSatelliteListMessage data
        when 'fix'
          if @fixCallback?
            if !!data.lon and !!data.lat
              data.lat = @nmeaToDecimal data.lat
              data.lon = @nmeaToDecimal data.lon
              @fixCallback null, data
            else
              console.log 'No fix'
          else console.log 'Noone is listening to me!!!'

  parseSatelliteListMessage: (data) =>
    if @satelliteListPartial?
      @satelliteListPartial.satellites = @satelliteListPartial.satellites.concat data.satellites
    else
      @satelliteListPartial = data

    if @satelliteListPartial.numMsgs is data.msgNum
      @satelliteListPartial.msgNum = data.msgNum
      @satelliteListCallback null, @satelliteListPartial
      @satelliteListPartial = null

  nmeaToDecimal: (val) =>
    #10141.82531
    deg = val.substring 0, val.indexOf('.') - 2
    min = val.substring deg.length

    parseInt(deg, 10) + (parseFloat(min) / 60) 

  runTest: () ->
    @flr = new reader './files/test.log', 200
    @readLine()
    this

  readLine: () =>
    if @flr.hasNextLine
      line = @flr.nextLine()
      data = nmea.parse line

      if !data
        console.log 'Line end'
        return

      if !data.timestamp
        @onData line
        setTimeout @readLine, 5
        return
      else
        now = parseFloat data.timestamp
        if !@lastTimestamp
          timeout = 5
        else
          timeout = Math.max 1000 * (now - @lastTimestamp), 5
        @lastTimestamp = now
        setTimeout @emitLine, timeout, line
    else
      console.log 'Line end'

  this

  emitLine: (line) =>
    @onData line
    @readLine()



exports.createTracker = () ->
  new Tracker() 