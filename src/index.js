import Phaser from "phaser";

import css from './style.css';
import PoseNetPlugin from './js/plugins/PoseNetPlugin.js'

import {StartUpScene} from './scenes/0StartUp.js'; // uitleg/ benodigdheden
import {UitlegTutScene} from './scenes/1UitlegTut.js'; // uitleg/ benodigdheden
import {GameScene} from './scenes/3Game.js'; // context + gameplay
import {EndingScene} from './scenes/4EndingScene.js'; // ending scene 
import {TimeOutScene} from './scenes/TimeOutScene.js'; // time out function - melding

require('./assets/favicon.ico');

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
game.scene.add(`uitlegTut`, UitlegTutScene, false);
game.scene.add(`game`, GameScene, false);
game.scene.add(`ending`, EndingScene, false);
game.scene.add(`timeOut`, TimeOutScene, false);

game.scene.start(`startup`, {restart: false});