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
    }
    create() {
        score = 0
        isGameOver = false
        this.physics.resume()
        console.log("Player Loaded")
        background = this.add.image(200, 350,
    'background')
        background.setDisplaySize(400, 700)

        player = this.physics.add.image(200, 600,
    'player')
        player.setScale(0.08)
        player.setCollideWorldBounds(true)
        obstacles = this.physics.add.group()

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


        this.physics.add.overlap(
            player,
            obstacles,
            hitObstacle,
            null,
            this
        )

        

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
    }
    update() {
        player.x = this.input.x

        player.y = this.input.y

        obstacles.getChildren().forEach((obstacle) => {
            if (obstacle.y > 800) {
                obstacle.destroy()
            }
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
    scene.time.delayedCall(2200, () => {
        warning.destroy()

        const laser = lasers.create(
            x,
            y,
            'laser'
        )
        laser.setScale(0.45, 0.2)

        laser.setAngle(angle)

        laser.body.setAllowGravity(false)

        laser.setImmovable(true)

        laser.setOrigin(
            Phaser.Math.FloatBetween(0.2, 0.8),
            0.5
        )
        scene.tweens.add({
            targets: laser,
            angle: angle + 180,
            duration: 2000
        })
        scene.time.delayedCall(2000, () => {
            laser.destroy()
            })
        })
    }
}