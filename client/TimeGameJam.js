var socket; // define a global variable called socket
socket = io.connect(); // send a connection request to the server

var canjam= new Phaser.Game(baseWidth, baseHeight, Phaser.AUTO, "canjam18", {init: init, preload: preload, create: create, update: update, render: render });
this.preloadBar = null;

var enemy;

var sfx;

function init() //Setup necessary context
{
  this.game.stage.minWidth = canjam.baseWidth;
  this.game.stage.minHeight = canjam.baseHeight;
  this.game.stage.maxWidth = canjam.baseWidth * canjam.scale;
  this.game.stage.maxHeight = canjam.baseHeight * canjam.scale;
  this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  this.game.world.setBounds(0, 0, worldBoundx, worldBoundy);
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
  this.game.load.image('BackgroundSprite', 'client/assets/background.png');
  this.game.load.spritesheet('Enemy', 'client/assets/newenemy.png', 32, 30, 8);

  //audio
  this.game.load.audio('Eject',  'client/assets/sound/sfx/ascend.wav');
  this.game.load.audio('Explosion', 'client/assets/sound/sfx/explosion.wav');
  this.game.load.audio('Hit', 'client/assets/sound/sfx/hit.wav');
  this.game.load.audio('Shoot', 'client/assets/sound/sfx/shoot.wav');
  this.game.load.audio('Special', 'client/assets/sound/sfx/special.wav')

  //voice
  for (var i = 1; i < 4; i++) {
    this.game.load.audio('AlmostDead' + i, 'client/assets/sound/sfx/voice/AlmostDead' + i + '.mp3');
  }
  for (var i = 1; i < 6; i++) {
    this.game.load.audio('EnemySpotted' + i, 'client/assets/sound/sfx/voice/EnemySpotted' + i + '.mp3');
  }
  for (var i = 1; i < 5; i++) {
    this.game.load.audio('German' + i, 'client/assets/sound/sfx/voice/German' + i + '.mp3');
  }
  for (var i = 1; i < 6; i++) {
    this.game.load.audio('NiceShot' + i, 'client/assets/sound/sfx/voice/NiceShot' + i + '.mp3');
  }
  for (var i = 1; i < 2; i++) {
    this.game.load.audio('Tutorial' + i, 'client/assets/sound/sfx/voice/Tutorial' + i + '.mp3');
  }
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
  shaderLayer = this.game.add.group();

  this.game.physics.startSystem(Phaser.Physics.ARCADE);

  checkGamepad();

  this.backgroundObj = backgroundLayer.create(0, baseHeight/2, 'BackgroundSprite');
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

  //test enemy NUUT
  //testEnemy = this.game.add.sprite(100, 100, 'Enemy');
  //eShoot = testEnemy.animations.add('shoot');

  //create enemies
  for (var i = 0; i < 11; i++) { //create 10 enemies
    enemyObjs[i] = enemyTankLayer.create(Math.floor((Math.random()*600)+1), 120, 'Enemy');
    enemyObjs[i].anchor.setTo(0.5, 0.5);
    enemyObjs[i].scale.setTo(0.0,0.0);
    this.game.physics.enable(enemyObjs[i], Phaser.Physics.ARCADE);
    enemyScaleMod[i] = 0.001;
    direction[i] = 0;
  }

/*
  //sound
  for (var i = 1; i < 4; i++) {
    sfx['AlmostDead' + i] = this.game.add.audio('AlmostDead' + i);
  }
  for (var i = 1; i < 6; i++) {
    sfx['EnemySpotted' + i] = this.game.add.audio('EnemySpotted' + i);
  }
  for (var i = 1; i < 5; i++) {
    sfx['German' + i] = this.game.add.audio('German' + i);
  }
  for (var i = 1; i < 4; i++) {
    sfx['NiceShot' + i] = this.game.add.audio('NiceShot' + i);
  }
  for (var i = 1; i < 2; i++) {
    sfx['Tutorial' + i] = this.game.add.audio('Tutorial' + i);
  }
*/
    textCreate();

    //SHADERS; NEEDS TO BE LAST
    colourFilter = new Phaser.Filter(canjam, null, colourFragmentSrc);
    colourFilter.setResolution(baseWidth, baseHeight);

    colourScreen = this.add.sprite();
    colourScreen.width = baseWidth;
    colourScreen.height = baseHeight;
    colourScreen.filters = [colourFilter ];

    glitchFilter = new Phaser.Filter(canjam, null, glitchFragmentSrc);
    glitchFilter.setResolution(baseWidth, baseHeight);

    glitchScreen = this.add.sprite();
    glitchScreen.width = baseWidth;
    glitchScreen.height = baseHeight;
    glitchScreen.filters = [glitchFilter ];


    screenFilter = new Phaser.Filter(canjam, null, screenFragmentSrc);
    screenFilter.setResolution(baseWidth, baseHeight);

    spriteScreen = this.add.sprite();
    spriteScreen.width = baseWidth;
    spriteScreen.height = baseHeight;
    spriteScreen.filters = [screenFilter ];

    // Glitch Timers
    canjam.time.events.add(Phaser.Timer.SECOND * 2, deleteGlitchFilter, this);


  }

  //canjam.enemyObjs.push(this.enemyTank);
  //enemyTankLayer.add(enemyTank);

function update()
{
  // Set noInput to false for any key press
  if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {noInput = false; moveEnemies(1); }
  else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {noInput = false; moveEnemies(2); }

  if(gameStart)
  {
    //increase enemy scale to make them appear as if moving forward
    for (var i = 0; i < 11; i++) { enemyObjs[i].scale.set(enemyScaleMod[i], enemyScaleMod[i]); enemyScaleMod[i] += 0.001; }

    // Random Attack event!
    attackRandNum = Math.floor(Math.random() * 100);
    //Random Enemy Attack!
    if(attackRandNum > 98){/*console.log("ATTACK POSSIBLE");*/ attackingEnemy = enemyObjs[Math.floor(Math.random() * enemyObjs.length)]}
    else{attackflag = false;}

    // CHOSEN ENEMY SHOOT!
    enemyShoot(attackingEnemy);

    textUpdate();

    screenFilter.update(playerTank);
    spriteScreen.moveUp();
  }
  //glitchScreen.moveUp();
  if(noInput == true){ glitchFilter.update(); colourFilter.update();}
  else{deleteGlitchFilter();}
}

function render()
{
  this.game.debug.cameraInfo(this.game.camera, 500, 32);
}

function shoot() { //player shooting
    console.log("Shot fired!");
}

function moveEnemies(direction)
{
  for (var i = 0; i < 11; i++)
  {
    if (direction == 1) { enemyObjs[i].body.x += 3; backgroundLayer.x += 0.075; }
    else if (direction == 2) { enemyObjs[i].body.x -= 3; backgroundLayer.x -= 0.075;}
  }
}

function enemyShoot(attackingEnemy)
{

    //TODO

    takeDamage();
}

function takeDamage()
{

  player health -= 1;
  canjam.camera.flash(0xff0000, 500);
}

function textCreate()
{
  console.log("Text Created");
  scoreText = canjam.add.text(20,20, "Score: 0", style);
  scoreText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
}

function textUpdate()
{
  scoreText.setText("Score: "+ score * 100);
}

function deleteGlitchFilter()
{
  canjam.time.events.add(Phaser.Timer.SECOND * 2, deleteColourFilter, this);
  glitchScreen.destroy();

  canjam.camera.fade(0x000000, 1000);
  canjam.camera.flash(null, 2000, true);
}

function deleteCheckerFilter()
{

}

function deleteColourFilter()
{
  colourScreen.destroy();
  gameStart = true;

  //FADE IN
  canjam.camera.fade(0x000000, 4000);
  canjam.camera.flash(null, 6000, true);
}

function checkGamepad()
{
  canjam.input.gamepad.start();
  pad = canjam.input.gamepad.pad1;
  pad.addCallbacks(this, { onConnect: addButtons });


}

function addButtons()
{
  this.buttonDPadLeft.onDown.add(onDown, this);
  this.buttonDPadRight.onDown.add(onDown, this);

  this.buttonDPadLeft.onUp.add(onUp, this);
  this.buttonDPadRight.onUp.add(onUp, this);
}

function onDown(button, value)
{
  if (button.buttonCode === Phaser.Gamepad.XBOX360_DPAD_LEFT) { noInput = false; moveEnemies(1); }
      else if (button.buttonCode === Phaser.Gamepad.XBOX360_DPAD_RIGHT) { noInput = false; moveEnemies(2); }
}

function onUp(button, value)
{
  if (button.buttonCode === Phaser.Gamepad.XBOX360_DPAD_LEFT) { }
      else if (button.buttonCode === Phaser.Gamepad.XBOX360_DPAD_RIGHT) { }
}
