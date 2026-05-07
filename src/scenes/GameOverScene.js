import Phaser from 'phaser'

export default class GameOverScene extends Phaser.Scene {

    constructor() {
        super('GameOverScene')
    }

    create() {

        this.cameras.main.setBackgroundColor('#000000')

        const gameOverText = this.add.text(
            200,
            180,
            'GAME OVER',
            {
                fontSize: '48px',
                fill: '#ff0000',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5)

        gameOverText.setScale(0)

        this.tweens.add({
            targets: gameOverText,
            scale: 1,
            duration: 500,
            ease: 'Back.Out'
        })

        const restartButton = this.add.text(
            200,
            350,
            'RESTART',
            {
                fontSize: '32px',
                fill: '#ffffff',
                backgroundColor: '#444444',
                padding: {
                    x: 20,
                    y: 10
                }
            }
        ).setOrigin(0.5)

        restartButton.setInteractive()

        restartButton.on('pointerdown', () => {
            this.scene.start('GameScene')
        })

        const menuButton = this.add.text(
            200,
            450,
            'MAIN MENU',
            {
                fontSize: '32px',
                fill: '#ffffff',
                backgroundColor: '#444444',
                padding: {
                    x: 20,
                    y: 10
                }
            }
        ).setOrigin(0.5)

        menuButton.setInteractive()

        menuButton.on('pointerdown', () => {
            this.scene.start('MenuScene')
        })
    }
}