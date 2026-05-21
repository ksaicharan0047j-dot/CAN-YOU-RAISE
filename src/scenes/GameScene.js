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
let shieldActive = false
let shieldHealth = 1
let shieldVisual
let shieldPulse
let shieldCoolDown = false
let multiplierActive = false
let multiplierTimer = 0
let multiplierText
let repellentActive = false
let repellentTimer = 0
let repellentRadius = 160
let repellentParticles = []
let repellentPulse = 0
let repellentOrb
let activePowerups = 0
let maxPowerups = 2
let powerupSpawnCooldown = 0
let lastPowerupScore = 0
let pauseButton
let pauseOverlay
let pauseText
let resumeButton
let restartButton
let isPaused = false
let totalCoins = 0
let coinText
let coinIcon
let coinPopupText
let activeCoins = 0
let maxCoins = 1
let equippedShip = 'default'
let scoreInterval = 2000
let titanRepellentPassive = false
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
            'defaultShip',
            'assets/images/player/Boss_Full.png'
        )
        this.load.image(
            'scoreship',
            'assets/images/player/scoreship.png'
        )
        this.load.image(
            'titanShip',
            'assets/images/player/titanShip.png'
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
        for(let i = 1; i <= 10;i++){
            this.load.image(
                'multiplier_' + i,
                '/assets/images/powerups/Multiplier_' + i + '.png'
            )
        }
        for(let i = 1; i <= 11;i++){
            this.load.image(
                'Coin_' + i,
                '/assets/images/coins/Coin_' + i + '.png'
            )
        }
    }
    create() {
        equippedShip = localStorage.getItem('equippedShip') || 'default'
        scoreInterval = 2000
        titanRepellentPassive = false
        if(equippedShip === 'score'){
            scoreInterval = 1500
        }else if(equippedShip === 'titan'){
            scoreInterval = 1500
            titanRepellentPassive = true
            repellentActive = true
        }
        const savedCoins = localStorage.getItem('totalCoins')
        if(savedCoins){
            totalCoins = parseInt(savedCoins)
        }else{
            totalCoins = 0
        }
        score = 0
        isGameOver = false
        energy = 0
        shieldActive = false
        this.physics.resume()
        console.log("Player Loaded")
        background = this.add.image(200, 350,
    'background')
        background.setDisplaySize(400, 700)

        let playerTexture = 'defaultShip'
        if(equippedShip === 'score'){
            playerTexture = 'scoreship'
        }else if(equippedShip === 'titan'){
            playerTexture = 'titanShip'
        }

        player = this.physics.add.image(200, 600,
        playerTexture)
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
        const orbGraphics = this.add.graphics()
        orbGraphics.fillStyle(
            0xffee00,
            1
        )
        orbGraphics.fillCircle(
            16,
            16,
            16
        )
        orbGraphics.generateTexture(
            'repellent_orb',
            32,
            32
        )
        orbGraphics.destroy()
        

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
        pauseButton = this.add.text(
            355,
            25,
            'II',
            {
                fontSize: '34px',
                fill: '#ffffff',
                fontStyle: 'bold',
                backgroundColor: '#00000088',
                padding: {
                    left: 10,
                    right: 10,
                    top: 2,
                    bottom: 2
                }
            }
        )
        .setOrigin(0.5)
        .setInteractive()

        pauseOverlay = this.add.rectangle(
            200,
            350,
            400,
            700,
            0x000000,
            0.72
        )
        pauseOverlay.setVisible(false)
        pauseOverlay.setDepth(100)
        pauseText = this.add.text(
            200,
            220,
            'PAUSED',
            {
                fontSize: '52px',
                fill: '#ffffff',
                fontStyle: 'bold'
            }
        )
        .setOrigin(0.5)
        .setDepth(101)
        .setVisible(false)

        resumeButton = this.add.text(
            200,
            340,
            'RESUME',
            {
                fontSize: '34px',
                fill: '#00ffcc',
                backgroundColor: '#111111',
                padding: {
                    left: 18,
                    right: 18,
                    top: 10,
                    bottom: 10 
                }
            }
        )
        .setOrigin(0.5)
        .setInteractive()
        .setDepth(101)
        .setVisible(false)

        restartButton = this.add.text(
            200,
            430,
            'RESTART',
            {
                fontSize: '32px',
                fill: '#ff6666',
                backgroundColor: '#111111',
                padding: {
                    left: 18,
                    right: 18,
                    top: 10,
                    bottom: 10
                }
            }
        )
        .setOrigin(0.5)
        .setInteractive()
        .setDepth(101)
        .setVisible(false)

        startObstacleSpawner.call(this)
        this.time.addEvent({
            delay: scoreInterval,
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
        shieldVisual = this.add.graphics()
        shieldVisual.setDepth(10)
        shieldVisual.setVisible(false)
        shieldPulse = 0
        if(!this.anims.exists('multiplier_spin')){
        this.anims.create({
            key: 'multiplier_spin',
            frames: [
                {key: 'multiplier_1'},
                {key: 'multiplier_2'},
                {key: 'multiplier_3'},
                {key: 'multiplier_4'},
                {key: 'multiplier_5'},
                {key: 'multiplier_6'},
                {key: 'multiplier_7'},
                {key: 'multiplier_8'},
                {key: 'multiplier_9'},
                {key: 'multiplier_10'}
            ],
            frameRate: 14,
            repeat: -1
        })
    }
    if(!this.anims.exists('coin_spin')){
        this.anims.create({
            key: 'coin_spin',
            frames: [
                {key: 'Coin_1'},
                {key: 'Coin_2'},
                {key: 'Coin_3'},
                {key: 'Coin_4'},
                {key: 'Coin_5'},
                {key: 'Coin_6'},
                {key: 'Coin_7'},
                {key: 'Coin_8'},
                {key: 'Coin_9'},
                {key: 'Coin_10'},
                {key: 'Coin_11'}
            ],
            frameRate: 18,
            repeat: -1
        })
    }
    for(let i = 0; i < 12; i++){
        const particle = this.add.circle(
            player.x,
            player.y,
            Phaser.Math.Between(
                2,
                4
            ),
            0xffee00,
            1
        )
        particle.setVisible(false)
        particle.setBlendMode(
            Phaser.BlendModes.ADD
        )
        particle.orbitAngle = (360/12) * i
        particle.orbitDistance = Phaser.Math.Between(
            38,
            45
        )
        repellentParticles.push(particle)
    }
    boostCircle = this.add.graphics()
    pauseButton.on(
        'pointerdown',
        () => {
            if(isPaused){
                return
            }
            isPaused = true
            this.physics.pause()
            this.time.paused = true
            this.tweens.pauseAll()
            pauseOverlay.setVisible(true)
            pauseText.setVisible(true)
            resumeButton.setVisible(true)
            restartButton.setVisible(true)
        }
    )
    resumeButton.on(
        'pointerdown',
        () => {
            isPaused = false
            this.physics.resume()
            this.time.paused = false
            this.tweens.resumeAll()
            pauseOverlay.setVisible(false)
            pauseText.setVisible(false)
            resumeButton.setVisible(false)
            restartButton.setVisible(false)
        }
    )
    restartButton.on(
        'pointerdown',
        () => {
            isPaused = false
            this.scene.restart()
        }
    )
    coinIcon = this.add.image(
        40,
        40,
        'Coin_1'
    )
    coinIcon.setScale(0.08)
    coinIcon.setVisible(false)
    coinIcon.setDepth(200)

    coinText = this.add.text(
        70,
        40,
        '',
        {
            fontSize: '28px',
            fill: '#ffdd33',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 5
        }
    )
    .setOrigin(0,0.5)
    .setDepth(200)
    .setVisible(false)

    coinPopupText = this.add.text(
        110,
        15,
        '',
        {
            fontSize: '24px',
            fill: '#ffff66',
            fontStyle: 'bold'
        }
    )
    .setDepth(201)
    .setVisible(false)
    }
update() {
    if(isPaused){
        return
    }

    updateDirectorAI.call(this)
    updatePowerupDirector.call(this)
    if(multiplierActive){
        multiplierTimer -= this.game.loop.delta
        if(multiplierTimer <= 0){
            multiplierActive = false
            multiplierTimer = 0
        }
    }
    
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
    if(repellentActive){
        repellentTimer -= this.game.loop.delta
        if(repellentTimer <= 0){
            repellentActive = false
            repellentTimer = 0
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

    shieldVisual.clear()
    if(shieldActive){
        shieldPulse += 0.08
        const pulseSize = 34 + Math.sin(shieldPulse) * 3

        //ouuter glow
        shieldVisual.lineStyle(
            5,
            0x00ffee,
            0.25
        )
        shieldVisual.strokeCircle(
            player.x,
            player.y,
            pulseSize + 6
        )
        //MAIN RING
        shieldVisual.lineStyle(
            3,
            0x66ffff,
            0.9
        )
        shieldVisual.strokeCircle(
            player.x,
            player.y,
            pulseSize
        )
        //Inner Core
        shieldVisual.fillStyle(
            0x00ffee,
            0.08
        )
        shieldVisual.fillCircle(
            player.x,
            player.y,
            pulseSize - 8
        )
        shieldVisual.setVisible(true)
    }else{
        shieldVisual.setVisible(false)
    }

    if(repellentActive){
        repellentPulse += 0.05
        repellentParticles.forEach(
            (particle,index) => {
                particle.setVisible(true)
                particle.orbitAngle += 2.5
                const angle = Phaser.Math.DegToRad(particle.orbitAngle)
                const wave = Math.sin(repellentPulse + index) * 2
                const finalDistance = particle.orbitDistance + wave
                particle.x = player.x + Math.cos(angle) * finalDistance
                particle.y = player.y + Math.sin(angle) * finalDistance 
                particle.setAlpha(0.7 + Math.sin(repellentPulse + index) * 0.25)
            }
        )
    }else{
        repellentParticles.forEach((particle) => {
            particle.setVisible(false)
        })
    }

    
    obstacles.getChildren().forEach((obstacle) => {

        if(repellentActive || titanRepellentPassive){
            const distance = Phaser.Math.Distance.Between(
                player.x,
                player.y,
                obstacle.x,
                obstacle.y
            )
            if(distance < 70){
                const angle = Phaser.Math.Angle.Between(
                    player.x,
                    player.y,
                    obstacle.x,
                    obstacle.y
                )
                const pushStrength = 3.5
                obstacle.x += Math.cos(angle) * pushStrength
                obstacle.y += Math.sin(angle) * pushStrength
            }
        }

        if(obstacle.y > 800){

            obstacle.destroy()
        }

    })
    this.children.list.forEach((child) => {
        if(child.texture && child.texture.key && child.texture.key.includes('Coin_')){
            if(child.y > 800){
                activeCoins--
                child.destroy()
            }
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
    if(isGameOver || shieldCoolDown){
        return
    }
    if(isImmortal){
        return
    }
    if(shieldActive){
        shieldActive = false
        shieldVisual.clear()
        this.cameras.main.flash(
            120,
            0,
            255,
            255
        )
        this.cameras.main.shake(
            180,
            0.008
        )
        if(obstacle){
            obstacle.destroy()
        }
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
        if(multiplierActive){
            score += 2
        }else{
            score++
        }
    }
    if (score > highScore) {
        highScore = score
        localStorage.setItem('highScore', highScore)
    }
    scoreText.setText('Score: ' + score)
    spawnCoin.call(this)
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
function spawnShieldPowerup(){
    if(Phaser.Math.Between(1, 40) !== 1){
        return
    }
    if(shieldActive){
        return
    }
    const shieldOrb = this.add.circle(
        Phaser.Math.Between(
            60,
            340
        ),
        -50,
        16,
        0x00ffee,
        0.9
    )
    this.physics.add.existing(
        shieldOrb
    )
    shieldOrb.body.setVelocityY(180)
    shieldOrb.body.setAllowGravity(false)
    //Glow effect
    this.tweens.add({
        targets: shieldOrb,
        alpha: 0.4,
        yoyo: true,
        repeat: -1,
        duration: 500
    })
    this.physics.add.overlap(
        player,
        shieldOrb,
        () => {
            shieldActive = true
            shieldHealth = 1
            this.cameras.main.flash(
                180,
                0,
                255,
                255
            )
            activePowerups--
            shieldOrb.destroy()
        },
        null,
        this
    )
}
function spawnMultiplierPowerup(){
    if(Phaser.Math.Between(1, 40) !== 1){
        return
    }
    if(multiplierActive){
        return
    }
    const multiplier = this.physics.add.sprite(
        Phaser.Math.Between(
            60,
            340
        ),
        -50,
        'multiplier_1'
    )
    multiplier.play('multiplier_spin')
    multiplier.setScale(0.08)
    multiplier.setDepth(5)
    multiplier.setVelocity(
        Phaser.Math.Between(
            -20,
            20
        ),
        140
    )
    multiplier.body.setAllowGravity(false)
    this.physics.add.overlap(
        player,
        multiplier,
        () => {
            multiplierActive = true
            multiplierTimer = 10000
            this.cameras.main.flash (
                180,
                255,
                60,
                60
            )
            activePowerups--
            multiplier.destroy()
        },
        null,
        this
    )
}
function spawnRepellentPowerup(){
    if(Phaser.Math.Between(1, 40) !== 1){
        return
    }
    if(repellentActive){
        return
    }
    repellentOrb = this.physics.add.image(
        Phaser.Math.Between(
            60,
            340
        ),
        -50,
        'repellent_orb'
    )
    repellentOrb.setScale(0.045)

repellentOrb.setAlpha(0.9)

repellentOrb.body.setAllowGravity(
    false
)

repellentOrb.setVelocity(

    Phaser.Math.Between(
        -20,
        20
    ),

    150

)
    this.physics.add.existing(repellentOrb)
    repellentOrb.body.setAllowGravity(false)
    repellentOrb.body.setVelocity(Phaser.Math.Between(
        -20,
        20
        ),
        150
    )
    this.tweens.add({
        targets: repellentOrb,
        alpha: 0.45,
        scaleX: 1.25,
        scaleY: 1.25,
        yoyo: true,
        repeat: -1,
        duration: 450
    })
    //Pickup
    this.physics.add.overlap(
        player,
        repellentOrb,
        () => {
            console.log('Repelrnt Picked up')
            repellentActive = true
            repellentTimer = 10000
            this.cameras.main.flash(
                200,
                180,
                120,
                255
            )
            activePowerups--
            repellentOrb.destroy()
        },
        null,
        this
    )
}
function updatePowerupDirector() {
    if(powerupSpawnCooldown > 0){
        powerupSpawnCooldown -= this.game.loop.delta
    }
    if(score < 20){
        return
    }
    if(activePowerups >= maxPowerups){
        return
    }
    if(score - lastPowerupScore < 12){
        return
    }
    if(powerupSpawnCooldown > 0){
        return
    }
    if(Phaser.Math.Between(1, 100) > 18){
        return
    }
    const powerupType = Phaser.Math.RND.pick([
        'shield',
        'multiplier',
        'repellent'
    ])
    if(powerupType === 'shield'){
        spawnShieldPowerup.call(this)
    }else if(powerupType === 'multiplier'){
        spawnMultiplierPowerup.call(this)
    }else{
        spawnRepellentPowerup.call(this)
    }
    activePowerups++
    lastPowerupScore = score
    powerupSpawnCooldown = 5000
}

function spawnCoin(){
    if(activeCoins >= maxCoins){
        return
    }
    let spawnChance = 120
    if(score >= 30){
        spawnChance = 90
    }
    if(score >= 60){
        spawnChance = 65
    }
    if(score >= 80){
        spawnChance = 10
    }
    if(score >= 90){
        spawnChance = 45
    }
    if(Phaser.Math.Between(
        1,
        spawnChance
    ) !== 1){
        return
    }
    activeCoins++
    let coinX = Phaser.Math.Between(
        50,
        350
    )
    if(Math.random() < 0.45){
        coinX = Phaser.Math.RND.pick([
            40,
            360
        ])
    }
    const coin = this.physics.add.sprite(
        coinX,
        -50,
        'Coin_1'
    )
    coin.play('coin_spin')
    coin.setScale(0.09)
    coin.setDepth(6)
    coin.body.setAllowGravity(false)
    coin.setVelocity(Phaser.Math.Between(-15, 15), 165 * worldSpeedMultiplier)
    coin.setBlendMode(Phaser.BlendModes.ADD)
    coin.preFX?.addGlow(
        0xffdd33,
        4,
        0,
        false,
        0.12,
        10
    )
    this.tweens.add({
        targets: coin,
        scaleX: 0.11,
        scaleY: 0.11,
        alpha: 0.82,
        yoyo: true,
        repeat: -1,
        duration: 350
    })
    this.time.addEvent({
        delay: 80,
        loop: true,
        callback: () => {
            if(!coin.active){
                return
            }
            const particle = this.add.circle(
                coin.x + Phaser.Math.Between(
                    -8,
                    8
                ),
                coin.y + Phaser.Math.Between(
                    -8,
                    8
                ),
                Phaser.Math.Between(
                    1,
                    3
                ),
                0xffdd33,
                0.9
            )
            particle.setBlendMode(Phaser.BlendModes.ADD)
            this.tweens.add({
                targets:particle,
                alpha: 0,
                scaleX: 0,
                scaleY: 0,
                y: particle.y-12,
                duration: 500,
                onComplete:()  =>  {
                particle.destroy()
                }          
            })
        }
    })
    this.physics.add.overlap(
        player,
        coin,
        () => {
            totalCoins++
            localStorage.setItem(
                'totalCoins',
                totalCoins
            )
            coinIcon.setVisible(true)
            coinText.setVisible(true)
            coinPopupText.setVisible(true)
            coinIcon.alpha = 1
            coinText.alpha = 1
            coinPopupText.alpha = 1
            coinText.setText(totalCoins - 1)
            coinPopupText.setText('+1')
            coinPopupText.y = 15
            this.tweens.add({
                targets: coinPopupText,
                y: -5,
                alpha: 0,
                duration: 700,
                ease: 'Power2'
            })
            this.time.delayedCall(
                350,
                () => {
                    coinText.setText(totalCoins)
                }
            )
            this.time.delayedCall(
                220,
                () =>{
                    this.tweens.add({
                        targets: [coinIcon, coinText],
                        alpha: 0,
                        duraion: 500,
                        onComplete: () => {
                            coinIcon.setVisible(false)
                            coinText.setVisible(false)
                        }
                    })
                }
            )
            this.cameras.main.flash(
                120,
                255,
                220,
                120
            )
            activeCoins--
            coin.destroy()
        },
        null,
        this
    )
}