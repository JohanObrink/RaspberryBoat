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

			// convert arguments to regular array
			var args = Array.prototype.slice.call(arguments);

			// the first argument is the type
			var type = args.shift();

			if(listeners && listeners[type] && listeners[type].length) {
				
				// iterate through the registered callback functions
				for(var i=0; i<listeners[type].length; i++) {
					var func = listeners[type][i];

					//check so the callback actually is a function
					if(typeof func == 'function') {

						// call the function with the arguments
						func.apply(null, args);
					}
				}
			}
		}

		return trigger;

	};

	return create;
	
})();