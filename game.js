const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 600 } } // Higher gravity for a "snappier" feel
    },
    scene: { preload: preload, create: create, update: update }
};

const game = new Phaser.Game(config);

function preload() {}

function create() {
    this.cameras.main.setBackgroundColor('#87CEEB');

    // 1. Setup the World Size (5000 pixels wide!)
    this.physics.world.setBounds(0, 0, 5000, 600);
    this.cameras.main.setBounds(0, 0, 5000, 600);

    this.platforms = this.physics.add.staticGroup();

    // 2. Create the starting floor
    let floor = this.add.rectangle(2500, 580, 5000, 40, 0x00ff00);
    this.physics.add.existing(floor, true);
    this.platforms.add(floor);

    // 3. PROCEDURAL GENERATION: The Platform Loop
    // Every 400 pixels, we place a random floating platform
    for (let i = 400; i < 5000; i += 400) {
        let randomY = Phaser.Math.Between(200, 450); // Random height
        let plat = this.add.rectangle(i, randomY, 200, 20, 0x00ff00);
        this.physics.add.existing(plat, true);
        this.platforms.add(plat);
    }

    // 4. Create the Player
    this.player = this.add.rectangle(100, 450, 50, 50, 0xff0000);
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true); // Don't let him leave the map!

    // 5. CAMERA FOLLOW
    this.cameras.main.startFollow(this.player, true, 0.05, 0.05);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(this.player, this.platforms);
}

function update() {
    if (this.cursors.left.isDown) {
        this.player.body.setVelocityX(-200);
    } else if (this.cursors.right.isDown) {
        this.player.body.setVelocityX(200);
    } else {
        this.player.body.setVelocityX(0);
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
        this.player.body.setVelocityY(-500);
    }
}
