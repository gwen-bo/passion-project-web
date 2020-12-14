import handR from '../assets/img/keypoints/handR.png'
import handL from '../assets/img/keypoints/handL.png'
import hart1 from '../assets/img/game/sprites/hart1.png'
import taDa from '../assets/audio/welcome.mp3'
import uitlegAudio from '../assets/audio/Dit-spel-speel-je-met-je-handen.mp3'
import probeerHartje from '../assets/audio/Probeer-maar-Hartje.mp3'
import Super from '../assets/audio/Super.mp3'

import plant1 from '../assets/img/tutorial/plant1.png'
import plant2 from '../assets/img/tutorial/plant2.png'
import plantL from '../assets/img/game/visuals/plantL.png'
import plantR from '../assets/img/game/visuals/plantR.png'

import AlignGrid from '../js/utilities/alignGrid'

export class UitlegTutScene extends Phaser.Scene{
  constructor(config){
    super(config);
  }

  restart; 
  restartNext; 

    init = (data) => {
    // console.log(`StartScene INIT`);
    this.activeScore = 0;
    this.restart = data.restart;

    this.skeleton = {
      "leftWrist": {part: "leftWrist", x: 400, y: 500},
      "rightWrist": {part: "rightWrist", x: 600, y: 500}
    };

    this.restartNext = data.restart;
    if(this.restart === true){
      // console.log('restarting');
      this.scene.restart({ restart: false})
    }
  }


  posenetplugin;
  preload (){
    this.load.spritesheet('hart1', hart1, { frameWidth: 337, frameHeight: 409 });
    this.load.image('handR', handR);
    this.load.image('handL', handL);

    this.load.spritesheet('plant1', plant1, { frameWidth: 695, frameHeight: 465 });
    this.load.spritesheet('plant2', plant2, { frameWidth: 695, frameHeight: 465 });
    this.load.spritesheet('plantR', plantR, { frameWidth: 695, frameHeight: 809 });
    this.load.spritesheet('plantL', plantL, { frameWidth: 695, frameHeight: 809 });

    this.load.audio('uitlegAudio', uitlegAudio);
    this.load.audio('probeerHartje', probeerHartje);
    this.load.audio('Super', Super);
    this.load.audio('taDa', taDa);
  }
  
  handLeft = undefined; 
  handRight = undefined; 
  posenetplugin;
  aGrid;
  create(){
    this.posenetplugin = this.plugins.get('PoseNetPlugin');

    // let skipButton = this.add.image(0, 0, 'skip').setScale(.6);
    // skipButton.setInteractive({ useHandCursor: true });
    // skipButton.on('pointerdown', () => this.startGame() );

    this.aGrid = new AlignGrid({scene: this.scene, rows:25, cols: 25, height: window.innerHeight, width: window.innerWidth})
    // this.aGrid.showNumbers();

    const plant1 = this.add.sprite(0, 0, 'plant1', 0).setScale(0.5).setDepth(1);
    this.anims.create({
      key: 'plant1-move',
      frames: this.anims.generateFrameNumbers('plant1', { start: 0, end: 2 }),
      frameRate: 2,
      repeat: -1
    });
    plant1.play('plant1-move');    
    const plant2 = this.add.sprite(0, 0, 'plant2', 0).setScale(0.5).setDepth(1);
    this.anims.create({
      key: 'plant2-move',
      frames: this.anims.generateFrameNumbers('plant2', { start: 0, end: 2 }),
      frameRate: 2,
      repeat: -1
    });
    plant2.play('plant2-move');    
    const plantR = this.add.sprite(0, 0, 'plantR', 0).setScale(0.5).setDepth(1);
    this.anims.create({
      key: 'plantR-move',
      frames: this.anims.generateFrameNumbers('plantR', { start: 0, end: 2 }),
      frameRate: 2,
      repeat: -1
    });
    plantR.play('plantR-move');
    const plantL = this.add.sprite(0, 0, 'plantL', 0).setScale(0.5).setDepth(1);
    this.anims.create({
      key: 'plantL-move',
      frames: this.anims.generateFrameNumbers('plantL', { start: 0, end: 2 }),
      frameRate: 2,
      repeat: -1
    });
    plantL.play('plantL-move');    
    this.aGrid.placeAtIndex(522, plantL); 
    this.aGrid.placeAtIndex(527, plantR); 
    this.aGrid.placeAtIndex(561, plant1); 
    this.aGrid.placeAtIndex(67, plant2); 

    this.keypointsGameOjb.leftWrist = this.add.image(this.skeleton.leftWrist.x, this.skeleton.leftWrist.y, 'handL').setScale(0.5).setDepth(1);
    this.keypointsGameOjb.rightWrist = this.add.image(this.skeleton.rightWrist.x,this.skeleton.rightWrist.y, 'handR').setScale(0.5).setDepth(1);

    this.handRight = this.physics.add.existing(this.keypointsGameOjb.rightWrist);
    this.handLeft = this.physics.add.existing(this.keypointsGameOjb.leftWrist);

    this.targetGroup = this.physics.add.group(); 

    this.physics.add.overlap(this.handLeft, this.targetGroup, this.handleHit, null, this);
    this.physics.add.overlap(this.handRight, this.targetGroup, this.handleHit, null, this);

    this.uitlegAudio = this.sound.add('uitlegAudio', {loop: false});
    this.probeerHartje = this.sound.add('probeerHartje', {loop: false});
    this.super = this.sound.add('Super', {loop: false});
    this.taDa = this.sound.add('taDa', {loop: false});

    this.uitlegAudio.play();
    this.showStream();
    this.uitlegAudio.on('complete', this.handleEndAudio, this.scene.scene);
  }

  showStream = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: {
        width: { min: 1024, ideal: 1280, max: 1920 },
        height: { min: 576, ideal: 720, max: 1080 }
      } });
      var video = document.createElement("video");
      video.playsinline = true;
      video.srcObject = mediaStream;
      video.width = window.innerWidth;
      video.height = window.innerHeight;
      video.autoplay = true;
      video.style.display = "none";

      const phaserVideo = new Phaser.GameObjects.Video(this, (window.innerWidth/2), (window.innerHeight/2));
        let scaleX = ((1 / 1280) * window.innerWidth)
        let scaleY = ((1 / 720) * window.innerHeight)
      console.log(phaserVideo);
      phaserVideo.setScale(scaleX, scaleY); 
      phaserVideo.video = video;
      phaserVideo.toggleFlipX();
      phaserVideo.setSize(window.innerWidth, window.innerHeight);
      // phaserVideo.setDisplaySize(window.innerWidth,window.innerHeight)
      this.add.existing(phaserVideo);
      this.loaded = true; 
    } catch (e) {
      console.log("error", e.message, e.name);
    }
  }

  handleEndAudio(){
    console.log('audio is gedaan');
    this.probeerHartje.play();
    this.probeerHartje.on('complete', this.drawTarget, this.scene.scene);
  }

  drawTarget(){
    let target1 = this.add.sprite((window.innerWidth/2), 500, 'hart1', 17).setScale(0.5);
    this.taDa.play();
    this.anims.create({
      key: 'beweeg',
      frames: this.anims.generateFrameNumbers('hart1', { start: 17, end: 18 }),
      frameRate: 3,
      repeat: -1
    });
    this.anims.create({
      key: 'hit',
      frames: this.anims.generateFrameNumbers('hart1', { start: 0, end: 16 }),
      frameRate: 15,
      repeat: 0
    });
    target1.anims.play('beweeg');
    this.targetGroup.add(target1, true);
  }

  // welke functie er opgeropen wordt bij de overlap tussen de speler 
  handleHit (hand, target){
    console.log('hit');
    this.countdownt = 0;
    this.targetGroup.remove(target);
    this.super.play();
    target.anims.play('hit');
    target.on('animationcomplete', function(){
      target.destroy();
    })

    this.time.addEvent({ delay: 1000, callback: this.onHitCountdown, callbackScope: this, repeat: 2 });    
  } 

  countdown = 0; 
  onHitCountdown(){
    this.countdown++
    if(this.countdown >= 1){
      this.uitlegAudio.stop();
      this.probeerHartje.stop();
      this.scene.start('game', {restart: this.restartNext});    
    }
  }

  drawKeypoints = (keypoints, scale = 1) => {
    for (let i = 0; i < keypoints.length; i++) {
        this.handleKeyPoint(keypoints[i], scale);
    }
  }

  keypointsGameOjb = {
    leftWrist: undefined,
    rightWrist: undefined, 
    leftAnkle: undefined, 
    rightAnkle: undefined, 
  }

  skeleton;

  handleKeyPoint = (keypoint, scale) => {
    if(!(keypoint.part === "leftWrist" || keypoint.part === "rightWrist" )) {
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

  activeScore = 0; 
  // PLUGIN
  handlePoses(poses){
    if(poses === false){
      return; 
    }
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