var socket; // define a global variable called socket
socket = io.connect(); // send a connection request to the server

var canjam= new Phaser.Game(baseWidth, baseHeight, Phaser.AUTO, "canjam18", {init: init, preload: preload, create: create, update: update, render: render });
this.preloadBar = null;

var enemy;

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
  // font
  canjam.load.script("webfont", "//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js");
  //sprites
  this.game.load.image('EnemyTankSprite', 'client/assets/EnemyTank.png');
  this.game.load.image('PlayerBarrelSprite', 'client/assets/PlayerBarrel.png');
  this.game.load.image('BulletSprite', 'client/assets/Bullet.png');
  this.game.load.image('BackgroundSprite', 'client/assets/bg_placeholder.png');

  //audio
  this.game.load.audio('Eject',  'client/assets/sound/sfx/ascend.wav');
  this.game.load.audio('Explosion', 'client/assets/sound/sfx/explosion.wav');
  this.game.load.audio('Hit', 'client/assets/sound/sfx/hit.wav');
  this.game.load.audio('Shoot', 'client/assets/sound/sfx/shoot.wav');
  this.game.load.audio('Special', 'client/assets/sound/sfx/special.wav')
}

//it's okay to be gay :)
//unless you are Sean Von Jones
//that's pretty gay

function create() //Create world objects
{
  backgroundLayer = this.game.add.group();
  enemyTankLayer = this.game.add.group();
  //projectileLayer = this.game.add.group();
  //uiLayer = this.game.add.group();
  //wallsLayer = this.game.add.group();

  cursors = this.game.input.keyboard.createCursorKeys();

  this.game.physics.startSystem(Phaser.Physics.ARCADE);

  this.backgroundObj = backgroundLayer.create(0, baseHeight/2, 'BackgroundSprite');
  //this.game.add.sprite(0, baseHeight/2, 'BackgroundSprite');
  this.backgroundObj.anchor.setTo(0.5,0.5);

  //Add projectile object
  this.projectile = this.game.add.sprite(baseWidth/2, baseHeight, 'BulletSprite');
  this.projectile.angle = -90;
  this.projectile.anchor.setTo(0.5, 0.5);
  this.game.physics.enable(this.projectile, Phaser.Physics.ARCADE);

  //Add player object
  this.playerTank = this.game.add.sprite(baseWidth/2, baseHeight, 'PlayerBarrelSprite');
  this.playerTank.anchor.setTo(0.5, 1.0);
  this.game.physics.enable(this.playerTank, Phaser.Physics.ARCADE);

  //create enemies
  for (var i = 0; i < 11; i++) { //create 10 enemies
    enemyObjs[i] = enemyTankLayer.create(Math.floor((Math.random()*600)+1), 400, 'EnemyTankSprite');
    enemyObjs[i].anchor.setTo(0.5, 0.5);
    enemyObjs[i].scale.setTo(0.0,0.0);
    this.game.physics.enable(enemyObjs[i], Phaser.Physics.ARCADE);
    direction[i] = 0;

    textCreate();

    //SHADERS; NEEDS TO BE LAST
    screenFilter = new Phaser.Filter(canjam, null, screenFragmentSrc);
    screenFilter.setResolution(baseWidth, baseHeight);

    spriteScreen = this.add.sprite();
    spriteScreen.width = baseWidth;
    spriteScreen.height = baseHeight;
    spriteScreen.filters = [screenFilter ];

    //FADE IN
    canjam.camera.fade(0x000000, 4000);
    canjam.camera.flash(null, 6000, true);
  }

  //canjam.enemyObjs.push(this.enemyTank);
  //enemyTankLayer.add(enemyTank);
}

function update()
{
  //for (var i = 0; i < 11; i++)
  //{
    //if(enemyObjs[i].body.x > (baseWidth - enemyObjs[i].scale.x)) { direction = 0; } //direction = 0 is left
    //else if(enemyObjs[i].body.x < 0) { direction = 1; } //direction = 1 is right

  //  if(direction[i] == 1) { enemyObjs[i].body.velocity.x = 100; }
  //  else if(direction[i] == 0) { enemyObjs[i].body.velocity.x = -100; }
  //}

  for (var i = 0; i < 11; i++) { enemyObjs[i].scale.set(enemyScaleMod, enemyScaleMod); }

 enemyScaleMod += 0.001;


  if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) { this.game.camera.x -= 40; this.playerTank.body.velocity.x -= 40; }
  else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {  this.game.camera.x += 40; this.playerTank.body.velocity.x += 40; }
  else {
    //Drastically slow player turning if they are not currently turning (Give a clunky feel)
    if (this.playerTank.body.velocity.x > 0) { this.playerTank.body.velocity.x -= 2.5; }
    else if (this.playerTank.body.velocity.x < 0) { this.playerTank.body.velocity.x += 2.5; }
  }

  //Limit player turning velocity
  if (this.playerTank.body.velocity.x > 122) { this.playerTank.body.velocity.x = 122; }
  else if ( this.playerTank.body.velocity.x < -122) { this.playerTank.body.velocity.x = -122; }

  if (cursors.left.isDown) { this.game.camera.x -= 4; }
  else if (cursors.right.isDown) { this.game.camera.x += 4; }
  console.log(cursors.left.isDown);

/*  if (this.game.input.keyboardisDown(Phaser.Keyboard.SPACE)) {
    shoot();
  }*/

  textUpdate();

  screenFilter.update(canjam.input.mousePointer);
  spriteScreen.moveUp();
}

function render()
{
  this.game.debug.cameraInfo(this.game.camera, 500, 32);
}

function shoot() { //player shooting
  console.log("Shot fired!");


}

function textCreate()
{
  console.log("Text Created");
  scoreText = canjam.add.text(32,64, "Score: 0", style);
  scoreText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
}

function textUpdate()
{
  scoreText.setText("Score: "+ score * 100);
}
