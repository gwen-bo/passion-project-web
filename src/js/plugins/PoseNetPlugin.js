class PoseNetPlugin extends Phaser.Plugins.BasePlugin {

    constructor (pluginManager)
    {
        super('PoseNetPlugin', pluginManager);
    }

    poseNet;
    poses;
    $webcam; 
    loaded = false; 
    videostream
    init = async () => {
        console.log('PoseNetPlugin has started');
        this.$webcam = document.querySelector('#webcam');
        // this.$webcamFeed = document.querySelector('#webcam-feed');

        this.poses = [];
        this.$webcam.width = window.innerWidth;
        this.$webcam.height = window.innerHeight;

        this.poseNet = await posenet.load();
        this.videostream = await navigator.mediaDevices.getUserMedia({ video: {
            width: { min: 1024, ideal: 1280, max: 1920 },
            height: { min: 576, ideal: 720, max: 1080 }
          } });
        this.$webcam.srcObject = this.videostream;
        if (!this.$webcam.captureStream) {
            this.$webcam.captureStream = () => this.videostream;
        };

        this.$webcam.addEventListener('loadeddata', () => {
            console.log('webcam loaded');
            this.loaded = true; 
            if(this.$webcam.paused){
                this.$webcam.play();
            }
            // this.$webcamFeed.srcObject = videostream;
        });
    }

    getWebcamStream(){
        return this.videostream
    }

    poseEstimation = async () => {
        if(this.loaded === false){
            return false;
        }
        const pose = await this.poseNet.estimateSinglePose(this.$webcam, {
            flipHorizontal: true,
        });
        // console.log('pose estimation');
        this.poses = this.poses.concat(pose);
        // console.log('pose estimation', pose);
        return this.poses; 
    }

    start(){
        this.poseEstimation();
    }

    stop(){

    }

    destroy()
{
        this.pluginManager = null;
        this.game = null;
        this.scene = null;
        this.systems = null;
    }
}

module.exports = PoseNetPlugin;
