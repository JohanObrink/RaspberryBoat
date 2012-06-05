"use strict";
function TurnTaker() {
	this.calls = [];
}

TurnTaker.prototype = {

	addCall: function(func) {
		this.calls.push(func);
	},

	start: function(limit) {
		
	},

	stop: function() {

	}

};

module.exports = TurnTaker;