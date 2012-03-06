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
    unless !data
      switch data.type
        when 'satellite-list-partial' then @parseSatelliteListMessage data
        when 'fix'
          unless !@fixCallback
            @fixCallback null, data
        #else console.log data

  parseSatelliteListMessage: (data) =>
    if !@satelliteListPartial
      @satelliteListPartial = data
    else
      @satelliteListPartial.satellites = @satelliteListPartial.satellites.concat data.satellites

    if @satelliteListPartial.numMsgs is data.msgNum
      @satelliteListPartial.msgNum = data.msgNum
      @satelliteListCallback null, @satelliteListPartial
      @satelliteListPartial = null


module.exports = Tracker 