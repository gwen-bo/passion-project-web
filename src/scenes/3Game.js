import handR from '../assets/img/keypoints/handR.png'
import handL from '../assets/img/keypoints/handL.png'
import titlescreen from '../assets/img/titlescreen/titlescreen.png'
import betekenisAudio from '../assets/audio/Ondersteboven-zijn-van-iemand-betekent.mp3'
import skip from '../assets/img/tutorial/Skip-tut.png'
import AlignGrid from '../js/utilities/alignGrid'

// gameplay scene
import score0 from '../assets/img/game/meter/0.png'
import score1 from '../assets/img/game/meter/1.png'
import score2 from '../assets/img/game/meter/2.png'
import score3 from '../assets/img/game/meter/3.png'
import score4 from '../assets/img/game/meter/4.png'
import score5 from '../assets/img/game/meter/5.png'
import score6 from '../assets/img/game/meter/6.png'
import score7 from '../assets/img/game/meter/7.png'
import score8 from '../assets/img/game/meter/8.png'
import score9 from '../assets/img/game/meter/9.png'
import score10 from '../assets/img/game/meter/10.png'
import score11 from '../assets/img/game/meter/11.png'
import score12 from '../assets/img/game/meter/12.png'
import score13 from '../assets/img/game/meter/13.png'
import hart3 from '../assets/img/game/sprites/hart3.png'
import hart4 from '../assets/img/game/sprites/hart4.png'
import hart1 from '../assets/img/game/sprites/hart1.png'
import hart6 from '../assets/img/game/sprites/hart6.png'
import plant2 from '../assets/img/tutorial/plant2.png'
import plantR from '../assets/img/game/visuals/plantR.png'
import plantL from '../assets/img/game/visuals/plantL.png'
import hit from '../assets/audio/hit.mp3'
import backgroundMusic from '../assets/audio/background-music.mp3'
import Klaar from '../assets/audio/Klaar-start.mp3'
import Super from '../assets/audio/Super.mp3'
import BijnaVol from '../assets/audio/Nog-eentje-de-meter-zit-bijna-vol.mp3'
import EersteAl from '../assets/audio/Super-Dat-is-de-eerste-al.mp3'
import Afsluiten from '../assets/audio/Oeps-niemand-te-zien.mp3'

export class GameScene extends Phaser.Scene{
    constructor(config){
      super(config);
    }

    score; 
    restart; 
    restartNext; 
    
      init = (data) => {

      this.t = 0; 
      this.score = 0;
      this.pausedScore = 0; 
      this.gameStarted = false; 

      this.restart = data.restart;
      this.restartNext = data.restart;
      if(this.restart === true){
        this.scene.restart({ restart: false})
      }

      this.skeleton = {
        "leftWrist": {part: "leftWrist", x: 500, y: 500},
        "rightWrist": {part: "rightWrist", x: 500, y: 500},
      };
    }

    preload(){
      let progressBar = this.add.graphics();
      let progressBox = this.add.graphics();
      progressBox.fillStyle(0xffc9bc);
      progressBox.fillRect((window.innerWidth/2) -160, (window.innerHeight/2) -25, 320, 50);

      let loadingText = this.make.text({
        x: (window.innerWidth/2),
        y: (window.innerHeight/2),
        text: 'Aan het laden...',
        style: {
            font: '20px monospace',
            fill: '#fd4e05'
        }
      });

      loadingText.setOrigin(0.5, 0.5);
        this.load.on('progress', function (value) {
          console.log(value);
          progressBar.clear();
          progressBar.fillStyle(0xfd4e05);
          progressBar.fillRect((window.innerWidth/2) -150, (window.innerHeight/2) -15, 300 * value, 30);
      });
                        
      this.load.on('complete', function () {
          console.log('complete');
          progressBar.destroy();
          progressBox.destroy();
          loadingText.destroy();
      });

      this.load.spritesheet('titlescreen', titlescreen, { frameWidth: 960, frameHeight: 945.47 });
      this.load.image('skip', skip);
      this.load.image('handR', handR);
      this.load.image('handL', handL);
      this.load.audio('betekenisAudio', betekenisAudio);
      
      this.load.audio('hit', hit);
      this.load.spritesheet('hart3', hart3, { frameWidth: 337, frameHeight: 409 });
      this.load.spritesheet('hart4', hart4, { frameWidth: 337, frameHeight: 409 });
      this.load.spritesheet('hart1', hart1, { frameWidth: 337, frameHeight: 409 });
      this.load.spritesheet('hart6', hart6, { frameWidth: 337, frameHeight: 409 });
  
      this.load.spritesheet('plantR', plantR, { frameWidth: 695, frameHeight: 809 });
      this.load.spritesheet('plantL', plantL, { frameWidth: 695, frameHeight: 809 });
      this.load.spritesheet('plant2', plant2, { frameWidth: 695, frameHeight: 465 });

      this.load.image('score-0', score0);
      this.load.image('score-1', score1);
      this.load.image('score-2', score2);
      this.load.image('score-3', score3);
      this.load.image('score-4', score4);
      this.load.image('score-5', score5);
      this.load.image('score-6', score6);
      this.load.image('score-7', score7);
      this.load.image('score-8', score8);
      this.load.image('score-9', score9);
      this.load.image('score-10', score10);
      this.load.image('score-11', score11);
      this.load.image('score-12', score12);
      this.load.image('score-13', score13);
  
      this.load.audio('Klaar', Klaar);
      this.load.audio('Super', Super);
      this.load.audio('EersteAl', EersteAl);
      this.load.audio('BijnaVol', BijnaVol);
      this.load.audio('Afsluiten', Afsluiten);
      this.load.audio('backgroundMusic', backgroundMusic);      
    }


    handLeft = undefined; 
    handRight = undefined; 
    targetGroup; 
    scoreMeter; 
    hitSound;
    keypointGroup
    titlescreen;
    skipButton
    aGrid; 
  
    posenetplugin;
    create(){  
      this.score = 0;
      this.pausedScore = 0; 

      this.posenetplugin = this.plugins.get('PoseNetPlugin');
      this.aGrid = new AlignGrid({scene: this.scene, rows:25, cols: 25, height: window.innerHeight, width: window.innerWidth})
      // this.aGrid.showNumbers();
      this.skipButton = this.add.image(0, 0, 'skip').setScale(.6);
      this.skipButton.setInteractive({ useHandCursor: true });
      this.skipButton.on('pointerdown', () => this.startGame() );
      this.aGrid.placeAtIndex(597, this.skipButton); 

      this.keypointsGameOjb.leftWrist = this.add.image(this.skeleton.leftWrist.x, this.skeleton.leftWrist.y, 'handL').setScale(0.5);
      this.handLeft = this.physics.add.existing(this.keypointsGameOjb.leftWrist);
      this.keypointsGameOjb.rightWrist = this.add.image(this.skeleton.rightWrist.x,this.skeleton.rightWrist.y, 'handR').setScale(0.5);
      this.handRight = this.physics.add.existing(this.keypointsGameOjb.rightWrist);  
      this.keypointGroup = this.physics.add.group([this.handLeft, this.handRight]); 
      this.targetGroup = this.physics.add.group(); 
      this.physics.add.overlap(this.keypointGroup, this.targetGroup, this.handleHit, null, this);

      this.titlescreen = this.add.sprite(0, 0, 'titlescreen', 0).setScale(0.8);
      this.aGrid.placeAtIndex(312, this.titlescreen); 
      this.anims.create({
        key: 'welcome',
        frames: this.anims.generateFrameNumbers('titlescreen', { start: 0, end: 3 }),
        frameRate: 3,
        repeat: -1
      });
      this.titlescreen.anims.play('welcome');
      
      this.betekenisAudio = this.sound.add('betekenisAudio', {loop: false});
      this.betekenisAudio.play();
      this.betekenisAudio.on('complete', this.createAssetsGame, this.scene.scene);
    }

    startGame(){
      this.skipButton.destroy();
      this.titlescreen.destroy();
      this.betekenisAudio.stop();
      this.createAssetsGame();
    }

    gameStarted = false; 
    createAssetsGame(){
      this.gameStarted = true; 

      // verwijder huidige zaken (begin)
      this.titlescreen.destroy();
      this.skipButton.destroy();

      // voeg game zaken toe (game)
      this.targetTimer = this.time.addEvent({ delay: 3000, callback: this.createCoordinates, callbackScope: this, loop: true });    
      this.targetTimer.paused = true; 
      this.scoreMeter = this.add.image(0, 0, 'score-0').setScale(.7);
      this.aGrid.placeAtIndex(137, this.scoreMeter); 
      const plantR = this.add.sprite(0, 0, 'plantR', 0).setScale(0.5);
      this.anims.create({
        key: 'plantR-move',
        frames: this.anims.generateFrameNumbers('plantR', { start: 0, end: 2 }),
        frameRate: 2,
        repeat: -1
      });
      plantR.play('plantR-move');
      const plant2 = this.add.sprite(0, 0, 'plant2', 0).setScale(0.5).setDepth(1);
      this.anims.create({
        key: 'plant2-move',
        frames: this.anims.generateFrameNumbers('plant2', { start: 0, end: 2 }),
        frameRate: 2,
        repeat: -1
      });
      plant2.play('plant2-move');  
      const plantL = this.add.sprite(0, 0, 'plantL', 0).setScale(0.5);
      this.anims.create({
        key: 'plantL-move',
        frames: this.anims.generateFrameNumbers('plantL', { start: 0, end: 2 }),
        frameRate: 2,
        repeat: -1
      });
      plantL.play('plantL-move');
      this.aGrid.placeAtIndex(497, plantL); //497
      this.aGrid.placeAtIndex(502, plantR);
      this.aGrid.placeAtIndex(53, plant2); 

      this.hitSound = this.sound.add('hit', {loop: false});

      this.klaar = this.sound.add('Klaar', {loop: false});
      this.super = this.sound.add('Super', {loop: false});
      this.bijnaVol = this.sound.add('BijnaVol', {loop: false});
      this.eersteAl = this.sound.add('EersteAl', {loop: false});
      this.afsluiten = this.sound.add('Afsluiten', {loop: false});
      this.backgroundMusic = this.sound.add('backgroundMusic', {loop: true});
      this.backgroundMusic.setVolume(0.1);
      this.klaar.play();
      this.klaar.on('complete', this.handleStart, this.scene.scene);
    }

    targetTimer; 
    handleStart(){
      this.createCoordinates();
      this.backgroundMusic.play();
      this.targetTimer.paused = false; 
    }

    handleVisualsAndAudio(target){
      let sprite = target.anims.currentFrame.textureKey;
      switch(sprite){
        case 'hart3': 
          target.anims.play('hit3');
        break; 
        case 'hart4': 
          target.anims.play('hit4');
        break;
        case 'hart1': 
          target.anims.play('hit1');
        break;
        case 'hart6': 
          target.anims.play('hit6');
        break;
      }
  
      this.hitSound.play();
      target.on('animationcomplete', function(){
        target.destroy();
      })
  
      switch(this.score){
        case 1: 
          this.eersteAl.play();
        break; 
        case 5: 
          this.super.play();
        break; 
        case 12: 
          this.bijnaVol.play();
        break; 
        case 13: 
          this.bijnaVol.stop();
          this.backgroundMusic.stop();
          this.scene.start('ending');    
        break; 
      }
    }
  
  
    handleHit (hand, target){
      this.targetGroup.remove(target);
      this.score++;
      this.handleVisualsAndAudio(target);
      return; 
  }
  
  // checking if distance is big enough between the coördinates
  x; 
  y; 
  previousX =0; 
  previousY =0;
  createCoordinates(){
    this.targetGroup.clear(true, true);
    this.x = Phaser.Math.Between(200, (window.innerWidth - 200));
    this.y = Phaser.Math.Between(400, (window.innerHeight - 200));
  
    if(!(this.previousY === undefined && this.previousX === undefined)){
      let distance = Phaser.Math.Distance.Between(this.x, this.y, this.previousX, this.previousY);
        if(distance <= 400){
          this.createCoordinates();
          return; 
        }else {
          this.drawGoal();
          this.previousX = this.x; 
          this.previousY = this.y;   
        }
    }else{
      this.drawGoal();
    }
  }
   
  drawGoal(){
    // this.targetGroup.clear(true, true);
    const targets = ["hart3", "hart4", "hart1", "hart6"];
    let currentTarget = targets[Math.floor(Math.random()*targets.length)];
    let newTarget; 
    
    switch(currentTarget){
      case "hart3": 
        newTarget = this.add.sprite(this.x, this.y, 'hart3', 0).setScale(0.5);
        this.anims.create({
          key: 'beweeg3',
          frames: this.anims.generateFrameNumbers('hart3', { start: 17, end: 18 }),
          frameRate: 5,
          repeat: -1
        });
        this.anims.create({
          key: 'hit3',
          frames: this.anims.generateFrameNumbers('hart3', { start: 0, end: 16 }),
          frameRate: 15,
          repeat: 0
        });
        newTarget.anims.play('beweeg3');
      break;
      case "hart4": 
        newTarget = this.add.sprite(this.x, this.y, 'hart4', 0).setScale(0.5);
        this.anims.create({
          key: 'beweeg4',
          frames: this.anims.generateFrameNumbers('hart4', { start: 17, end: 18 }),
          frameRate: 5,
          repeat: -1
        });
        this.anims.create({
          key: 'hit4',
          frames: this.anims.generateFrameNumbers('hart4', { start: 0, end: 16 }),
          frameRate: 15,
          repeat: 0
        });
        newTarget.anims.play('beweeg4');
      break;
      case "hart1": 
        newTarget = this.add.sprite(this.x, this.y, 'hart1', 0).setScale(0.5);
        this.anims.create({
          key: 'beweeg1',
          frames: this.anims.generateFrameNumbers('hart1', { start: 17, end: 18 }),
          frameRate: 5,
          repeat: -1
        });
        this.anims.create({
          key: 'hit1',
          frames: this.anims.generateFrameNumbers('hart1', { start: 0, end: 16 }),
          frameRate: 15,
          repeat: 0
        });
        newTarget.anims.play('beweeg1');
      break;
      case "hart6": 
        newTarget = this.add.sprite(this.x, this.y, 'hart6', 0).setScale(0.5);
        this.anims.create({
          key: 'beweeg6',
          frames: this.anims.generateFrameNumbers('hart6', { start: 17, end: 18 }),
          frameRate: 5,
          repeat: -1
        });
        this.anims.create({
          key: 'hit6',
          frames: this.anims.generateFrameNumbers('hart6', { start: 0, end: 16 }),
          frameRate: 15,
          repeat: 0
        });
        newTarget.anims.play('beweeg6');
      break;
  }
    this.targetGroup.add(newTarget, false);
  }
  
    pausedScore = 0; 
    // PLUGIN
    handlePoses(poses){
      poses.forEach(({score, keypoints}) => {
        if(score >= 0.4){
          this.pausedScore = 0; 
          this.drawKeypoints(keypoints);
          return; 
        }else if (score <= 0.07){
          this.pausedScore++
        }
      })
    }

    skeleton;
    keypointsGameOjb = {
      leftWrist: undefined,
      rightWrist: undefined, 
    }

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

    fetchPoses = async () => {
      let poses = await this.posenetplugin.poseEstimation();
      this.handlePoses(poses);
    }

    handleShutDown(){
      this.scene.sleep('timeOut');
      this.backgroundMusic.stop();
      this.scene.start('startup');
    }

    update(){
      this.fetchPoses();

      this.keypointsGameOjb.leftWrist.x = this.skeleton.leftWrist.x;
      this.keypointsGameOjb.leftWrist.y = this.skeleton.leftWrist.y;
  
      this.keypointsGameOjb.rightWrist.x = this.skeleton.rightWrist.x;
      this.keypointsGameOjb.rightWrist.y = this.skeleton.rightWrist.y;  
  
      if(this.gameStarted === true){
        this.scoreMeter.setTexture(`score-${this.score}`);

        if(this.pausedScore === 10){    
          this.scene.launch('timeOut', {currentScene: 'gameplay'});  
        }else if(this.pausedScore <= 500 && this.pausedScore >= 450){ 
          this.afsluiten.play();
          this.afsluiten.on('complete', this.handleShutDown, this.scene.scene);
        }else if(this.pausedScore === 0){
          this.scene.sleep('timeOut');
        }
      }

    }
  
  }