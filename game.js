const config = {
    type: Phaser.AUTO, // Added this for safety
    width: 800, 
    height: 600,
    physics: {
        default: 'arcade', 
        arcade: { gravity: { y: 300 } } 
    },
    // FIX 1: Added update to the scene list here!
    scene: { preload: preload, create: create, update: update }
};

const game = new Phaser.Game(config);

function preload() {
    // Images coming soon!
}

function create() {
    this.cameras.main.setBackgroundColor('#87CEEB');

    this.platforms = this.physics.add.staticGroup();
    let floor = this.add.rectangle(400, 580, 800, 40, 0x00ff00);
    this.physics.add.existing(floor, true); 
    this.platforms.add(floor);

    this.player = this.add.rectangle(400, 100, 50, 50, 0xff0000);
    this.physics.add.existing(this.player);
    
    // FIX 2: Tell Phaser to listen to the keyboard
    this.cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.collider(this.player, this.platforms);
}

function update() {
    // If the left arrow is down, move left
    if (this.cursors.left.isDown) {
        this.player.body.setVelocityX(-160);
    }
    // If the right arrow is down, move right
    else if (this.cursors.right.isDown) {
        this.player.body.setVelocityX(160);
    }
    // If nothing is pressed, stop moving
    else {
        this.player.body.setVelocityX(0);
    }

    // Jump if Up is pressed AND the square is on the floor
    if (this.cursors.up.isDown && this.player.body.touching.down) {
        this.player.body.setVelocityY(-330);
    }
}
