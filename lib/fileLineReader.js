"use strict";
(function() {
  var FileLineReader, fs;

  fs = require('fs');

  FileLineReader = (function() {

    function FileLineReader(path, encoding) {
      this.path = path;
      this.encoding = encoding;
      this.position = 0;
      this._eof = false;
      this.fd = null;
      this.saved = null;
      if (!this.encoding) this.encoding = 'ascii';
      this.fd = fs.openSync(this.path, 'r');
    }

    FileLineReader.prototype.readLine = function() {
      var c, lf, next, nextChar, result;
      if (this._eof) return null;
      result = '';
      lf = false;
      while (!lf && !this._eof) {
        next = fs.readSync(this.fd, 1, this.position++, this.encoding);
        if (next[1] === 1) {
          c = next[0];
          if (c === '\r' || c === '\n') {
            if (c === '\r') {
              nextChar = fs.readSync(this.fd, 1, this.position, this.encoding)[0];
              if (nextChar === '\n') this.position++;
            }
            lf = true;
          } else {
            result += c;
          }
        } else {
          this._eof = true;
        }
      }
      return result;
    };

    FileLineReader.prototype.eof = function() {
      return this._eof;
    };

    return FileLineReader;

  })();

  exports.create = function(path, encoding) {
    return new FileLineReader(path, encoding);
  };

}).call(this);
