// import PoseNetPlugin from "../index";
import button from '../assets/img/start-up/start-button.png'
import uitleg from '../assets/img/start-up/uitleg.png'

import AlignGrid from '../js/utilities/alignGrid'

export class StartUpScene extends Phaser.Scene{
  constructor(config){
    super(config);
  }


    init = () => {
    }

  preload(){
    this.load.image('button', button);
    this.load.image('uitleg', uitleg);
  }
  
  create(){
    console.log(this.game);
    
    let button = this.add.image(0, 0, 'button').setScale(.5);
    let uitleg = this.add.image(0, 0, 'uitleg').setScale(.5);
    button.setInteractive({ useHandCursor: true });
    button.on('pointerdown', () => this.startGame() );

    this.aGrid = new AlignGrid({scene: this.scene, rows:25, cols: 11, height: window.innerHeight, width: window.innerWidth})
    // this.aGrid.showNumbers();
    this.aGrid.placeAtIndex(104, uitleg);
    this.aGrid.placeAtIndex(225, button);
  }

  startGame(){
    this.scene.start('uitlegTut', {restart: false});    
  }


}