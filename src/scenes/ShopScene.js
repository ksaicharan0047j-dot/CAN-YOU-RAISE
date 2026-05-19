import Phaser from 'phaser'
export default class ShopScene extends
Phaser.Scene{
    constructor(){
        super('ShopScene')
    }
    preload(){
        this.load.image(
            'defaultShip',
            '/assets/images/player/Boss_Full.png'
        )
        this.load.image(
            'scoreShip',
            '/assets/images/player/scoreship.png'
        )
        this.load.image(
            'titanShip',
            '/assets/images/player/titanShip.png'
        )
    }
    create(){
        this.cameras.main.setBackgroundColor('#060606')
        this.add.text(
            200,
            45,
            'SHIP SHOP',
            {
                fontSize: '40px',
                fill: '#ffffff',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5)
        let totalCoins = localStorage.getItem('totalCoins') || 0
        this.add.text(
            200,
            90,
            'COINS: ' + totalCoins,
            {
                fontSize: '26px',
                fill: '#ffdd33',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5)
        //hover text
        const hoverText = this.add.text(
            200,
            655,
            '',
            {
                fontSize: '18px',
                fill: '#ff4444',
                align: 'center'
            }
        ).setOrigin(0.5)
        //default ship
        this.createShipCard(
            200,
            180,
            'DEFAULT',
            'FREE',
            'defaultShip',
            '#666666',
            'NO ATTRIBUTES'
        )
        //score ship
        this.createShipCard(
            200,
            315,
            'SCORE SHIP',
            '0 COINS',
            'scoreShip',
            '#00bbff',
            '+2 FOR EVERY 1.5 SECONDS'
        )
        //titan ship
        this.createShipCard(
            200,
            450,
            'TITAN SHIP',
            '0 COINS',
            'titanShip',
            '#ffaaoo',
            'PERMANENT ASTEROID REPELLANT + FASTER SCORING'
        )
        //secret ship
        const secretBox = this.add.rectangle(
            200,
            585,
            320,
            105,
            0x111111
        )
        secretBox.setStrokeStyle(
            3,
            0x444444
        )
        const shadowShip = this.add.text(
            200,
            575,
            '???',
            {
                fontSize: '42px',
                fill: '#222222',
                fonstStyle: 'bold'
            }
        ).setOrigin(0.5)
        this.tweens.add({
            targets: shadowShip,
            alpha: 0.2,
            yoyo: true,
            repeat: -1,
            duration: 700
        })
        this.add.text(
            200,
            610,
            'LOCKED',
            {
                fontSize: '20px',
                fill: '#666666'
            },
        ).setOrigin(0.5)
        secretBox.setInteractive()
        secretBox.on(
            'pointerover',
            () => {
                hoverText.setText(
                    'SCORE 100+ WITH DEFAULT SHIP'
                )   
            }
        )
        secretBox.on(
            'pointerout',
            () => {
                hoverText.setText('')
            }
        )
        const backButton = this.add.text(
            60,
            40,
            '⬅',
            {
                fontSize: '42px',
                fill: '#ffffff',
                fontStyle: 'bold'
            }
        )
        .setOrigin(0.5)
        .setInteractive()
        backButton.on(
            'pointerdown',
            () => {
                this.scene.start('MenuScene')
            }
        )
    }
    createShipCard(
        x,
        y,
        title,
        cost,
        texture,
        color,
        attribute
    ){
        const box = this.add.rectangle(
            x,
            y,
            320,
            105,
            0x101010
        )
        box.setStrokeStyle(
            3,
            Phaser.Display.Color.HexStringToColor(
                color
            ).color
        )
        box.setInteractive()
        const ship = this.add.image(
            x - 110,
            y,
            texture
        )
        ship.setScale(0.08)
        ship.setAngle(180)
        this.add.text(
            x - 40,
            y - 22,
            title,
            {
                fontSize: '24px',
                fill: '#ffffff',
                fontStyle: 'bold'
            }
        )
        this.add.text(
            x - 40,
            y + 12,
            cost,
            {
                fontSize: '20px',
                fill: '#ffdd33'
            }
        )
        
        const infoText = this.add.text(
            x,
            y + 70,
            attribute,
            {
                fontSize: '13px',
                fill: '#aaaaaa',
                align: 'center',
                wordWrap: {
                    width: 220
                }
            }
        )
        .setOrigin(0.5)
        .setAlpha(0)
        box.on('pointerover',
            () => {
                this.tweens.add({
                    targets: infoText,
                    alpha: 1,
                    duration: 150
                })
                box.setScale(1.02)
            }
        )
        box.on('pointerout',
            () => {
                this.tweens.add({
                    targets: infoText,
                    alpha: 0,
                    duration: 150
                })
                box.setScale(1)
            }
        )
    }
}