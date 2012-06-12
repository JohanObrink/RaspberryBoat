exports.create = (function() {

	// adds on('event', callback) functionality to target
	// returns a trigger function
	var create = function(target) {

		var listeners = {};

		target.on = function(type, callback) {
			if(!listeners[type])
				listeners[type] = [];
			listeners[type].push(callback);
		};

		var trigger = function() {
			var type = arguments[0];
			if(listeners && listeners[type] && listeners[type].length) {
				for(var i=0; i<listeners[type].length; i++) {
					var func = listeners[type][i];
					if(typeof func == 'function') {
						func();
					}
				}
			}
		}

		return trigger;

	};

	return create;
	
})();