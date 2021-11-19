function Effect() {
    var self = this;



    this.play = function() {
        var now = (new Date()).getTime();
        
    };

    this.init = function() {
        Api.meshfxMsg("spawn", 1, 0, "!glfx_FACE");
        Api.meshfxMsg("spawn", 2, 0, "cut.bsm2");
        Api.meshfxMsg("spawn", 3, 0, "ring.bsm2");

        self.faceActions = [self.play];
        Api.showRecordButton();
    };

    this.restart = function() {
        Api.meshfxReset();
        self.init();
    };

    this.faceActions = [];
    this.noFaceActions = [];

    this.videoRecordStartActions = [];
    this.videoRecordFinishActions = [];
    this.videoRecordDiscardActions = [this.restart];
}

configure(new Effect());