
function Effect() {
	var self = this;

	this.meshes = [
		{ file:"sunglasse_music_ed2.bsm2", anims:[
			{ a:"static", t:0 },
		] },
	];

	// this.play = function() {
	// 	var now = (new Date()).getTime();
	// 	// if(isMouthOpen(world.landmarks, world.latents)) {
	// 	// 	Api.hideHint();
	// 	// }
	// };

	this.init = function() {
		Api.meshfxMsg("spawn", 2, 0, "tri.bsm2");
		Api.meshfxMsg("spawn", 1, 0, "!glfx_FACE");

		Api.meshfxMsg("spawn", 0, 0, "sunglasse_music_ed2.bsm2");
		Api.meshfxMsg("animOnce", 0, 0, "static");

		// self.faceActions = [self.play];
		// Api.showHint("Open mouth");
		Api.playVideo("frx",true,1);
		Api.playSound("Sunglasses_music_v4.m4a",true,1);
		// Api.playSound("sfx.aac",false,1);
		Api.showRecordButton();
	};

	this.restart = function() {
		Api.meshfxReset();
		Api.stopVideo("frx");
		//Api.stopSound("Sunglasses_music_v4.m4a")
		// Api.stopSound("sfx.aac");
		self.init();
	};

	this.faceActions = [];
	this.noFaceActions = [];

	this.videoRecordStartActions = [];
	this.videoRecordFinishActions = [];
	this.videoRecordDiscardActions = [this.restart];
}

configure(new Effect());
