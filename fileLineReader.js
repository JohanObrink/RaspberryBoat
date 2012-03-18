(function() {
  var FileLineReader, fs;

  fs = require('fs');

  FileLineReader = (function() {

    FileLineReader.position = 0;

    FileLineReader._eof = false;

    FileLineReader.fd = null;

    FileLineReader.saved = null;

    function FileLineReader(path, encoding) {
      this.path = path;
      this.encoding = encoding;
      if (!this.encoding) this.encoding = 'ascii';
      this.fd = fs.openSync(this.path, 'r');
    }

    FileLineReader.prototype.readLine = function() {
      var c, lf, next, result;
      if (this._eof) return null;
      if (this.saved != null) {
        result = this.saved;
        this.saved = null;
      } else {
        result = '';
      }
      lf = false;
      while (!lf && !this._eof) {
        next = fs.readSync(this.fd, 1, this.position++, this.encoding);
        if (next[1] === 1) {
          c = next[0];
          if (c === '\r' || c === '\n') {
            if (c === '\r') {
              this.saved = fs.readSync(this.fd, 1, this.position, this.encoding)[0];
              if (this.saved === '\n') this.saved = null;
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

  exports.createReader = function(path, encoding) {
    return new FileLineReader(path, encoding);
  };

}).call(this);
