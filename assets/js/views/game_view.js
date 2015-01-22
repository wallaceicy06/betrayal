define([
    'crafty'
], function(Crafty) {

  'use strict';

  var TILE_WIDTH = 32;
  var ASSETS = {
    'sprites': {
      'images/game/player.png': {
        'tile': TILE_WIDTH,
        'tileh': TILE_WIDTH,
        'map': {'SpritePlayer': [0, 0]},
      }
    }
  }

  var _model;

  function initCrafty() {
    Crafty.c('Player', {
      init: function() {
        this.requires('2D, Canvas, Fourway, SpritePlayer, SpriteAnimation')
            .fourway(10)
            .reel('PlayerMovingRight',600, 0, 0, 1)
            .reel('PlayerMovingUp',   600, 1, 0, 1)
            .reel('PlayerMovingLeft', 600, 2, 0, 1)
            .reel('PlayerMovingDown', 600, 3, 0, 1);

        this.bind('NewDirection', function(data) {
          if (data.x > 0) {
            this.animate('PlayerMovingRight', -1);
          } else if (data.x < 0) {
            this.animate('PlayerMovingLeft', -1);
          } else if (data.y > 0) {
            this.animate('PlayerMovingDown', -1);
          } else if (data.y < 0) {
            this.animate('PlayerMovingUp', -1);
          } else {
            this.pauseAnimation();
          }

        });
      }
    });

    Crafty.init(_model.getGridSpecs().width * TILE_WIDTH,
                _model.getGridSpecs().height * TILE_WIDTH,
                document.getElementById('game-stage'));

    Crafty.load(ASSETS, function() {
      Crafty.e('Player').attr({x: 20, y: 20});
    });


  }

  function start() {
    Crafty.background('blue');
  }

  return function GameView(model) {
    _model = model;

    initCrafty();

    this.start = start;
  }
});
