'use strict';

var GameScene = require('./play_game.js');
var MenuScene = require('./menu.js');


var BootScene = {
  preload: function () {
    // load here assets required for the loading screen
    this.game.load.baseURL = 'https://aramissss.github.io/PVLICirujanosDe5/plantilla-juego/src/';
    this.game.load.crossOrigin = 'anonymous';
    this.game.load.image('preloader_bar', 'images/preloader_bar.png');
    this.game.load.image('menuButton','images/MenuButton.png');
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
    this.load.image('menuButton','images/MenuButton.png');
  },

  create: function () {
    this.game.state.start('menu');
  }
};


window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('playGame', GameScene);
  game.state.add('menu', MenuScene)

  game.state.start('boot');
};
