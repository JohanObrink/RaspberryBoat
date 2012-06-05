"use strict";
module.exports = (function() {

	var convertNmeaToDecimal = function(val) {
		var deg, min;
		deg = val.substring(0, val.indexOf('.') - 2);
		min = val.substring(deg.length);
		return parseInt(deg, 10) + (parseFloat(min) / 60);
	};

	return {
		convertNmeaToDecimal: convertNmeaToDecimal
	};

})();