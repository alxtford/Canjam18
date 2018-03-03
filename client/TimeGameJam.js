var socket; // define a global variable called socket
socket = io.connect(); // send a connection request to the server

var canjam= new Phaser.Game(baseWidth, baseHeight, Phaser.AUTO, "canjam18", {init: init, preload: preload, create: create, update: update});
this.preloadBar = null;

function init() //Setup necessary context
{
  this.game.stage.minWidth = canjam.baseWidth;
  this.game.stage.minHeight = canjam.baseHeight;
  this.game.stage.maxWidth = canjam.baseWidth * canjam.scale;
  this.game.stage.maxHeight = canjam.baseHeight * canjam.scale;
  this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  this.scale.pageAlignHorizontally = true;
  this.scale.pageAlignVertically = true;
}

function preload() //Load Assets
{
  this.game.load.image('EnemyTankSprite', 'client/assets/EnemyTank.png');
  this.game.load.image('PlayerBarrelSprite', 'client/assets/PlayerBarrel.png');
  this.game.load.image('BulletSprite', 'client/assets/Bullet.png');
}

function create() //Create world objects
{
  this.game.physics.startSystem(Phaser.Physics.ARCADE);

  enemyTankLayer = this.game.add.group();
  projectileLayer = this.game.add.group();
  uiLayer = this.game.add.group();
  wallsLayer = this.game.add.group();
  backgroundLayer = this.game.add.group();

  //Add enemy tank object
  this.enemyTank = this.game.add.sprite(300, 100, 'EnemyTankSprite');
  this.enemyTank.anchor.setTo(0.5, 0.5);
  this.game.physics.enable(this.enemyTank, Phaser.Physics.ARCADE);

  //Add projectile object
  this.projectile = this.game.add.sprite(baseWidth/2, baseHeight, 'BulletSprite');
  this.projectile.angle = -90;
  this.projectile.anchor.setTo(0.5, 0.5);
  this.game.physics.enable(this.projectile, Phaser.Physics.ARCADE);

  //Add player object
  this.playerTank = this.game.add.sprite(baseWidth/2, baseHeight, 'PlayerBarrelSprite');
  this.playerTank.anchor.setTo(0.5, 1.0);
  this.game.physics.enable(this.playerTank, Phaser.Physics.ARCADE);


  //canjam.enemyObjs.push(this.enemyTank);
  //enemyTankLayer.add(enemyTank);
}

function update()
{
  this.enemyTank.body.velocity.x = 100;

  if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) { this.playerTank.body.velocity.x -= 40; }
  else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) { this.playerTank.body.velocity.x += 40; }
  else {
    //Drastically slow player turning if they are not currently turning (Give a clunky feel)
    if (this.playerTank.body.velocity.x > 0) { this.playerTank.body.velocity.x -= 2.5; }
    else if (this.playerTank.body.velocity.x < 0) { this.playerTank.body.velocity.x += 2.5; }
  }

  //Limit player turning velocity
  if (this.playerTank.body.velocity.x > 122) { this.playerTank.body.velocity.x = 122; }
  else if ( this.playerTank.body.velocity.x < -122) { this.playerTank.body.velocity.x = -122; }


}