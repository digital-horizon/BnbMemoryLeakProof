function Effect() {
    var self = this;

    this.meshes = [
        { file: "morph.bsm2", anims: [
            { a: "static", t: 0 },
        ] },
        { file: "headphones.bsm2", anims: [
            { a: "start", t: 4133 },
            { a: "loop", t: 4066 },
        ] },
    ];

    this.play = function() {
        var now = (new Date()).getTime();
        if(now > self.t) {
            Api.playVideoRange("frx",125./30.,247./30.,true,1);
            self.faceActions = [];
        }
    };

    this.init = function() {
        Api.playVideoRange("frx",0,125./30.,false,1);

        Api.meshfxMsg("spawn", 2, 0, "!glfx_FACE");
        Api.meshfxMsg("spawn", 0, 0, "morph.bsm2");
        Api.meshfxMsg("spawn", 1, 0, "headphones.bsm2");
        Api.meshfxMsg("animOnce", 1, 0, "start");
        Api.meshfxMsg("animLoop", 1, 1, "loop");

        self.t = (new Date()).getTime() + 125./30.*1000.;
        self.faceActions = [self.play];

        Api.playSound("musicmoodheadphones_music_L_Ch.m4a",true,1);
        Api.showRecordButton();
    };

    this.restart = function() {
        Api.meshfxReset();
        Api.stopVideo("frx");
        Api.stopSound("musicmoodheadphones_music_L_Ch.m4a");
        self.init();
    };

    this.faceActions = [];
    this.noFaceActions = [];

    this.videoRecordStartActions = [];
    this.videoRecordFinishActions = [];
    this.videoRecordDiscardActions = [this.restart];
}

configure(new Effect());