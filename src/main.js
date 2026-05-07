import Phaser, { Physics } from 'phaser'
import './style.css'
import MenuScene from './scenes/MenuScene'
import GameScene from './scenes/GameScene'
import GameOverScene from './scenes/GameOverScene'

const config = {
    type: Phaser.AUTO,

    width: 400,
    height: 700,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },

    backgroundColor: '#000000',

    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [
        MenuScene,
        GameScene,
        GameOverScene
    ]
}

new Phaser.Game(config)