var socket; // define a global variable called socket
socket = io.connect(); // send a connection request to the server

var canjam= new Phaser.Game(baseWidth, baseHeight, Phaser.AUTO, "canjam18", {init: init, preload: preload, create: create, update: update, render: render });
this.preloadBar = null;

var enemy;
var ultCharge = 0;

var sfx = [];
var gameSpeed = 0;

function init() //Setup necessary context
{
  canjam.stage.minWidth = canjam.baseWidth;
  canjam.stage.minHeight = canjam.baseHeight;
  canjam.stage.maxWidth = canjam.baseWidth * canjam.scale;
  canjam.stage.maxHeight = canjam.baseHeight * canjam.scale;
  canjam.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  canjam.world.setBounds(0, 0, worldBoundx, worldBoundy);
  this.scale.pageAlignHorizontally = true;
  this.scale.pageAlignVertically = true;
}

function preload() //Load Assets
{
  // font
  canjam.load.script("webfont", "//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js");
  //sprites
  canjam.load.image('EnemyTankSprite', 'client/assets/EnemyTank.png');
  canjam.load.image('PlayerBarrelSprite', 'client/assets/PlayerBarrel.png');
  canjam.load.image('BulletSprite', 'client/assets/Bullet.png');
  canjam.load.image('BackgroundSprite', 'client/assets/background.png');
  canjam.load.image('EnemyShellSprite', 'client/assets/shell.png');
  canjam.load.spritesheet('Enemy', 'client/assets/newenemy.png', 32, 30, 8);

  //audio
  canjam.load.audio('music', 'client/assets/sound/music/main.mp3');

  canjam.load.audio('Eject',  'client/assets/sound/sfx/ascend.wav');
  canjam.load.audio('Explosion', 'client/assets/sound/sfx/explosion.wav');
  canjam.load.audio('Hit', 'client/assets/sound/sfx/hit.wav');
  canjam.load.audio('Shoot', 'client/assets/sound/sfx/shoot.wav');
  canjam.load.audio('Special', 'client/assets/sound/sfx/special.wav')

  //voice
  for (var i = 1; i < 4; i++) {
    canjam.load.audio('AlmostDead' + i, 'client/assets/sound/sfx/voice/AlmostDead' + i + '.mp3');
  }
  for (var i = 1; i < 7; i++) {
    canjam.load.audio('EnemySpotted' + i, 'client/assets/sound/sfx/voice/EnemySpotted' + i + '.mp3');
  }
  for (var i = 1; i < 6; i++) {
    canjam.load.audio('German' + i, 'client/assets/sound/sfx/voice/German' + i + '.mp3');
  }
  for (var i = 1; i < 7; i++) {
    canjam.load.audio('NiceShot' + i, 'client/assets/sound/sfx/voice/NiceShot' + i + '.mp3');
  }
  for (var i = 1; i < 3; i++) {
    canjam.load.audio('Tutorial' + i, 'client/assets/sound/sfx/voice/Tutorial' + i + '.mp3');
  }
}

//it's okay to be gay :)
//unless you are Sean Von Jones
//that's pretty gay

function create() //Create world objects
{
  backgroundLayer = canjam.add.group();
  enemyTankLayer = canjam.add.group();
  projectileLayer = canjam.add.group();
  playerProjectileLayer = canjam.add.group();
  //uiLayer = this.game.add.group();
  //wallsLayer = this.game.add.group();
  shaderLayer = canjam.add.group();

  canjam.physics.startSystem(Phaser.Physics.ARCADE);

  checkGamepad();

  this.backgroundObj = backgroundLayer.create(-256, baseHeight/2, 'BackgroundSprite');
  this.backgroundObj.anchor.setTo(0.5,0.5);

  // //Add projectile object
  // this.projectile = canjam.add.sprite(baseWidth/2, baseHeight, 'BulletSprite');
  // this.projectile.angle = -90;
  // this.projectile.anchor.setTo(0.5, 0.5);
  // canjam.physics.enable(this.projectile, Phaser.Physics.ARCADE);

  //Add player object
  this.playerTank = canjam.add.sprite(baseWidth/2, baseHeight, 'PlayerBarrelSprite');
  this.playerTank.anchor.setTo(0.5, 1.0);
  canjam.physics.enable(this.playerTank, Phaser.Physics.ARCADE);

  //test enemy NUUT
  //testEnemy = this.game.add.sprite(100, 100, 'Enemy');
  //eShoot = testEnemy.animations.add('shoot');

  //create enemies
  makeEnemy();

  //sound
  for (var i = 1; i < 4; i++) {
    sfx['AlmostDead' + i] = canjam.add.audio('AlmostDead' + i);
  }
  for (var i = 1; i < 7; i++) {
    sfx['EnemySpotted' + i] = canjam.add.audio('EnemySpotted' + i);
  }
  for (var i = 1; i < 6; i++) {
    sfx['German' + i] = canjam.add.audio('German' + i);
  }
  for (var i = 1; i < 5; i++) {
    sfx['NiceShot' + i] = canjam.add.audio('NiceShot' + i);
  }
  for (var i = 1; i < 3; i++) {
    sfx['Tutorial' + i] = canjam.add.audio('Tutorial' + i);
  }

  music = canjam.add.audio('music');
  music.play();
  ejectSound = canjam.add.audio('Eject');
  explosionSound = canjam.add.audio('Explosion');
  hitSound = canjam.add.audio('Hit');
  shootSound = canjam.add.audio('Shoot');
  specialSound = canjam.add.audio('Special');

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
  // Keyboard Controls
  if (canjam.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {moveEnemies(1); }
  else if (canjam.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {moveEnemies(2); }
  if (canjam.input.keyboard.isDown(Phaser.Keyboard.UP)) { shoot(); }
  if (canjam.input.keyboard.isDown(Phaser.Keyboard.DOWN) && ultCharge == 100) { ultimate(); }
  if (canjam.input.keyboard.isDown(Phaser.Keyboard.DOWN) && score >= 1) { score--; playerHealth++; specialSound.play(); }

  input();

  if(gameStart)
  {
    //increase enemy scale to make them appear as if moving forward
    for (var i = 0; i < enemyObjs.length; i++) { if (enemyObjs[i].scale.x < 2) { enemyObjs[i].scale.set(enemyScaleMod[i], enemyScaleMod[i]); enemyScaleMod[i] += 0.001; } }

    // Random Attack event!
    attackRandNum = Math.floor(Math.random() * 100);
    //Random Enemy Attack!

    if(attackRandNum > 98){
      var randEnemy = Math.floor(Math.random() * enemyObjs.length);
      attackingEnemy = enemyObjs[randEnemy];
      // CHOSEN ENEMY SHOOT!
      enemyShoot(attackingEnemy);
    }


    if (attackRandNum < 2 && enemyObjs.length < enemyMax){
      makeEnemy();
    }

    for(var i=0; i < enemyProj.length; i++)
    {
      enemyProj[i].scale.set((enemyScaleMod[i] * 5), (enemyScaleMod[i] * 5));
      if (enemyScaleMod[i]*5 > enemyMaxScale) { enemyScaleMod[i] = enemyMaxScale; }

      if (enemyProj[i].scale.x > 3.5)
      {
        takeDamage(enemyProj[i], i);
      }
    }

    if (playerProj.length > 0)
    {
      for (var j = 0; j < playerProj.length; j++)
      {
        playerProj[j].y -= 0.9;
        playerProj[j].scale.set(playerScaleMod[j], playerScaleMod[j]);
        playerScaleMod[j] -= 0.1;
        if (playerScaleMod[j] < 0) {
          playerScaleMod[j] = 0;
          for (var k = 0; k < enemyObjs.length; k++) {
            if (enemyObjs[k].x-16*enemyScaleMod[k] < playerProj[j].x && enemyObjs[k].x+16*enemyScaleMod[k] > playerProj[j].x) {
              deleteEnemy(enemyObjs[k],k);
              score++;
            }
          }
          for (var k = 0; k < enemyProj.length; k++) {
            if (enemyProj[k].x-100*enemyProj[k].scale.x < playerProj[j].x && enemyProj[k].x+100*enemyProj[k].scale.x > playerProj[j].x) {
              destroyEnemyBullet(enemyProj[k],k);
            }
          }
          playerProj[j].x = 120832103; //TODO: not this, make the object get deleted
        }
      }
    }

    textUpdate();

    screenFilter.update(playerTank);
    spriteScreen.moveUp();
  }
  //glitchScreen.moveUp();
  if(noInput == true){ glitchFilter.update(); colourFilter.update();}

  playerLastShot--;
}

function render()
{
  //canjam.debug.cameraInfo(canjam.camera, 500, 32);
}

function input()
{
  if(pad.isDown(Phaser.Gamepad.BUTTON_0))
  {
    moveEnemies(1);
  }

  if(pad.isDown(Phaser.Gamepad.BUTTON_3))
  {
    moveEnemies(2);
  }

  if(pad.isDown(Phaser.Gamepad.BUTTON_1 && score >= 1))
  {
    score--;
    playerHealth++;
    specialSound.play();
  }

  if(pad.isDown(Phaser.Gamepad.BUTTON_2))
  {
    shoot();
  }

  if(pad.isDown((!Phaser.Gamepad.BUTTON_9) && ultCharge == 100))
  {
    ultimate();
  }
}

function shoot() { //player shooting

  if (playerLastShot <= 0)
  {
    shootSound.play();

    var shell = playerProjectileLayer.create(baseWidth/2, baseHeight - 40, "EnemyShellSprite");
    shell.scale.setTo(3.5, 3.5);
    shell.anchor.setTo(0.5, 0.5);
    playerScaleMod.push(3.5);
    playerProj.push(shell);
    playerLastShot = 20;
  }
}

function makeEnemy()
{
  if ((Math.floor(Math.random()*4)+1) == 1) { //one in 3 shots trigger a voiceline
    sfx["EnemySpotted" + (Math.floor(Math.random()*6)+1)].play(); //make german fella yell a something something
  }

  //var enemyObj = enemyTankLayer.create(Math.floor((Math.random()* (backgroundLayer.x-worldBoundx))+(0-backgroundLayer.x)), 120, 'Enemy');
  var enemyObj = enemyTankLayer.create(Math.floor((Math.random()*(baseWidth-200))+1), 120, 'Enemy');
  //if (enemyObj.body.x < 40) { enemyObj.body.x += (50 + Math.floor(Math.random()+5)); }
  enemyObj.anchor.setTo(0.5, 0.5);
  enemyObj.scale.setTo(0.0,0.0);
  canjam.physics.enable(enemyObj, Phaser.Physics.ARCADE);
  enemyObjs.push(enemyObj);
  enemyScaleMod.push(0.001);
}

function moveEnemies(direction)
{
  for (var i = 0; i < enemyObjs.length; i++)
  {
    if ((direction == 1) && (backgroundLayer.x >= baseWidth*3)) {}
    else if ((direction == 2) && (backgroundLayer.x <=5)){}
    else
    {
      if (direction == 1) { enemyObjs[i].body.x += 2; backgroundLayer.x += 0.09; projectileLayer.x += 0.09; }
      else if (direction == 2) { enemyObjs[i].body.x -= 2; backgroundLayer.x -= 0.09; projectileLayer.x -= 0.09; }
    }
  }
}

function enemyShoot(attackingEnemy)
{
  //TODO
  if ((Math.floor(Math.random()*3)+1) == 1) { //one in 3 shots trigger a voiceline
    sfx["German" + (Math.floor(Math.random()*5)+1)].play(); //make german fella yell a something something
  }

  var shell = projectileLayer.create(attackingEnemy.x, attackingEnemy.y, "EnemyShellSprite");
  shell.scale.setTo(attackingEnemy.scale);
  enemyProj.push(shell);

}

function deleteEnemy(attackingEnemy, i) {
  explosionSound.play();
  enemyObjs.splice(i,1);
  attackingEnemy.destroy();
  enemyScaleMod[i] = 0.001;
  enemyScaleMod.splice(i,1);

  if ((Math.floor(Math.random()*4)+1) == 1) { //one in 3 shots trigger a voiceline
    sfx["NiceShot" + (Math.floor(Math.random()*4)+1)].play(); //make german fella yell a something something
    ultCharge = ultCharge + 12;
    if (ultCharge > 100) {
      ultCharge = 100;
    }
  }
}

function deleteBullet(bulletInst, i) {
  playerProj.splice(i,1);
  bulletInst.destroy();
}

function destroyEnemyBullet(bulletInst, i) {
  enemyProj.splice(i,1);
  bulletInst.destroy();
}

function ultimate() {
  ejectSound.play();
  for (var k = 0; k < enemyObjs.length; k++) {
    deleteEnemy(enemyObjs[k],k);
  }

  ultCharge = 0;
}

function takeDamage(enemyProjInst, i)
{
  hitSound.play();
  enemyProj.splice(i, 1);
  enemyProjInst.destroy();
  playerHealth--;
  canjam.camera.flash(0xff0000, 500);
  if (canjam.playerhealth <= 0) { gameOver(); } //please die
}

function textCreate()
{
  console.log("Text Created");
  scoreText = canjam.add.text(20,20, "Score: 0\nUlt charge: 0%\nHP: 10", style);
  scoreText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
}

function textUpdate()
{
  scoreText.setText("Score: "+ (score * 100) + "\nUlt charge: " + ultCharge + "%\nHP: " + playerHealth);
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

  noInput = false;
  //FADE IN
  canjam.camera.fade(0x000000, 4000);
  canjam.camera.flash(null, 6000, true);
}

function checkGamepad()
{
  canjam.input.gamepad.start();
  pad = canjam.input.gamepad.pad1;
  //pad.addCallbacks(this, { onConnect: addButtons });
  //canjam.input.gamepad.start();
  //pad1 = canjam.input.gamepad.pad1;
}

// function addButtons()
// {

  // buttonDPadLeft.onDown.add(onDown, this, 0);
  // buttonDPadRight.onDown.add(onDown, this, 3);
  //
  // buttonDPadLeft.onUp.add(onUp, this, 0);
  // buttonDPadRight.onUp.add(onUp, this, 3);

  //  We can't do this until we know that the gamepad has been connected and is started
  //
  //     buttonA = pad.getButton(Phaser.Gamepad.XBOX360_A);
  //     buttonB = pad.getButton(Phaser.Gamepad.XBOX360_B);
  //     buttonX = pad.getButton(Phaser.Gamepad.XBOX360_X);
  //     buttonY = pad.getButton(Phaser.Gamepad.XBOX360_Y);
  //
  //     buttonA.onDown.add(onDown, this);
  //     buttonB.onDown.add(onDown, this);
  //     buttonX.onDown.add(onDown, this);
  //     buttonY.onDown.add(onDown, this);
  //
  //     buttonA.onUp.add(onUp, this);
  //     buttonB.onUp.add(onUp, this);
  //     buttonX.onUp.add(onUp, this);
  //     buttonY.onUp.add(onUp, this);
  //
  //     //  These won't work in Firefox, sorry! It uses totally different button mappings
  //
  //     buttonDPadLeft = pad.getButton(Phaser.Gamepad.XBOX360_DPAD_LEFT);
  //     buttonDPadRight = pad.getButton(Phaser.Gamepad.XBOX360_DPAD_RIGHT);
  //     buttonDPadUp = pad.getButton(Phaser.Gamepad.XBOX360_DPAD_UP);
  //     buttonDPadDown = pad.getButton(Phaser.Gamepad.XBOX360_DPAD_DOWN);
  //
  //     buttonDPadLeft.onDown.add(onDown, this);
  //     buttonDPadRight.onDown.add(onDown, this);
  //     buttonDPadUp.onDown.add(onDown, this);
  //     buttonDPadDown.onDown.add(onDown, this);
  //
  //     buttonDPadLeft.onUp.add(onUp, this);
  //     buttonDPadRight.onUp.add(onUp, this);
  //     buttonDPadUp.onUp.add(onUp, this);
  //     buttonDPadDown.onUp.add(onUp, this);
  //
  // }

  // function onDown(button, value, padIndex)
  // {
  //   if (button.buttonCode === Phaser.Gamepad.BUTTON_0) { noInput = false; moveEnemies(1); }
  //       else if (button.buttonCode === Phaser.Gamepad.BUTTON_3) { noInput = false; moveEnemies(2); }
  // }

  // function onDown(button, value) {
  //
  //     if (button.buttonCode === Phaser.Gamepad.XBOX360_A)
  //     {
  //     }
  //     else if (button.buttonCode === Phaser.Gamepad.XBOX360_B)
  //     {
  //     }
  //     else if (button.buttonCode === Phaser.Gamepad.XBOX360_X)
  //     {
  //     }
  //     else if (button.buttonCode === Phaser.Gamepad.XBOX360_Y)
  //     {
  //     }
  //     else if (button.buttonCode === Phaser.Gamepad.XBOX360_DPAD_LEFT)
  //     {
  //     }
  //     else if (button.buttonCode === Phaser.Gamepad.XBOX360_DPAD_RIGHT)
  //     {
  //     }
  //     else if (button.buttonCode === Phaser.Gamepad.XBOX360_DPAD_UP)
  //     {
  //     }
  //     else if (button.buttonCode === Phaser.Gamepad.XBOX360_DPAD_DOWN)
  //     {
  //     }
  //
  // }



  // function onUp(button, value) {
  //
  //     if (button.buttonCode === Phaser.Gamepad.XBOX360_A)
  //     {
  //
  //     }
  //     else if (button.buttonCode === Phaser.Gamepad.XBOX360_B)
  //     {
  //
  //     }
  //     else if (button.buttonCode === Phaser.Gamepad.XBOX360_X)
  //     {
  //     }
  //     else if (button.buttonCode === Phaser.Gamepad.XBOX360_Y)
  //     {
  //     }
  //     else
  //     {
  //     }
  //
  // }

  function gameOver()
  {
    var gameOverText = canjam.add.text((canjam.baseWidth * canjam.scale)/2,(canjam.baseHeight * canjam.scale)/2, ("*Mario wah*\nScore: " + canjam.score), style);
    gameOverText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
  }

  // I don't know, https://github.com/cwleonard/phaser/blob/gamepad/src/input/Gamepad.js lines 594+
  // Phaser.Gamepad.BUTTON_0 = 0;
  // Phaser.Gamepad.BUTTON_1 = 1;
  // Phaser.Gamepad.BUTTON_2 = 2;
  // Phaser.Gamepad.BUTTON_3 = 3;
  // Phaser.Gamepad.BUTTON_14 = 14;
  // Phaser.Gamepad.BUTTON_15 = 15;
