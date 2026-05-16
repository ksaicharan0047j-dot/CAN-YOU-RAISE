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
let isImmortal = false
let boostTimer = 0
let boostDuration = 10000
let boostCircle
let worldSpeedMultiplier = 1
let rainSafeZones = []
let rainPatternIndex = 0
let asteroidRainIntensity = 1
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
        boostCircle = this.add.graphics()
    }
update() {

    
    if(isBoosting && !isImmortal){

        energy += 0.22

        if(energy > maxEnergy){
            energy = maxEnergy
        }

        moveSpeed += acceleration

        exhaust.setVisible(true)
        exhaust.setAlpha(1)

        if(moveSpeed > maxSpeed){
            moveSpeed = maxSpeed
        }

    }else if(!isImmortal){

        energy -= 0.03

        if(energy < 0){
            energy = 0
        }

        moveSpeed -= decelaration

        exhaust.setAlpha(0.35)

        if(moveSpeed < 0){
            moveSpeed = 0
        }

    }

    
    if(energy >= maxEnergy && !isImmortal){

        this.tweens.add({

            targets: this,

            duration: 400,

            ease: 'Sine.easeOut',

            onUpdate: () => {

                worldSpeedMultiplier = Phaser.Math.Linear(
                    worldSpeedMultiplier,
                    2.2,
                    0.08
                )

            }

        })

        this.cameras.main.shake(300, 0.01)

        isImmortal = true

        boostTimer = boostDuration

        energy = 0
    }

    
    const targetHeight = energy * 2.05

    energyBar.displayHeight = Phaser.Math.Linear(
        energyBar.displayHeight,
        targetHeight,
        0.15
    )

    energyBar.y = 540

    if(energy < 20){

        energyBar.fillColor = 0xff4444

    }else{

        energyBar.fillColor = 0x00ffee
    }

    
    boostCircle.clear()

    if(isImmortal){

        const percentage = boostTimer / boostDuration

        boostCircle.lineStyle(10, 0x00ffff, 1)

        boostCircle.beginPath()

        boostCircle.arc(
            340,
            80,
            35,
            Phaser.Math.DegToRad(-90),
            Phaser.Math.DegToRad(
                (-90) + (360 * percentage)
            ),
            false
        )

        boostCircle.strokePath()
    }

    if(isImmortal){
        boostTimer -= this.game.loop.delta
        if(isBoosting){
            moveSpeed += acceleration
            if(moveSpeed > maxSpeed){
                moveSpeed = maxSpeed
            }
        }else{
            moveSpeed -= decelaration
            if(moveSpeed < 0){
                moveSpeed = 0
            }
        }
        player.setVelocity(150 - moveSpeed)
        if(boostTimer <= 0){
            moveSpeed = 300
            isImmortal = false
            boostTimer = 0
            energy = 0
            this.tweens.add({
                targets: this,
                duration: 500,
                ease: 'Sine.easeOut',
                onUpdate: () => {
                    worldSpeedMultiplier = Phaser.Math.Linear(
                        worldSpeedMultiplier,
                        1,
                        0.08
                    )
                }
            })
        }
    }else{
        player.setVelocity(150 - moveSpeed)
    }

    
    if(cursors.left.isDown || this.keys.A.isDown){

        player.setVelocityX(-300)

    }else if(cursors.right.isDown || this.keys.D.isDown){

        player.setVelocityX(300)

    }else{

        player.setVelocityX(0)
    }

    
    if(player.body.velocity.x < -10){

        player.setAngle(-15)

    }else if(player.body.velocity.x > 10){

        player.setAngle(15)

    }else{

        player.setAngle(0)
    }

    
    if(isImmortal){

        player.setTint(0x00ffee)

    }else{

        player.clearTint()
    }

    
    exhaust.x = player.x
    exhaust.y = player.y + 45
    exhaust.setAngle(player.angle)

    
    obstacles.getChildren().forEach((obstacle) => {

        if(obstacle.y > 800){

            obstacle.destroy()
        }

    })

    
    if(player.y > 600){

        bottomTimer += this.game.loop.delta / 1000

        warningText.setText(
            'MOVE UP! ' +
            (3 - bottomTimer).toFixed(1)
        )

        if(bottomTimer >= 3){

            hitObstacle.call(this, player, null)
        }

    }else{

        bottomTimer = 0
        warningText.setText('')
    }

    
    laserHitboxes.getChildren().forEach((hitbox) => {

        const laser = hitbox.laser

        if(!laser || !laser.active){

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

    obstacle.setVelocityY(
        obstacleSpeed * worldSpeedMultiplier
    )

    obstacle.setScale(0.1)
    obstacle.body.setCircle(obstacle.width * 0.25)
    obstacle.setAngularVelocity(20)
    obstacle.setCollideWorldBounds(false)
    obstacle.checkWorldBounds = true
    obstacle.outOfBoundsKill = true
}
function hitObstacle(player, obstacle) {
    if (isGameOver || isImmortal) {
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
    if(isImmortal){
        score += 3
    }else{
        score++
    }
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
            laser.displayWidth * 0.38,
            10,
            0xff0000
        )
        this.physics.add.existing(laserHitbox)
        laserHitbox.body.setAllowGravity(false)
        laserHitbox.body.setImmovable(true)
        laserHitbox.visible = false
        laserHitbox.laser = laser
        laserHitboxes.add(laserHitbox)
        
        laser.setScale(0.45, 0.3)

        scene.tweens.add({
            targets: laser,
            angle: angle + 360,
            duration: 2000/ worldSpeedMultiplier,
            repeat: -1
        })
        scene.time.delayedCall(5000, () => {
            laserHitbox.destroy()
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
            Phaser.Math.Between(-250, 250)
            * worldSpeedMultiplier,
            Phaser.Math.Between(250, 450)
            * worldSpeedMultiplier
        )
        shuriken.setAngularVelocity(
            Phaser.Math.Between(-400, 400)
        )
    }
}
function asteroidRain() {

    const laneCount = 6

    const laneWidth = 66

    asteroidRainIntensity += 0.02

    if (asteroidRainIntensity > 2) {

        asteroidRainIntensity = 2

    }

    let totalWaves = Math.floor(
        8 * asteroidRainIntensity
    )

    let safeLane = Phaser.Math.Between(
        1,
        laneCount - 3
    )
    let secondSafeLane = safeLane + 1

    let movementCooldown = 0

    for (let wave = 0; wave < totalWaves; wave++) {

        this.time.delayedCall(

            wave * 260,

            () => {

                movementCooldown++

                if (
                    movementCooldown >= 2
                ) {

                    movementCooldown = 0

                    const direction =
                        Phaser.Math.RND.pick(
                            [-1, 0, 1]
                        )

                    safeLane += direction

                }

                if (safeLane < 0) {

                    safeLane = 0

                }

                if (
                    safeLane > laneCount - 1
                ) {

                    safeLane = laneCount - 1

                }

                for (
                    let lane = 0;
                    lane < laneCount;
                    lane++
                ) {

                    if (
                        lane === safeLane ||
                        lane === secondSafeLane
                    ) {

                        continue

                    }

                    if (
                        Math.random() < 0.72
                    ) {

                        const x =
                            (lane * laneWidth)
                            + (laneWidth / 2)
                            + Phaser.Math.Between(
                                -6,
                                6
                            )

                        const asteroid =
                            obstacles.create(
                                x,
                                -50,
                                'asteroid'
                            )

                        asteroid.setVelocityY(

                            Phaser.Math.Between(
                                360,
                                500
                            )
                            * worldSpeedMultiplier

                        )

                        asteroid.setScale(

                            Phaser.Math.FloatBetween(
                                0.08,
                                0.14
                            )

                        )

                        asteroid.setAngularVelocity(

                            Phaser.Math.Between(
                                -220,
                                220
                            )

                        )

                        asteroid.body.setCircle(
                            asteroid.width * 0.22
                        )

                        if (
                            score > 100
                        ) {

                            asteroid.setVelocityX(

                                Phaser.Math.Between(
                                    -25,
                                    25
                                )

                            )

                        }

                    }

                }

            }

        )

    }

}
