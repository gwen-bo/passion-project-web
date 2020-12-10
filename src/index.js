import Phaser from "phaser";

import css from './style.css';
import PoseNetPlugin from './js/plugins/PoseNetPlugin.js'

import {StartUpScene} from './scenes/0StartUp.js'; // uitleg/ benodigdheden
import {StartScene} from './scenes/1StartScene.js'; // detection
import {TutorialScene} from './scenes/2Tutorial.js'; // handen tutorial
import {WelcomeScene} from './scenes/3Welcome.js'; // context
// import {GameBegin} from './scenes/7GameBegin.js'; 
import {GamePlayScene} from './scenes/4GamePlayScene.js'; // gameplay 
import {EndingScene} from './scenes/5EndingScene.js'; // ending scene 
import {TimeOutScene} from './scenes/TimeOutScene.js'; // time out function - melding


const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0xFFE5D2,
  plugins: {
    global: [
        { key: 'PoseNetPlugin', plugin: PoseNetPlugin, start: true}
    ]
  },
  physics: {
    default: 'arcade',
    arcade: {
        gravity: 0
    }
  },
  scenes: [],
};

const game = new Phaser.Game(config);

game.scene.add(`startup`, StartUpScene, false);
game.scene.add(`start`, StartScene, false);
game.scene.add(`tutorial`, TutorialScene, false);
game.scene.add(`welcome`, WelcomeScene, false);
// game.scene.add(`gameBegin`, GameBegin, false);
game.scene.add(`gameplay`, GamePlayScene, false);
game.scene.add(`ending`, EndingScene, false);
game.scene.add(`timeOut`, TimeOutScene, false);

game.scene.start(`startup`);