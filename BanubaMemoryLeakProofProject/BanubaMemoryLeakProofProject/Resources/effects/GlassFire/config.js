function Effect() {
    var self = this;

    /*this.meshes = [
        { file: "GlassFire.bsm2", anims: [
            { a: "CINEMA_4D_Main", t: 1000 },
        ] },
    ];
    */

    /*this.play = function() {
        var now = (new Date()).getTime();
        for(var i = 0; i < self.meshes.length; i++) {
            if(now > self.meshes[i].endTime) {
                self.meshes[i].animIdx = (self.meshes[i].animIdx + 1)%self.meshes[i].anims.length;
                Api.meshfxMsg("animOnce", i, 0, self.meshes[i].anims[self.meshes[i].animIdx].a);
                self.meshes[i].endTime = now + self.meshes[i].anims[self.meshes[i].animIdx].t;
            }
        }
    };
    */

    this.init = function() {
        Api.meshfxMsg("spawn", 1, 0, "!glfx_FACE");
        Api.meshfxMsg("spawn", 2, 0, "tri.bsm2");
        Api.meshfxMsg("spawn", 0, 0, "GlassFire.bsm2");
        //Api.playVideo("foreground", true, 1);

        /*for(var i = 0; i < self.meshes.length; i++) {
            self.meshes[i].animIdx = -1;
            self.meshes[i].endTime = 0;
        }
        */

        self.faceActions = [];
        // Api.showHint("Open mouth");
        Api.playVideo("frx",true,1);
        Api.playSound("Glass_Fire_v2.m4a",true,1);
        Api.showRecordButton();
    };

    this.restart = function() {
        Api.meshfxReset();
        Api.stopVideo("frx");
        //Api.stopSound("Glass_Fire_v2.m4a");
        self.init();
    };

    this.faceActions = [];
    this.noFaceActions = [];

    this.videoRecordStartActions = [];
    this.videoRecordFinishActions = [];
    this.videoRecordDiscardActions = [this.restart];
}

configure(new Effect());