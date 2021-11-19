
function Effect() {
	var self = this;

	var timer = new Date().getTime();
	var delay = 3000;

	this.hideHint = function() {
		var now = new Date().getTime();

		if (now >= timer + delay) {
				Api.hideHint();
				var index = self.faceActions.indexOf(self.hideHint);
				self.faceActions.splice(index, 1);
		}

	};

	this.init = function() {
		Api.meshfxMsg("spawn", 4, 0, "!glfx_FACE");
		Api.meshfxMsg("spawn", 0, 0, "tri1.bsm2");
		Api.meshfxMsg("spawn", 1, 0, "tri1.bsm2");

		Api.meshfxMsg( "tex", 0, 0, texturesToChange[0].from);
		Api.meshfxMsg( "tex", 1, 0, texturesToChange[0].to);
		Api.meshfxMsg( "shaderVec4", 0, 0, "1.0 0.0 0.0 0.0");
		Api.meshfxMsg( "shaderVec4", 0, 1, "0.0 0.0 0.0 0.0");

		Api.showHint('Tap');
		self.faceActions.push(self.hideHint);
		Api.showRecordButton();
	};

	this.restart = function() {
		Api.meshfxReset();
		self.init();
		Api.hideHint();
	};

	this.faceActions = [];
	this.noFaceActions = [];

	this.videoRecordStartActions = [];
	this.videoRecordFinishActions = [];
	this.videoRecordDiscardActions = [this.restart];
}

var blueOpacity = 1.0;
var pinkOpacity = 0.0;

var effect = new Effect();

var isBlue = true;
var isChanged = false;

var texturesToChange = [
	{from: "neon.png", to: "blue.png"},
	{from: "blue.png", to: "pink.png"},
	{from: "pink.png", to: "neon.png"},
];

var counter = -1;

function onTouchesBegan() {
	Api.hideHint();
	if (!isChanged) {
		counter = counter + 1 >= texturesToChange.length ? 0 : counter + 1;

		if (isBlue) {
			Api.meshfxMsg( "tex", 0, 0, texturesToChange[counter].from);
			Api.meshfxMsg( "tex", 1, 0, texturesToChange[counter].to);
		} else {
			Api.meshfxMsg( "tex", 1, 0, texturesToChange[counter].from);
			Api.meshfxMsg( "tex", 0, 0, texturesToChange[counter].to);
		}

		effect.faceActions.push(changeLut());
	}
}

function changeLut() {
	var maxOpacity = 1, minOpacity = 0;

	var deltaList = [16, 16, 16, 16, 16];
  	var lastTime = new Date().getTime();

	isChanged = true;
	return function() {
		var now = new Date().getTime();
		var deltaTime = now - lastTime;
		lastTime = now;
		
		deltaList.shift();
		deltaList.push(deltaTime);

		var delta = average(deltaList);

		maxOpacity -= 1 * delta / 1000;
		minOpacity += 1 * delta / 1000;

		if (isBlue) {
			Api.meshfxMsg( "shaderVec4", 0, 0, maxOpacity + " 0.0 0.0 0.0");
			Api.meshfxMsg( "shaderVec4", 0, 1, minOpacity + "0.0 0.0 0.0");
		} else {
			Api.meshfxMsg( "shaderVec4", 0, 1, maxOpacity + " 0.0 0.0 0.0");
			Api.meshfxMsg( "shaderVec4", 0, 0, minOpacity + "0.0 0.0 0.0");
		}

		if (maxOpacity <= 0 || minOpacity >= 1) {
			maxOpacity = 0;
			minOpacity = 1;

			isBlue = !isBlue;

			effect.faceActions = [];

			isChanged = false;
		}
	};
}


function average(arr) {
	return arr.reduce(function(last, curr) {
		return curr + last;
	}) / arr.length;
}

configure(effect);
