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
    // 1. Set the sky color
    this.cameras.main.setBackgroundColor('#87CEEB');

    // 2. Create the "Static" Floor (Green Rectangle)
    this.platforms = this.physics.add.staticGroup();
    let floor = this.add.rectangle(400, 580, 800, 40, 0x00ff00);
    
    // 3. Make the floor solid
    this.physics.add.existing(floor, true); 
    this.platforms.add(floor);

    // 4. Create the player (Red Square)
    this.player = this.add.rectangle(400, 100, 50, 50, 0xff0000);
    this.physics.add.existing(this.player);

    // 5. THE MAGIC: This prevents falling through the floor
    this.physics.add.collider(this.player, this.platforms);
}
