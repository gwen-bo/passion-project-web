import handR from '../assets/img/keypoints/handR.png'
import handL from '../assets/img/keypoints/handL.png'
import titlescreen from '../assets/img/titlescreen/titlescreen.png'
import welcomeSound from '../assets/audio/welcome.mp3'
import betekenisAudio from '../assets/audio/Ondersteboven-zijn-van-iemand-betekent.mp3'
import skip from '../assets/img/tutorial/Skip-tut.png'

import AlignGrid from '../js/utilities/alignGrid'

export class WelcomeScene extends Phaser.Scene{
    constructor(config){
      super(config);
    }

    restart; 
    restartNext; 
    
      init = (data) => {

      console.log(`WelcomeScene INIT`);
      this.t = 0; 

      this.restart = data.restart;
      this.restartNext = data.restart;
      if(this.restart === true){
        console.log('restarting');
        this.scene.restart({ restart: false})
      }

      this.skeleton = {
        "leftWrist": {part: "leftWrist", x: 500, y: 500},
        "rightWrist": {part: "rightWrist", x: 500, y: 500},
      };
    }

    skeleton;

    handleKeyPoint = (keypoint, scale) => {
      if(!(keypoint.part === "leftWrist" || keypoint.part === "rightWrist")) {
          return;
      }
      if(keypoint.score <= 0.25){
          return;
      }
  
      let skeletonPart = this.skeleton[keypoint.part];
      const {y, x} = keypoint.position;
      skeletonPart.x += (x - skeletonPart.x) / 10;
      skeletonPart.y += (y - skeletonPart.y) / 10;
    };

    drawKeypoints = (keypoints, scale = 1) => {
      for (let i = 0; i < keypoints.length; i++) {
          this.handleKeyPoint(keypoints[i], scale);
      }
    }
 
    preload(){
      this.load.spritesheet('titlescreen', titlescreen, { frameWidth: 960, frameHeight: 945.47 });
      this.load.image('skip', skip);
      this.load.image('handR', handR);
      this.load.image('handL', handL);
      this.load.audio('betekenisAudio', betekenisAudio);
    }

    keypointsGameOjb = {
      leftWrist: undefined,
      rightWrist: undefined, 
    }
    handLeft = undefined; 
    handRight = undefined; 
    posenetplugin;
    create(){  
      this.posenetplugin = this.plugins.get('PoseNetPlugin');
      this.aGrid = new AlignGrid({scene: this.scene, rows:25, cols: 25, height: window.innerHeight, width: window.innerWidth})
      // this.aGrid.showNumbers();

      let skipButton = this.add.image(0, 0, 'skip').setScale(.6);
      skipButton.setInteractive({ useHandCursor: true });
      skipButton.on('pointerdown', () => this.startGame() );
      this.aGrid.placeAtIndex(597, skipButton); // 572

      this.keypointsGameOjb.leftWrist = this.add.image(this.skeleton.leftWrist.x, this.skeleton.leftWrist.y, 'handL').setScale(0.5);
      this.handLeft = this.physics.add.existing(this.keypointsGameOjb.leftWrist);
      this.keypointsGameOjb.rightWrist = this.add.image(this.skeleton.rightWrist.x,this.skeleton.rightWrist.y, 'handR').setScale(0.5);
      this.handRight = this.physics.add.existing(this.keypointsGameOjb.rightWrist);  
  
      let title = this.add.sprite(0, 0, 'titlescreen', 0).setScale(0.8);
      this.aGrid.placeAtIndex(312, title); // 
      this.anims.create({
        key: 'welcome',
        frames: this.anims.generateFrameNumbers('titlescreen', { start: 0, end: 3 }),
        frameRate: 3,
        repeat: -1
      });
      title.anims.play('welcome');
      
      this.betekenisAudio = this.sound.add('betekenisAudio', {loop: false});
      this.betekenisAudio.play();
      this.betekenisAudio.on('complete', this.handleEndAudio, this.scene.scene);
    }

    handleEndAudio(){
      console.log('audio is gedaan');
      this.scene.start('gameplay', { restart: this.restartNext, skeletonObj: this.skeleton});    
    }
  
    startGame(){
      this.betekenisAudio.stop();
      this.scene.start('gameplay', { restart: this.restartNext, skeletonObj: this.skeleton});    
    }

      // PLUGIN
    handlePoses(poses){
      poses.forEach(({score, keypoints}) => {
        if(score >= 0.4){
          this.drawKeypoints(keypoints);
          return; 
        }
      })
    }

    fetchPoses = async () => {
      let poses = await this.posenetplugin.poseEstimation();
      this.handlePoses(poses);
    }

    update(){
      this.fetchPoses();

      this.keypointsGameOjb.leftWrist.x = this.skeleton.leftWrist.x;
      this.keypointsGameOjb.leftWrist.y = this.skeleton.leftWrist.y;
  
      this.keypointsGameOjb.rightWrist.x = this.skeleton.rightWrist.x;
      this.keypointsGameOjb.rightWrist.y = this.skeleton.rightWrist.y;  
    }
  
  }