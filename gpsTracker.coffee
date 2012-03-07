serialport = require 'serialport'
nmea = require 'nmea'

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
              console.log data
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
    deg = val.substring(0, val.indexOf '.' - 2)
    min = val.substring(deg.length)

    parseInt(deg, 10) + (parseFloat(min, 10) / 60) 



exports.createTracker = () ->
  new Tracker() 