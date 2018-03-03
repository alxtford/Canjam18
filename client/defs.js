var baseWidth = 800;
var baseHeight = 600;
var scale = 1;

//Player related
var playerTank;
var playerProj = [];
var playerHealth = 10;
var playerAcceleration = 100;
var playerMaxSpeed = 200;
var playerRotationSpeed = 90;

//Enemy related
var enemyObjs = [];
var enemyProj = [];
var enemyTank;

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
var backgroundLayer;

//Gameplay related
var gameOver;
var score;
