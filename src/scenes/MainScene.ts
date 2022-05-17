/* eslint-disable class-methods-use-this */
import * as Phaser from 'phaser';

export default class MainScene extends Phaser.Scene {
  public score = 0;
  public scoreText: Phaser.GameObjects.Text;
  public player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  public platforms: Phaser.Physics.Arcade.StaticGroup;
  public coins: Phaser.GameObjects.Group;
  public scoreCoin: Phaser.GameObjects.Image;
  public moon: Phaser.GameObjects.Image;
  public cloud1: Phaser.GameObjects.Image;
  public cloud2: Phaser.GameObjects.Image;
  public cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  public stupidmonster: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  constructor() {
    super({});
  }

  preload() {
    this.load.image('background', 'assets/sprites/simpleBackground.png');
    this.load.image('grass_platform', 'assets/kennyGameAssets/ground_grass.png');
    this.load.image('moon', 'assets/kennyGameAssets/moon_full.png');
    this.load.image('cloud', 'assets/kennyGameAssets/cloud1.png');
    this.load.image('coin', 'assets/kennyGameAssets/gold_1.png');
    this.load.image('stupidmonster', 'assets/kennyGameAssets/stupidmonster.png');
    
    this.load.spritesheet(
      'player',
      'assets/sprites/forager.png',
      { frameWidth: 64, frameHeight: 64 },
    );
  }

  create() {
    // background
    this.add.image(0, 0, 'background').setOrigin(0, 0);
    this.moon = this.add.image(200, 50, 'moon').setOrigin(0, 0).setScale(2);
    this.cloud1 = this.add.image(50, 120, 'cloud').setOrigin(0, 0);
    this.cloud2 = this.add.image(100, 20, 'cloud').setOrigin(0, 0).setScale(2);

    // platforms
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(600, 550, 'grass_platform');
    this.platforms.create(50, 450, 'grass_platform');
    this.platforms.create(750, 420, 'grass_platform');

    // player setup
    this.player = this.physics.add.sprite(100, 150, 'player');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    
    // stupidmonster
    this.stupidmonster = this.physics.add.sprite(300, 150, 'stupidmonster');
    this.stupidmonster.setBounce(0.2);
    this.stupidmonster.setCollideWorldBounds(true);


    // TODO: tailor the animations to sprite
    /* this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'turn',
      frames: [{ key: 'player', frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    }); */

    this.cursors = this.input.keyboard.createCursorKeys();

    // let the player collide with platforms
    this.physics.add.collider(this.player, this.platforms);

    // add coins
    this.scoreCoin = this.add.sprite(30, 32, 'coin');
    this.scoreCoin.setOrigin(.5, .5);
    this.scoreCoin.scaleX = .5;
    this.scoreCoin.scaleY = .5;

    const config: Phaser.Types.GameObjects.Group.GroupCreateConfig = {
      key: 'coin',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
      setScale: { x: 0.5, y: 0.5 },

    };
    this.coins = this.physics.add.group(config);
    this.coins.children.iterate((child) => {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    // coins.children.iterate((child) => child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8)));
    // let coins collide with platforms
    this.physics.add.collider(this.coins, this.platforms);

    // enable the player to collect coins
    this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);

    // init score text
    this.scoreText = this.add.text(56, 21, '0', { fontSize: '32px' });
  }

  update() {
    // moon movement
    this.moveImage(this.moon, 0.1);
    // cloud movement
    this.moveImage(this.cloud1, 0.2);
    this.moveImage(this.cloud2, 0.3);

    // left and right movement
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      // player.anims.play('left', true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      // player.anims.play('right', true);
    } else {
      this.player.setVelocityX(0);
      // player.anims.play('turn');
    }
    // jump
    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }

    // touched monster
    let bounds_player = player.getBounds();
    let bounds_monster = stupidmonster.getBounds();
    if (Phaser.Rectangle.intersects(bounds_player, bounds_monster)) {
      this.add.text(16, 16, 'Game over!', { fill: '#ffffff' });
    }

  }

  private collectCoin(player, coin) {
    coin.disableBody(true, true);
    this.score += 10;
    this.scoreText.setText(`${this.score}`);
  }

  private moveImage(object: Phaser.GameObjects.Image, value: number, limit = 800) {
    if (object.x <= limit) {
      object.setX(object.x + value);
    } else {
      object.setX(-400);
    }
  }

}
