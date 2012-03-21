vows = require 'vows'
assert = require 'assert'
fs = require 'fs'
flr = require('../fileLineReader/fileLineReader.js')

# Test suite
vows.describe('FileLineReader').addBatch({
    'when reading two lines separated by \\r': {
        topic: () ->
            rtxt = 'Hello\rWorld'
            fs.writeFileSync 'testr.txt', rtxt

            flr.createReader 'testr.txt'

        ,'we get two lines': (reader) ->
            assert.equal reader.readLine(), 'Hello'
            assert.equal reader.readLine(), 'World'
            assert.equal reader.eof(), true

        ,teardown: () ->
            fs.unlinkSync 'testr.txt'
    },
    'when reading two lines separated by \\n': {
        topic: () ->
            ntxt = 'Hello\nWorld'
            fs.writeFileSync 'testn.txt', ntxt

            flr.createReader 'testn.txt'

        ,'we get two lines': (reader) ->
            assert.equal reader.readLine(), 'Hello'
            assert.equal reader.readLine(), 'World'
            assert.equal reader.eof(), true

        ,teardown: () ->
            fs.unlinkSync 'testn.txt'
    },
    'when reading two lines separated by \\r\\n': {
        topic: () ->
            rntxt = 'Hello\r\nWorld'
            fs.writeFileSync 'testrn.txt', rntxt

            flr.createReader 'testrn.txt'

        ,'we get two lines': (reader) ->
            assert.equal reader.readLine(), 'Hello'
            assert.equal reader.readLine(), 'World'
            assert.equal reader.eof(), true

        ,teardown: () ->
            fs.unlinkSync 'testrn.txt'
    }
}).export module