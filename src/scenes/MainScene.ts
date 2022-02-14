import * as Phaser from 'phaser';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({});
  }

  preload() {
    this.load.image('logo', 'assets/sprites/phaser3-logo.png');
  }

  create() {
    const logo = this.physics.add.image(400, 100, 'logo');

    logo.setVelocity(100, 200);
    logo.setBounce(1, 1);
    logo.setCollideWorldBounds(true);
  }
}
