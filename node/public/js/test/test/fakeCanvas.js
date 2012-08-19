function FakeCanvas(width, height) {
	this.width = width;
	this.height = height;
}

FakeCanvas.prototype = {

	listeners: {},
	context: null,

	addEventListener: function(name, callback, something) {
		if(!this.listeners[name])
			this.listeners[name] = [];
		this.listeners[name].push(callback);
	},

	getContext: function(type) {
		if(this.context == null)
			this.context = new FakeContext();
		return this.context;
	},

	triggerEvent: function(name, e) {
		if(!this.listeners[name])
			throw new Error('no listeners');
		for(var i = 0; i < this.listeners[name].length; i++)
			this.listeners[name][i].call(this, e);
	}

};

function FakeContext() {

}

FakeContext.prototype = {
	clearRect: function() {},
	beginPath: function() {},
	fillText: function() {},
	arc: function() {},
	stroke: function() {}
};

function $(obj) {
	return {
		position: function() {
			return { left: 0, top: 0 };
		}
	}
}