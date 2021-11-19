var out_of_date = false;

function onFRXUpdate(strLandmarks, strLatents, head_latents) {
	if (head_latents == undefined) {
		if (out_of_date)
			return;
		out_of_date = true;
		Api.showHint('Your application is out of date. Update it to make all effects available to use.');
		return;
	}

	world.landmarks = strLandmarks ? strLandmarks : [];
	world.latents = strLatents ? strLatents : [];
	world.head_latents = head_latents ? head_latents : [];

	for (var i = 0; i < effect.faceActions.length; i++) {
		effect.faceActions[i]();
	}
}

function Effect() {
    var self = this;

    this.init = function() {
        Api.meshfxMsg("spawn", 2, 0, "!glfx_FACE");

        Api.meshfxMsg("spawn", 0, 0, "rap_all.bsm2");
        // Api.meshfxMsg("animOnce", 0, 0, "static");

        Api.meshfxMsg("spawn", 1, 0, "BeautyFaceSP.bsm2");
        // Api.meshfxMsg("animOnce", 1, 0, "static");
        Api.meshfxMsg("spawn", 3, 0, "cut_body.bsm2");

        Api.meshfxMsg("dynImass", 0, 0, "Cylinder");
		Api.meshfxMsg("dynImass", 0, 0, "CATRigHub001");
		Api.meshfxMsg("dynImass", 0, 10, "CATRigTail1");
		Api.meshfxMsg("dynImass", 0, 10, "CATRigTail2");
		Api.meshfxMsg("dynImass", 0, 10, "CATRigTail3");
		Api.meshfxMsg("dynImass", 0, 10, "CATRigTail4");
		Api.meshfxMsg("dynImass", 0, 10, "CATRigTail5");
		Api.meshfxMsg("dynImass", 0, 0, "glass");
		Api.meshfxMsg("dynImass", 0, 0, "pCylinder1");
		Api.meshfxMsg("dynImass", 0, 0, "cap");

        Api.meshfxMsg("dynGravity", 0, 0, "0 -700 220");


		// Api.showHint("Open Mouth!!!!!!!11111");	

		// Api.meshfxMsg("dynSphere", 0, 0, "0 -80 -160 72");

        // Api.showHint("Open mouth");
        // Api.playVideo("frx",true,1);
        
		Api.playSound("Tra2.mp3", true, 1);
        Api.showRecordButton();
    };

    this.restart = function() {
        Api.meshfxReset();
        // Api.stopVideo("frx");
        Api.stopSound("Tra2.mp3");
        self.init();
    };

    this.faceActions = [];
    this.noFaceActions = [];

    this.videoRecordStartActions = [];
    this.videoRecordFinishActions = [];
    this.videoRecordDiscardActions = [this.restart];
}

configure(new Effect());