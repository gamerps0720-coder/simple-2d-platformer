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

// Global variables to track state
let score = 0;
let timeLeft = 30;
let timerText;
let scoreText;

function preload() {}

function create() {
    this.cameras.main.setBackgroundColor('#87CEEB');
    const worldWidth = 5000;
    this.physics.world.setBounds(0, 0, worldWidth, 600);
    this.cameras.main.setBounds(0, 0, worldWidth, 600);

    this.platforms = this.physics.add.staticGroup();

    // 1. THE LAVA (Red Ground)
    // If you touch this, you restart!
    this.lava = this.add.rectangle(worldWidth/2, 590, worldWidth, 20, 0xff0000);
    this.physics.add.existing(this.lava, true);

    // 2. SAFE STARTING PAD
    let startPad = this.add.rectangle(100, 500, 200, 20, 0x00ff00);
    this.physics.add.existing(startPad, true);
    this.platforms.add(startPad);

    // 3. PROCEDURAL PLATFORMS
    for (let i = 400; i < worldWidth - 200; i += 350) {
        let randomY = Math.floor(Math.random() * (450 - 200 + 1) + 200);
        let plat = this.add.rectangle(i, randomY, 150, 20, 0x00ff00);
        this.physics.add.existing(plat, true);
        this.platforms.add(plat);
    }

    // 4. THE TROPHY (Gold)
    this.trophy = this.add.rectangle(worldWidth - 100, 300, 50, 50, 0xffff00);
    this.physics.add.existing(this.trophy, true);

    // 5. THE PLAYER
    this.player = this.add.rectangle(100, 400, 40, 40, 0x333333); // Dark gray player
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);

    // 6. UI (Fixed to the screen)
    scoreText = this.add.text(20, 20, 'Trophies: ' + score, { fontSize: '32px', fill: '#000' }).setScrollFactor(0);
    timerText = this.add.text(20, 60, 'Time: ' + timeLeft, { fontSize: '32px', fill: '#000' }).setScrollFactor(0);

    // 7. TIMER LOGIC
    this.time.addEvent({
        delay: 1000,
        callback: () => {
            timeLeft--;
            timerText.setText('Time: ' + timeLeft);
            if (timeLeft <= 0) {
                alert("Game Over! Total Trophies: " + score);
                location.reload();
            }
        },
        callbackScope: this,
        loop: true
    });

    // 8. CAMERA & INPUTS
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cursors = this.input.keyboard.createCursorKeys();

    // 9. COLLISIONS & OVERLAPS
    this.physics.add.collider(this.player, this.platforms);

    // Touching Lava = Death
    this.physics.add.overlap(this.player, this.lava, () => {
        this.scene.restart();
        timeLeft = 30; // Reset timer on death? Or keep it? Let's reset for fairness.
    }, null, this);

    // Touching Trophy = Score + Reset Position
    this.physics.add.overlap(this.player, this.trophy, () => {
        score++;
        scoreText.setText('Trophies: ' + score);
        this.player.x = 100;
        this.player.y = 400;
        this.cameras.main.flash(500, 255, 255, 0); // Flash yellow on win
    }, null, this);
}

function update() {
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
