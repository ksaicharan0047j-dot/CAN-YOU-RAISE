import Phaser from 'phaser'
let background
let player
let obstacles
let lasers
let score = 0
let highScore = 0
let scoreText
let highScoreText
let obstacleSpeed = 250
let spawnDelay = 1000
let isGameOver = false
let shurikens
let cursors
let speed = 0
let maxSpeed = 450
let bottomTimer = 0
let warningText
let laserHitboxes
let acceleration = 16
let decelaration = 7
let moveSpeed = 0
let exhaust
let energy = 0
let maxEnergy = 100
let isBoosting = false
let energyBar
let energyBg
export default class GameScene extends Phaser.Scene{
    constructor(){
        super('GameScene')
    }
    preload() {
          this.load.image(
        'background',
        'assets/images/backgrounds/Space_BG_02.png'
        )
        this.load.image(
            'player',
            'assets/images/player/Boss_Full.png'
        )
        this.load.image(
            'asteroid',
            'assets/images/obstacles/asteroid.png'
        )
        this.load.image(
            'laser',
            'assets/images/laser/laser1.png'
        )
        this.load.image(
            'warning',
            'assets/images/effects/warning.png'
        )
        this.load.image(
            'shuriken',
            'assets/images/obstacles/shuriken.png'
        )
        this.load.image(
            'exhaust',
            '/assets/images/effects/exhaust_clean.png'
        )
    }
    create() {
        score = 0
        isGameOver = false
        energy = 0
        this.physics.resume()
        console.log("Player Loaded")
        background = this.add.image(200, 350,
    'background')
        background.setDisplaySize(400, 700)

        player = this.physics.add.image(200, 600,
    'player')
        player.setAngle(180)
        player.setScale(0.08)
        player.setCollideWorldBounds(true)
        exhaust = this.add.image(
            player.x,
            player.y + 45,
            'exhaust'
        )
        exhaust.setScale(0.09)
        exhaust.setAlpha(0.9)
        exhaust.setVisible(false)
        cursors = this.input.keyboard.createCursorKeys()
        this.input.on('pointerdown', () => {
            isBoosting = true
        })
        this.input.on('pointerup', () => {
            isBoosting = false
        })
        this.keys = this.input.keyboard.addKeys('A,D')
        obstacles = this.physics.add.group()
        shurikens = this.physics.add.group()
        lasers = this.physics.add.group()
        laserHitboxes = this.physics.add.group()

        

        highScoreText = this.add.text(200, 20, 'HIGH SCORE: 0',{
            fontSize: '28px',

            fill: '#ff4444',

            fontFamily: 'Arial',

            stroke: '#000000',

            strokeThickness: 5
        }).setOrigin(0.5)
        scoreText = this.add.text(200, 60, 'SCORE: 0', {

            fontSize: '36px',

            fill: '#ffffff',

            fontFamily: 'Arial',

            stroke: '#000000',

            strokeThickness: 6
        }).setOrigin(0.5)
        energyBg = this.add.rectangle(
            30,
            435,
            24,
            210,
            0x111111
        )
        energyBg.setStrokeStyle(3, 0xffffff)
        energyBar = this.add.rectangle(
            30,
            520,
            18,
            1,
            0x00ffee
        )
        energyBar.setOrigin(0.5, 1)

        this.physics.add.overlap(
            player,
            obstacles,
            hitObstacle,
            null,
            this
        )
        warningText = this.add.text(
            200,
            650,
            '',
            {
                fontSize: '24px',
                fill:'#ff0000',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5)
        
        

        startObstacleSpawner.call(this)
        this.time.addEvent({
            delay: 2000,
            callback: increaseScore,
            callbackScope: this,
            loop: true
        })
        lasers = this.physics.add.group()
        this.physics.add.overlap(
            player,
            lasers,
            hitObstacle,
            null,
            this
        )
        this.time.addEvent({
            delay: 7000,

            callback: startLaserAttack,
            callbackScope: this,
            loop: true
        })
        this.time.addEvent({
            delay: 4000,
            callback: spawnShurikenCrossfire,
            callbackScope: this,
            loop: true
        })
        this.physics.add.overlap(
            player,
            shurikens,
            hitObstacle,
            null,
            this
        )
        this.time.addEvent({
            delay: Phaser.Math.Between(10000, 18000),

            callback: asteroidRain.bind(this),

            callbackScope: this,

            loop: true
        })
        this.physics.add.overlap(
            player,
            laserHitboxes,
            hitObstacle,
            null,
            this
        )
    }
    update() {

    if(isBoosting){

        energy += 0.35

        if(energy > maxEnergy){
            energy = maxEnergy
        }

        moveSpeed += acceleration

        exhaust.setVisible(true)
        exhaust.setAlpha(1)

        if(moveSpeed > maxSpeed){
            moveSpeed = maxSpeed
        }

    }else{

        energy -= 0.05

        if(energy < 0){
            energy = 0
        }

        moveSpeed -= decelaration

        exhaust.setAlpha(0.35)

        if(moveSpeed < 0){
            moveSpeed = 0
        }
    }

    const targetHeight = energy * 2.05

    energyBar.displayHeight = Phaser.Math.Linear(
        energyBar.displayHeight,
        targetHeight,
        0.15
    )

    energyBar.y = 540

    if(energy < 20) {
        energyBar.fillColor = 0xff4444
    }else{
        energyBar.fillColor = 0x00ffee
    }

    player.setVelocityY(150 - moveSpeed)

    if(cursors.left.isDown || this.keys.A.isDown){

        player.setVelocityX(-300)

    }else if(cursors.right.isDown || this.keys.D.isDown){

        player.setVelocityX(300)

    }else{

        player.setVelocityX(0)
    }

    if (player.body.velocity.x < -10){

        player.setAngle(-15)

    }else if(player.body.velocity.x > 10){

        player.setAngle(15)

    }else{

        player.setAngle(0)
    }

    exhaust.x = player.x
    exhaust.y = player.y + 45
    exhaust.setAngle(player.angle)

    obstacles.getChildren().forEach((obstacle) => {

        if (obstacle.y > 800) {

            obstacle.destroy()
        }
    })

    if (player.y > 600) {

        bottomTimer += this.game.loop.delta / 1000

        warningText.setText(
            'MOVE UP! ' +
            (3 - bottomTimer).toFixed(1)
        )

        if (bottomTimer >= 3) {

            hitObstacle.call(this, player, null)
        }

    }else{

        bottomTimer = 0
        warningText.setText('')
    }

    laserHitboxes.getChildren().forEach((hitbox) => {

        const laser = hitbox.laser

        if(!laser || !laser.active) {

            hitbox.destroy()
            return
        }

        hitbox.x = laser.x
        hitbox.y = laser.y

        hitbox.rotation = laser.rotation

        hitbox.body.updateFromGameObject()
    })
}
}
function spawnObstacle() {
    
    const x = Phaser.Math.Between(40, 360)

    const obstacle = obstacles.create(x, -50, 'asteroid')

    obstacle.setVelocityY(obstacleSpeed)

    obstacle.setScale(0.1)
    obstacle.body.setCircle(obstacle.width * 0.25)
    obstacle.setAngularVelocity(20)
    obstacle.setCollideWorldBounds(false)
    obstacle.checkWorldBounds = true
    obstacle.outOfBoundsKill = true
}
function hitObstacle(player, obstacle) {
    if (isGameOver) {
        return
    }
    isGameOver = true
    this.physics.pause()

    this.scene.start('GameOverScene')
    
}

function increaseScore() {
    if (isGameOver) {
        return
    }
    score++
    if (score > highScore) {
        highScore = score
        localStorage.setItem('highScore', highScore)
    }
    scoreText.setText('Score: ' + score)
    highScoreText.setText('HIGH SCORE: ' + highScore)
    if (score % 30 == 0) {
        obstacleSpeed += 50
        if (spawnDelay > 400) {
            spawnDelay -= 100
        }
        console.log("Difficulty Increaced")
    }
}

function startObstacleSpawner() {
    this.time.addEvent({
        delay: spawnDelay,
         callback: spawnObstacle,

         callbackScope: this,

         loop: true
    })
}
function startLaserAttack() {
let laserCount = 1
 if (score >= 20) {
        laserCount = 2
 }
 if (score >= 30){
        laserCount = 3
 }
 for(let i = 0; i < laserCount; i++) {

    const scene = this
    const x = Phaser.Math.Between(100, 300)

    const y = Phaser.Math.Between(150, 550)

    const angle = Phaser.Math.Between(0, 360)

    const warning = this.add.image(
        x,
        y,
        'warning'
    )
    warning.setAngle(angle)
    warning.setScale(0.08)
    this.tweens.add({
        targets: warning,

        alpha: 0.2,

        yoyo: true,

        repeat: -1,
        duration: 200
    })
    scene.time.delayedCall(2000, () => {
        warning.destroy()

        const laser = lasers.create(
            x,
            y,
            'laser'
        )
        const laserHitbox = this.add.rectangle(
            x,
            y,
            laser.displayWidth * 0.25,
            12,
            0xff0000
        )
        this.physics.add.existing(laserHitbox)
        laserHitbox.visible = false
        laserHitbox.laser = laser
        laserHitboxes.add(laserHitbox)
        
        laser.setScale(0.45, 0.3)

        laser.body.setSize(
            laser.width * 0.9,
            laser.height * 0.8
        )

        laser.body.updateFromGameObject()

        laser.setAngle(angle)

        laser.body.setAllowGravity(false)

        laser.setImmovable(true)

        scene.tweens.add({
            targets: laser,
            angle: angle + 360,
            duration: 2000,
            repeat: -1
        })
        scene.time.delayedCall(5000, () => {
            laser.destroy()
            })
        })
    }
}
function spawnShurikenCrossfire() {
    for(let i = 0; i < 4; i++) {
        const shuriken = shurikens.create(
            Phaser.Math.Between(0, 400),
            -50,
            'shuriken'
        )
        shuriken.setScale(0.12)
        shuriken.setVelocity(
            Phaser.Math.Between(-250, 250),
            Phaser.Math.Between(250, 450)
        )
        shuriken.setAngularVelocity(
            Phaser.Math.Between(-400, 400)
        )
    }
}
function asteroidRain() {
    const safeZone = Phaser.Math.Between(80, 320)
    for( let i = 0; i < 15; i++) {
        this.time.delayedCall(i * 120, () => {
            let x = Phaser.Math.Between(0, 400)
            while (Math.abs(x - safeZone) < 60){ 
                x = Phaser.Math.Between(0, 400)
            }
            const asteroid = obstacles.create(x, -50, 'asteroid')
            asteroid.setVelocityY(Phaser.Math.Between(350, 500))
            asteroid.setScale(Phaser.Math.FloatBetween(0.08,0.15))
            asteroid.setAngularVelocity(Phaser.Math.Between(-200,200))
        })
    }
}