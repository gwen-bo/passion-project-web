// import title1 from '../assets/img/titlescreen/title.png'
// import title2 from '../assets/img/titlescreen/title2.png'
import titlescreen from '../assets/img/titlescreen/titlescreen.png'
import welcomeSound from '../assets/audio/welcome.mp3'

import AlignGrid from '../js/utilities/alignGrid'

export class WelcomeScene extends Phaser.Scene{
    constructor(config){
      super(config);
    }

    restart; 
    restartNext; 
  
    t = 0; 
  
      init = (data) => {

      console.log(`WelcomeScene INIT`);
      this.t = 0; 

      this.restart = data.restart;
      this.restartNext = data.restart;
        console.log(this.restart );
      if(this.restart === true){
        console.log('restarting');
        this.scene.restart({ restart: false})

      }
    }
    
    begroeting; 
    preload(){
      this.load.spritesheet('titlescreen', titlescreen, { frameWidth: 702, frameHeight: 947 });
      this.load.audio('welcomeSound', welcomeSound);
      // this.begroeting = this.load.audio('begroeting', 'assets/audio/SoundEffects/explosion.mp3');
    }
    
    create(){  
      this.timedEvent = this.time.addEvent({ delay: 1000, callback: this.onEvent, callbackScope: this, repeat: 10 });    
      let title = this.add.sprite(0, 0, 'titlescreen', 0).setScale(0.8);
      this.aGrid = new AlignGrid({scene: this.scene, rows:15, cols: 11, height: window.innerHeight, width: window.innerWidth})
      // this.aGrid.showNumbers();
      this.aGrid.placeAtIndex(82, title);
      this.anims.create({
        key: 'welcome',
        frames: this.anims.generateFrameNumbers('titlescreen', { start: 0, end: 1 }),
        frameRate: 3,
        repeat: -1
      });
      title.anims.play('welcome');
      
      this.welcomeSound = this.sound.add('welcomeSound', {loop: false});
      this.welcomeSound.play();
    }

    t = 0; 
    onEvent(){
      this.t++
      if(this.t === 3){
        console.log('time event', this.t);
        this.scene.start('tutorial1', {restart: this.restartNext});    
      }
    }

    
    update(){
    }
  
  }