var baseWidth = 256;
var baseHeight = 192;
var worldBoundx = 1920;
var worldBoundy = 1200;
var scale = 3;

WebFontConfig = {

  google: {
    families:["VT323"]
  }
};

var style = {font: "14px VT323", fill: "#fff", tabs: 150};

//Gamepad thangs
var pad;
var pad1;
var buttonA;
var buttonB;
var buttonX;
var buttonY;
var buttonDPadLeft;
var buttonDPadRight;
var buttonDPadUp;
var buttonDPadDown;

//Player related
var playerTank;
var playerProj = [];
var playerScaleMod = [];
var playerHealth = 10;
var playerAcceleration = 100;
var playerMaxSpeed = 200;
var playerRotationSpeed = 150;
var playerLastShot = 0;

//Enemy related
var enemyObjs = [];
var enemyScaleMod = [];
var enemyProj = [];
var enemyTank;
var enemyMax = 20;
var enemyMaxScale = 10;

var projectile;
var projSpeed = 500;
var projDelay = 100;
var projNum = 20;

//Generate random number whether to attack or shoot
var attackFlag = false;
var attackRandNum;
//Enemy Attacking
var attackingEnemy;

//World related
var worldBounds;
var enemyTankLayer;
var projectileLayer;
var playerProjectileLayer;
var uiLayer;
var wallsLayer;

var backgroundObj;

var testEnemy;
var eShoot;

//Gameplay related
var gameOver;
var score = 0;
var scoreText;
var noInput = true;
var gameStart = false;

//Shader
var screenFilter;
var glitchFilter;
var spriteScreen;
