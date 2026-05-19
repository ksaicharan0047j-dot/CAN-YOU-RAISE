import Phaser from 'phaser'
export default class MenuScene extends Phaser.Scene{
    constructor(){
        super('MenuScene')
    }
    create() {
        const highScore = localStorage.getItem('highScore') || 0
        const totalCoins = localStorage.getItem('totalCoins') || 0
        this.add.text(
            200,
            120,
            'CAN YOU RISE',
            {
                fontSize: '42px',
                fill: '#ffffff',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5)
        const playButton = this.add.text(
            240,
            240,
            'PLAY',
            {
                fontSize: '38px',
                fill: '#ffffff',
                backgroundColor: '#ff2222',
                padding: {
                    x: 24,
                    y: 12
                }
            }
        ).setOrigin(0.5)

        playButton.setInteractive()
        playButton.on(
            'pointerdown',
            () => {
                this.scene.start('GameScene')
            }
        )
        this.add.text(
            200,
            360,
            'HIGH SCORE: ' + highScore,
            {
                fontSize: '30px',
                fill: '#ffffff',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5)
        // HIGH SCORE
    this.add.text(

        200,
        360,

        'HIGH SCORE: ' + highScore,

        {

            fontSize: '30px',

            fill: '#ffffff',

            fontStyle: 'bold'

        }

    ).setOrigin(0.5)

    // TOTAL COINS
    this.add.text(

        200,
        415,

        'TOTAL COINS: ' + totalCoins,

        {

            fontSize: '28px',

            fill: '#ffdd33',

            fontStyle: 'bold'

        }

    ).setOrigin(0.5)

    // SHOP BUTTON
    const shopButton = this.add.text(

        200,
        500,

        'SHOP',

        {

            fontSize: '32px',

            fill: '#00ffee',

            backgroundColor: '#111111',

            padding: {

                x: 18,
                y: 10

            }

        }

    ).setOrigin(0.5)

    shopButton.setInteractive()

    // TEMP PLACEHOLDER
    shopButton.on(
        'pointerdown',
        () => {

            console.log(
                'SHOP CLICKED'
            )

        }
    )

    // EXIT BUTTON
    const exitButton = this.add.text(

        200,
        590,

        'EXIT',

        {

            fontSize: '30px',

            fill: '#ffffff',

            backgroundColor: '#444444',

            padding: {

                x: 20,
                y: 10

            }

        }

    ).setOrigin(0.5)

    exitButton.setInteractive()

    exitButton.on(
        'pointerdown',
        () => {

            window.close()

        }
    )
    }
}