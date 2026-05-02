const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 1000 } } // Slightly higher gravity for tighter control
    },
    scene: { preload: preload, create: create, update: update }
};

const game = new Phaser.Game(config);

let score = 0;
let timeLeft = 120;
let isPaused = false;
let scoreText, timerText, pauseText;

function preload() {}

function create() {
    this.cameras.main.setBackgroundColor('#87CEEB');

    const worldWidth = 5000;
    this.physics.world.setBounds(0, 0, worldWidth, 600);
    this.cameras.main.setBounds(0, 0, worldWidth, 600);

    this.platforms = this.physics.add.staticGroup();

    // 1. THE LAVA
    this.lava = this.add.rectangle(worldWidth / 2, 590, worldWidth, 20, 0xff0000);
    this.physics.add.existing(this.lava, true);

    // 2. THE STARTING PAD
    let startPad = this.add.rectangle(100, 500, 200, 20, 0x00ff00);
    this.physics.add.existing(startPad, true);
    this.platforms.add(startPad);

    // 3. RELATIVE PROCEDURAL PLATFORMS
    let lastY = 500; // Start at the same height as the startPad
    const maxVerticalDiff = 150; // Maximum jump height difference

    for (let i = 450; i < worldWidth - 200; i += 350) {
        // Calculate a range based on the last platform's height
        let minY = Math.max(200, lastY - maxVerticalDiff);
        let maxY = Math.min(500, lastY + maxVerticalDiff);
        
        let randomY = Math.floor(Math.random() * (maxY - minY + 1) + minY);
        
        let plat = this.add.rectangle(i, randomY, 150, 20, 0x00ff00);
        this.physics.add.existing(plat, true);
        this.platforms.add(plat);
        
        lastY = randomY; // Save this height for the next platform
    }

    // 4. THE TROPHY
    this.trophy = this.add.rectangle(worldWidth - 100, lastY - 60, 50, 50, 0xffff00);
    this.physics.add.existing(this.trophy, true);

    // 5. THE PLAYER
    this.player = this.add.rectangle(100, 400, 40, 40, 0x333333);
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);

    // 6. UI
    scoreText = this.add.text(20, 20, 'Trophies: ' + score, { fontSize: '32px', fill: '#000' }).setScrollFactor(0);
    timerText = this.add.text(20, 60, 'Time: ' + timeLeft, { fontSize: '32px', fill: '#000' }).setScrollFactor(0);
    pauseText = this.add.text(400, 300, 'PAUSED', { fontSize: '64px', fill: '#fff', backgroundColor: '#000' })
        .setOrigin(0.5).setScrollFactor(0).setVisible(false);

    // 7. CONTROLS (P & R)
    this.input.keyboard.on('keydown-P', () => {
        isPaused = !isPaused;
        if (isPaused) { this.physics.pause(); pauseText.setVisible(true); }
        else { this.physics.resume(); pauseText.setVisible(false); }
    });

    this.input.keyboard.on('keydown-R', () => {
        score = 0; timeLeft = 120;
        scoreText.setText('Trophies: ' + score);
        timerText.setText('Time: ' + timeLeft);
        this.player.setPosition(100, 400);
        this.player.body.setVelocity(0, 0);
        this.cameras.main.flash(300);
    });

    // 8. TIMER
    this.time.addEvent({
        delay: 1000,
        callback: () => {
            if (!isPaused) {
                timeLeft--;
                timerText.setText('Time: ' + timeLeft);
                if (timeLeft <= 0) { alert("Game Over! Score: " + score); location.reload(); }
            }
        },
        loop: true
    });

    // 9. COLLISIONS
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(this.player, this.platforms);

    this.physics.add.overlap(this.player, this.lava, () => {
        this.player.setPosition(100, 400);
        this.player.body.setVelocity(0, 0);
        timeLeft = Math.max(0, timeLeft - 5);
        this.cameras.main.shake(200, 0.01);
    });

    this.physics.add.overlap(this.player, this.trophy, () => {
        score++;
        scoreText.setText('Trophies: ' + score);
        this.player.setPosition(100, 400);
        this.player.body.setVelocity(0, 0);
        this.cameras.main.flash(500, 255, 255, 0);
    });
    this.input.keyboard.on('keydown-H', () => {
    // 1. Create the text in the center of the screen
    let greeting = this.add.text(400, 300, 'Hi Caden!', { 
        fontSize: '64px', 
        fill: '#ffffff',
        backgroundColor: '#000000',
        padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setScrollFactor(0); // setScrollFactor(0) keeps it stuck to the screen

    // 2. Make it disappear after 2 seconds
    this.time.delayedCall(2000, () => {
        greeting.destroy();
    });
});
}

function update() {
    if (isPaused) return;
    const speed = 300;
    const jump = -600;

    if (this.cursors.left.isDown) this.player.body.setVelocityX(-speed);
    else if (this.cursors.right.isDown) this.player.body.setVelocityX(speed);
    else this.player.body.setVelocityX(0);

    if (this.cursors.up.isDown && this.player.body.touching.down) {
        this.player.body.setVelocityY(jump);
    }
}
