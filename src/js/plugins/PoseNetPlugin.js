class PoseNetPlugin extends Phaser.Plugins.BasePlugin {

    constructor (pluginManager)
    {
        super('PoseNetPlugin', pluginManager);
    }

    poseNet;
    poses;
    $webcam; 
    loaded = false; 

    init = async () => {
        console.log('PoseNetPlugin has started');
        this.$webcam = document.querySelector('#webcam');
        // this.$webcamFeed = document.querySelector('#webcam-feed');

        this.poses = [];
        this.$webcam.width = window.innerWidth;
        this.$webcam.height = window.innerHeight;

        this.poseNet = await posenet.load();
        const videostream = await navigator.mediaDevices.getUserMedia({ video: true });
        this.$webcam.srcObject = videostream;
        if (!this.$webcam.captureStream) {
            this.$webcam.captureStream = () => videostream;
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

    poseEstimation = async () => {
        if(this.loaded === false){
            return false;
        }
        const pose = await this.poseNet.estimateSinglePose(this.$webcam, {
            flipHorizontal: true,
        });
        // console.log('pose estimation');
        this.poses = this.poses.concat(pose);
        console.log('pose estimation', pose);
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
