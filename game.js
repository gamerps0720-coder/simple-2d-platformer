const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 800 } }
    },
    scene: { preload: preload, create: create, update: update }
};

const game = new Phaser.Game(config);

let score = 0;
let timeLeft = 120; // Extended time as requested!
let timerText;
let scoreText;
let isPaused = false;
let pauseText;

function preload() {}

function create() {
    this.cameras.main.setBackgroundColor('#87CEEB');
    const worldWidth = 5000;
    this.physics.world.setBounds(0, 0, worldWidth, 600);
    this.cameras.main.setBounds(0, 0, worldWidth, 600);

    this.platforms = this.physics.add.staticGroup();

    // 1. THE LAVA
    this.lava = this.add.rectangle(worldWidth/2, 590, worldWidth, 20, 0xff0000);
    this.physics.add.existing(this.lava, true);

    // 2. SAFE START
    let startPad = this.add.rectangle(100, 500, 200, 20, 0x00ff00);
    this.physics.add.existing(startPad, true);
    this.platforms.add(startPad);

    // 3. PLATFORMS
    for (let i = 400; i < worldWidth - 200; i += 350) {
        let randomY = Math.floor(Math.random() * (450 - 200 + 1) + 200);
        let plat = this.add.rectangle(i, randomY, 150, 20, 0x00ff00);
        this.physics.add.existing(plat, true);
        this.platforms.add(plat);
    }

    this.trophy = this.add.rectangle(worldWidth - 100, 300, 50, 50, 0xffff00);
    this.physics.add.existing(this.trophy, true);

    this.player = this.add.rectangle(100, 400, 40, 40, 0x333333);
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);

    // UI
    scoreText = this.add.text(20, 20, 'Trophies: ' + score, { fontSize: '32px', fill: '#000' }).setScrollFactor(0);
    timerText = this.add.text(20, 60, 'Time: ' + timeLeft, { fontSize: '32px', fill: '#000' }).setScrollFactor(0);
    
    // Pause Message (Hidden by default)
    pauseText = this.add.text(400, 300, 'PAUSED', { fontSize: '64px', fill: '#fff', backgroundColor: '#000' }).setOrigin(0.5).setScrollFactor(0);
    pauseText.setVisible(false);

    // TIMER EVENT
    this.time.addEvent({
        delay: 1000,
        callback: () => {
            if (!isPaused) {
                timeLeft--;
                timerText.setText('Time: ' + timeLeft);
                if (timeLeft <= 0) {
                    alert("Time's Up! Score: " + score);
                    location.reload();
                }
            }
        },
        callbackScope: this,
        loop: true
    });

    // PAUSE KEY (P)
    this.input.keyboard.on('keydown-P', () => {
        if (isPaused) {
            this.physics.resume();
            pauseText.setVisible(false);
            isPaused = false;
        } else {
            this.physics.pause();
            pauseText.setVisible(true);
            isPaused = true;
        }
    });

    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.collider(this.player, this.platforms);

    // LAVA BUG FIX: Subtracts 5 seconds instead of resetting to 30
    this.physics.add.overlap(this.player, this.lava, () => {
        this.player.x = 100;
        this.player.y = 400;
        timeLeft -= 5;
        this.cameras.main.shake(200, 0.01); // Screen shake for feedback
    }, null, this);

    this.physics.add.overlap(this.player, this.trophy, () => {
        score++;
        scoreText.setText('Trophies: ' + score);
        this.player.x = 100;
        this.player.y = 400;
        this.cameras.main.flash(500, 255, 255, 0);
    }, null, this);
}

function update() {
    if (isPaused) return; // Stop player movement if paused

    if (this.cursors.left.isDown) {
        this.player.body.setVelocityX(-250);
    } else if (this.cursors.right.isDown) {
        this.player.body.setVelocityX(250);
    } else {
        this.player.body.setVelocityX(0);
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
        this.player.body.setVelocityY(-550);
    }
}
