var baseWidth = 800;
var baseHeight = 600;
var scale = 3;

WebFontConfig = {

  google: {
    families:["VT323"]
  }
};

var style = {font: "28px VT323", fill: "#fff", tabs: 150};

var cursors;

//Player related
var playerTank;
var playerProj = [];
var playerHealth = 10;
var playerAcceleration = 100;
var playerMaxSpeed = 200;
var playerRotationSpeed = 90;

//Enemy related
var enemyObjs = [];
var enemyScaleMod = 0.01;
var enemyProj = [];
var enemyTank;
var direction = [];

var projectile;
var projSpeed = 500;
var projDelay = 100;
var projNum = 20;

//World related
var worldBounds;
var enemyTankLayer;
var projectileLayer;
var uiLayer;
var wallsLayer;

var backgroundObj;

//Gameplay related
var gameOver;
var score = 0;
var scoreText;

//Shader
var screenFilter;
