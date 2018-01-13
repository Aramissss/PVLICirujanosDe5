'use strict';

var GameScene1 = require('./game1.js');
var GameScene2 = require('./game2.js');
var MenuScene = require('./menu.js');
var OptionsScene1 = require('./options1.js');
var OptionsScene2 = require('./options2.js');


var BootScene = {
  preload: function () {
    // load here assets required for the loading screen
    this.game.load.image('preloader_bar', 'images/preloader_bar.png');
  },

  create: function () {
    this.game.state.start('preloader');
  }
};


var PreloaderScene = {
  preload: function () {
    this.loadingBar = this.game.add.sprite(0, 240, 'preloader_bar');
    this.loadingBar.anchor.setTo(0, 0.5);
    this.load.setPreloadSprite(this.loadingBar);

    // TODO: load here the assets for the game
    this.load.image('menuButton','images/menuButton.png');
    this.load.image('blue', 'images/blue.png');
    this.load.image('yellow', 'images/yellow.png');
    this.load.image('red', 'images/red.png');
    this.load.image('bluePill', 'images/bluePill.png');
    this.load.image('yellowPill', 'images/yellowPill.png');
    this.load.image('redPill', 'images/redPill.png');
    this.load.spritesheet('blueVirus', 'images/blueVirus.png',16,16,2);
    this.load.spritesheet('DrMariano', 'images/DrMariano.png',80,80,3);
    this.load.spritesheet('yellowVirus', 'images/yellowVirus.png',16,16,2);
    this.load.spritesheet('redVirus', 'images/redVirus.png',16,16,2);
    this.load.spritesheet('redExplosion', 'images/redExplosion.png',16,16,4);
    this.load.spritesheet('blueExplosion', 'images/blueExplosion.png',16,16,4);
    this.load.spritesheet('yellowExplosion', 'images/yellowExplosion.png',16,16,4);
    this.load.image('scoreWindow', 'images/scoreWindow.png');
    this.load.image('scoreWindow2', 'images/scoreWindow2.png');
    this.load.image('scoreFrame','images/scoreFrame.png');
    this.load.image('crown','images/Crown.png');
    this.load.image('levelFrame', 'images/levelFrame.png');
    this.load.image('DrMarianoTitle','images/DrMarianoTitle.png');
    this.load.image('DrMarianoMainTitle','images/DrMarianoMainTitle.png');
    this.load.image('glass', 'images/glass.png');
    this.load.image('background1', 'images/background.png');
    this.load.image('background2', 'images/background2.png');
    this.load.image('background3', 'images/background3.png');
    this.load.image('heartIcon', 'images/heartIcon.png');
    this.load.image('playerSelection', 'images/playerSelection.png');
    this.load.image('heartIcon', 'images/heartIcon.png');
    this.load.image('arrowIcon', 'images/arrowIcon.png');
    this.load.image('optionsWindow', 'images/optionsWindow.png');
    this.load.image('levelMeter', 'images/levelMeter.png');
    this.load.image('advertWindow','images/advertWindow.png');
    this.load.bitmapFont('pixel', 'fonts/pixel.png', 'fonts/pixel.fnt');
  },

  create: function () {
    this.game.state.start('menu');
  }
};


window.onload = function () {
  var game = new Phaser.Game(600, 500, Phaser.AUTO, 'game');

  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('1pGame', GameScene1);
  game.state.add('2pGame', GameScene2);
  game.state.add('menu', MenuScene);
  game.state.add('options1', OptionsScene1);
  game.state.add('options2', OptionsScene2);
  game.state.start('boot');
};
