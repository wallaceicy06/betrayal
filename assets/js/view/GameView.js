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

  var _player;
  var _modelAdpt;
  var _playerModelAdpt;

  function initCrafty() {
    Crafty.c('Player', {
      init: function() {
        this.requires('2D, Canvas, Fourway, SpritePlayer, SpriteAnimation')
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

    Crafty.init(_modelAdpt.getGridSpecs().width * TILE_WIDTH,
                _modelAdpt.getGridSpecs().height * TILE_WIDTH,
                document.getElementById('game-stage'));

    Crafty.load(ASSETS, function() {
    });


  }

  function start() {
    Crafty.background('blue');
  }

  function makePlayerView(playerModelAdpt) {
    _playerModelAdpt = playerModelAdpt;

    _player = Crafty.e('Player').attr({x: 20, y: 20})
                                .fourway(_playerModelAdpt.getSpeed());

    return _player;
  }

  return function GameView(modelAdpt) {
    _modelAdpt = modelAdpt;

    document.getElementById('speed-inc').addEventListener('click', function() {
      _playerModelAdpt.onSpeedIncClick();
    });

    document.getElementById('speed-dec').addEventListener('click', function() {
      _playerModelAdpt.onSpeedDecClick();
    });

    initCrafty();

    this.start = start;
    this.makePlayerView = makePlayerView;
  }
});
