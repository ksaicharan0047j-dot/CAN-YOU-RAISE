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
let spawnDelay = 750
let isGameOver = false
let shurikens
let cursors
let speed = 0
let maxSpeed = 450
let bottomTimer = 0
let warningText
let laserHitboxes
let acceleration = 16
let decelaration = 9
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
let rainFlowDirection = 1
let rainWaveCounter = 0
let lastSafeLane = 2
let shurikenPatternIndex = 0
let shurikenSpawnRate = 4000
let shurikenSpeedMultiplier = 1
let currentThreatlevel = 0
let activeAttackType = 'none'
let attackChainCooldown = 0
let laserAttackActive = false
let rainAttackActive = false
let shurikenAttackActive = false
let directorMood = 'normal'
let attackIntensity = 1
let playerStressLevel = 0
let safePhaseActive = false
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
        player.body.setSize(
            82 / player.scaleX,
            48 / player.scaleY)
        player.body.updateFromGameObject()
        console.log(
            player.displayWidth,
            player.displayHeight
        )
        player.body.setOffset(
            2,
            0
        )
        player.setCollideWorldBounds(true)
        console.log(
            'BODY',
            player.body.width,
            player.body.height
        )
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

            callback: () => {
                if(score >= 30){
                    startLaserAttack.call(this)
                }
            },
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
            delay: 12000,

            callback: () => {
                if(score >= 20){
                    asteroidRain.call(this)
                }
            },

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

    updateDirectorAI.call(this)
    
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
    if(isImmortal && obstacle){
        return
    }
    isGameOver = true
    this.physics.pause()

    this.cameras.main.shake(
        350,
        0.02
    )
    player.setAngularVelocity(320)

    player.setVelocity(
        Phaser.Math.Between(
            -120,
            120
        ),
        420
    )
    this.tweens.add({
        targets: player,
        alpha: 0,
        angle: player.angle + 180,
        duraion: 1200,
        ease: 'Cubic.easeIn',
    })
    this.time.delayedCall(
        900,
        () => {
            this.cameras.main.fade(
                600,
                0,
                0,
                0
            )
        }
    )
    this.time.delayedCall(
        1500,
        () => {
            this.scene.start(
                'GameOverScene'
            )
        }
    )
    
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
    laserAttackActive = true
    if(rainAttackActive){
        return
    }
    activeAttackType = 'laser'
let laserCount = 1
if(directorMood === 'overload'){
    laserCount = 0
}else if(safePhaseActive){
    laserCount = 1
}else{
 if (score >= 45) {
        laserCount = 2
 }
 if (score >= 70){
        laserCount = 3
 }
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
            laserAttackActive = false
            })
        })
    }
}
function spawnShurikenCrossfire() {
    shurikenAttackActive = true
    activeAttackType = 'shuriken'
    shurikenPatternIndex++
    const pattern = shurikenPatternIndex % 4
    let totalShurikens = 4
    if(directorMood === 'overload'){
        totalShurikens -= 2
    }
    if(safePhaseActive){
        totalShurikens = 2
    }
    if(score > 50){
        totalShurikens = 5
    }
    if(score > 100){
        totalShurikens = 6
    }
    for(let i = 0;i < totalShurikens;i++){
        let spawnX = 200
        let spawnY = -50

        let velocityX = 0
        let velocityY = 0

        //Left Sweep
        if(pattern === 0){
            spawnX = -50
            spawnY = Phaser.Math.Between(
                120,
                500
            )
            velocityX = Phaser.Math.Between(
                320,
                460
            )
            velocityY = Phaser.Math.Between(
                -80,
                80
            )
        }
        else if(pattern === 1){
            spawnX = 450
            spawnY = Phaser.Math.Between(
                120,
                500
            )
            velocityX = Phaser.Math.Between(
                -460,
                -320
            )
            velocityY = Phaser.Math.Between(
                -80,
                80
            )
        }
        //Top Cross Path
        else if(pattern === 2){
            spawnX = Phaser.Math.Between(
                40,
                360
            )
            spawnY = -50
            velocityX = Phaser.Math.Between(
                -180,
                180
            )
            velocityY = Phaser.Math.Between(
                320,
                520
            )
        }
        //Diagonal
        else{
            spawnX = Phaser.Math.RND.pick(
                [-50,450]
            )
            spawnY = Phaser.Math.Between(
                100,
                350
            )
            velocityX = spawnX < 0 ? Phaser.Math.Between(
                250,
                420
            )
            : Phaser.Math.Between(
                -420,
                -250
            )
            velocityY = Phaser.Math.Between(
                180,
                320
            )
        } 
        this.time.delayedCall(
            i * 180,
            () => {
                const shuriken = shurikens.create(
                    spawnX,
                    spawnY,
                    'shuriken'
                )
                shuriken.setScale(Phaser.Math.FloatBetween(
                    0.10,
                    0.16
                ))
                shuriken.setVelocity(
                    velocityX * worldSpeedMultiplier,
                    velocityY * worldSpeedMultiplier
                )
                shuriken.setAngularVelocity(Phaser.Math.Between(
                    -500,
                    500
                ))
                shuriken.setAlpha(Phaser.Math.FloatBetween(
                    0.75,
                    1
                ))
                //tint
                shuriken.setTint(
                    0xffdddd
                )
                shuriken.setCollideWorldBounds(false)
                shuriken.checkWorldBounds = true
                shuriken.outOfBoundsKill = true
            }
        )
    }
    this.time.delayedCall(
        3500,
        () => {
            shurikenAttackActive = false
        }
    )
}
function asteroidRain() {
    rainAttackActive = true
    activeAttackType = 'rain'

    const laneCount = 5

    const laneWidth = 83

    asteroidRainIntensity += 0.02

    if (asteroidRainIntensity > 2) {

        asteroidRainIntensity = 2

    }

    let totalWaves = Math.floor(
        8 * asteroidRainIntensity
    )
    if(directorMood === 'overload'){
        totalWaves -= 3
    }
    if(safePhaseActive){
        totalWaves = 3
    }

    let safeLane = Phaser.Math.Between(
        1,
        laneCount - 3
    )
    let secondSafeLane = safeLane + 2

    for (let wave = 0; wave < totalWaves; wave++) {

        this.time.delayedCall(

            wave * 260,

            () => {

                rainWaveCounter++
                if(rainWaveCounter > 3){
                    rainWaveCounter = 0
                    if(Math.random() < 0.4){
                        rainFlowDirection *= -1
                    }
                }
                safeLane += rainFlowDirection

                if(Math.random() < 0.25){
                    safeLane += Phaser.Math.Between(
                        -1,
                        1
                    )
                }

                if(
                    Math.abs(
                        safeLane - lastSafeLane
                    ) > 2
                ){
                    safeLane = lastSafeLane
                }
                lastSafeLane = safeLane

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
                    let rainDensity = 0.72
                    if(directorMood === 'overload'){
                        rainDensity = 0.45
                    }
                    if(safePhaseActive){
                        rainDensity = 0.35
                    }
                    if(Math.random() < rainDensity)
                    {

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
                        asteroid.setAlpha(
                            Phaser.Math.FloatBetween(
                                0.7,
                                1
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
                        asteroid.body.updateFromGameObject()

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
    this.time.delayedCall(
        totalWaves * 260,
        () => {
            rainAttackActive = false
        }
    )
}
function updateDirectorAI(){
    currentThreatlevel = 0
    if(laserAttackActive){
        currentThreatlevel += 4
        activeAttackType = 'laser'
    }
    if(rainAttackActive){
        currentThreatlevel += 3
        activeAttackType = 'rain'
    }
    if(shurikenAttackActive){
        currentThreatlevel += 2
        activeAttackType = 'shuriken'
    }
    if(isImmortal){
        currentThreatlevel -= 5
        directorMood = 'recovery'
    }
    playerStressLevel = 0
    if(player.y > 500){
        playerStressLevel += 2
    }
    if(moveSpeed < 120){
        playerStressLevel += 1
    }
    if(currentThreatlevel >= 7){
        playerStressLevel += 3
    }
    if(currentThreatlevel <= 2 && !isImmortal){
        safePhaseActive = true
    }else{
        safePhaseActive = false
    }
    attackIntensity = 1 + (score / 100)
    attackIntensity = Phaser.Math.Clamp(
        attackIntensity,
        1,
        3
    )
    if(playerStressLevel >= 5){
        directorMood = 'overload'
    }else if(safePhaseActive){
        directorMood = 'pressure_build'
    }else{
        directorMood = 'normal'
    }
    if(attackChainCooldown > 0){
        attackChainCooldown -= this.game.loop.delta
    }
    if(directorMood === 'overload'){
        laserAttackActive = false
    }
    currentThreatlevel = Phaser.Math.Clamp(
        currentThreatlevel,
        0,
        10
    )
}