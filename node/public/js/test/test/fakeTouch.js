function FakeTouch(identifier, x, y, target) {
	this.identifier = identifier;
	this.target = target;
	this.screenX = this.pageX = this.clientX = x;
	this.screenY = this.pageY = this.clientY = y;
}