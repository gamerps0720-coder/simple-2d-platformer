const config = {
  width: 800, height: 600,
  physics: {default: 'arcade', arcade: { gravity: { y: 300 } } },
  scene: { preload: preload, create: create }
};
const game = new Phaser.Game(config);
function preload() {
    // We will put images here later
}
function create() {
    // This sets the sky color
    this.cameras.main.setBackgroundColor('#87CEEB');
  
  // 2. Create the player (Red Square)
    this.player = this.add.rectangle(400, 100, 50, 50, 0xff0000);

    // 3. Turn on the physics for the player
    this.physics.add.existing(this.player);
}
