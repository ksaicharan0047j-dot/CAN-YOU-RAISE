import Phaser from 'phaser'
export default class MenuScene extends Phaser.Scene{
    constructor(){
        super('MenuScene')
    }
    create() {
        this.add.text(200, 180, 'ÇAN YOU RISE',{
            fontsize: '42px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5)
        const playButton = this.add.text(300, 320, 'PLAY', {
            fontSize: '36px',
            fill: '#ffffff',
            backgroundColor: '#ff0000',
            padding: {
                x: 20,
                y: 10
            }
        }).setOrigin(0.5)
        playButton.setInteractive()
        playButton.on('pointerdown', () => {
            this.scene.start('GameScene')
        })
        let highScore = 
        localStorage.getItem('highScore') || 0

        this.add.text(200, 400, 'High Score: ' + highScore, {
            fontSize: '28px',
            fill: '#ffffff'
        }).setOrigin(0.5)
        this.add.text(200, 500, 'Move mouse to survive', {
            fontSize: '20px',
            fill: '#aaaaaa'
        }).setOrigin(0.5)
        const exitButton = this.add.text(200, 620, 'EXIT', {
            fontSize: '32px',
            fill: '#ffffff',
            backgroundColor: '#444444',
            padding: {
                x: 20,
                y: 10
            }
        }).setOrigin(0.5)
        exitButton.setInteractive()
        exitButton.on('pointerdown', () => {
            window.close()
        })
    }
}