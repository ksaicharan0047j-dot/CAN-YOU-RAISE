import Phaser from 'phaser'

let allActionsButtons = []

export default class ShopScene extends Phaser.Scene{

    constructor(){
        super('ShopScene')
    }

    preload(){

        this.load.image(
            'defaultShip',
            'assets/images/player/Boss_Full.png'
        )

        this.load.image(
            'scoreShip',
            'assets/images/player/scoreship.png'
        )

        this.load.image(
            'titanShip',
            'assets/images/player/titanShip.png'
        )

    }

    create(){

        allActionsButtons = []

        this.cameras.main.setBackgroundColor('#060606')

        let shadowUnlocked =
            localStorage.getItem(
                'shadowUnlocked'
            ) === 'true'

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

        let totalCoins =
            localStorage.getItem(
                'totalCoins'
            ) || 0

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

        //DEFAULT SHIP
        this.createShipCard(
            200,
            180,
            'DEFAULT',
            'FREE',
            'defaultShip',
            '#666666',
            'NO ATTRIBUTES',
            'default',
            0
        )

        //SCORE SHIP
        this.createShipCard(
            200,
            315,
            'SCORE SHIP',
            '5 COINS',
            'scoreShip',
            '#00bbff',
            '+2 SCORE EVERY 1.5 SECONDS',
            'score',
            5
        )

        //TITAN SHIP
        this.createShipCard(
            200,
            450,
            'TITAN SHIP',
            '20 COINS',
            'titanShip',
            '#ffaa00',
            'WEAK ASTEROID REPELLENT + FAST SCORING',
            'titan',
            20
        )

        //LOCKED SHADOW SHIP
        if(!shadowUnlocked){

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
                    fontStyle: 'bold'
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
                }
            ).setOrigin(0.5)

            secretBox.setInteractive()

            secretBox.on(
                'pointerover',
                () => {

                    hoverText.setText(
                        'SCORE 10+ WITH DEFAULT SHIP'
                    )

                }
            )

            secretBox.on(
                'pointerout',
                () => {

                    hoverText.setText('')

                }
            )

        }

        //UNLOCKED SHADOW SHIP
        if(shadowUnlocked){

            this.createShipCard(
                200,
                585,
                'SHADOW SHIP',
                'FREE',
                'defaultShip',
                '#444444',
                'DOUBLE SHIELD + LONGER POWERS + HIGHER COIN LUCK',
                'shadow',
                0
            )

        }

        //BACK BUTTON
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

                this.scene.start(
                    'MenuScene'
                )

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
        attribute,
        shipId,
        price
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

        box.on(
            'pointerover',
            () => {

                this.tweens.add({
                    targets: infoText,
                    alpha: 1,
                    duration: 150
                })

                box.setScale(1.02)

            }
        )

        box.on(
            'pointerout',
            () => {

                this.tweens.add({
                    targets: infoText,
                    alpha: 0,
                    duration: 150
                })

                box.setScale(1)

            }
        )

        const actionButton = this.add.text(
            x + 90,
            y + 4,
            '',
            {
                fontSize: '14px',
                fill: '#ffffff',
                backgroundColor: '#222222',
                padding: {
                    left: 8,
                    right: 8,
                    top: 4,
                    bottom: 4
                }
            }
        )
        .setOrigin(0.5)
        .setInteractive()

        allActionsButtons.push({
            button: actionButton,
            shipId: shipId
        })

        const refreshAllButtons = () => {

            const currentEquipped =
                localStorage.getItem(
                    'equippedShip'
                )

            const currentOwned =
                JSON.parse(
                    localStorage.getItem(
                        'ownedShips'
                    )
                ) || ['default']

            allActionsButtons.forEach(
                (item) => {

                    if(
                        currentEquipped === item.shipId
                    ){

                        item.button.setText(
                            'EQUIPPED'
                        )

                    }
                    else if(
                        currentOwned.includes(
                            item.shipId
                        )
                    ){

                        item.button.setText(
                            'EQUIP'
                        )

                    }
                    else{

                        item.button.setText(
                            'BUY'
                        )

                    }

                }
            )

        }

        refreshAllButtons()

        actionButton.on(
            'pointerdown',
            () => {

                let ownedShips =
                    JSON.parse(
                        localStorage.getItem(
                            'ownedShips'
                        )
                    ) || ['default']

                let totalCoins =
                    parseInt(
                        localStorage.getItem(
                            'totalCoins'
                        )
                    ) || 0

                if(
                    !ownedShips.includes(shipId)
                ){

                    if(totalCoins >= price){

                        totalCoins -= price

                        ownedShips.push(shipId)

                        localStorage.setItem(
                            'totalCoins',
                            totalCoins
                        )

                        localStorage.setItem(
                            'ownedShips',
                            JSON.stringify(
                                ownedShips
                            )
                        )

                    }
                    else{

                        return

                    }

                }

                localStorage.setItem(
                    'equippedShip',
                    shipId
                )

                refreshAllButtons()

            }
        )

    }

}