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
      },
      'images/game/wall.png': {
        'tile': TILE_WIDTH,
        'tileh': TILE_WIDTH,
        'map': {'SpriteWall': [0, 0]}
      }
    }
  }

  var _player;
  var _modelAdpt;
  var _playerModelAdpt;

  function initCrafty() {
    Crafty.c('Player', {
      init: function() {
        this.requires('2D, Canvas, Fourway, Collision, SpritePlayer, SpriteAnimation')
            .fourway(_playerModelAdpt.getSpeed())
            .reel('PlayerMovingRight',600, 0, 0, 1)
            .reel('PlayerMovingUp',   600, 1, 0, 1)
            .reel('PlayerMovingLeft', 600, 2, 0, 1)
            .reel('PlayerMovingDown', 600, 3, 0, 1)
            .onHit('Solid', this.stopMovement);

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
      },

      stopMovement: function() {
        if (this._movement) {
          this.x -= this._movement.x;
          this.y -= this._movement.y;
        }
      }

    });

    Crafty.c('Wall', {
      init: function() {
        this.requires('2D, Canvas, Solid, SpriteWall');
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

    setupBarriers();
  }

  function makePlayerView(playerModelAdpt) {
    _playerModelAdpt = playerModelAdpt;

    _player = Crafty.e('Player').attr({x: TILE_WIDTH * 2, y: TILE_WIDTH * 2});
                                // .fourway(_playerModelAdpt.getSpeed());

    return _player;
  }

  function setupBarriers() {
    for (var j = 0; j < _modelAdpt.getGridSpecs().width; j++) {
      Crafty.e('Wall').attr({x: j * TILE_WIDTH, y: 0});
      Crafty.e('Wall').attr({x: j * TILE_WIDTH, y: (_modelAdpt.getGridSpecs().height - 1) * TILE_WIDTH});
    }

    for (var i = 0; i < _modelAdpt.getGridSpecs().height; i++) {
      Crafty.e('Wall').attr({x: 0, y: i * TILE_WIDTH});
      Crafty.e('Wall').attr({x: (_modelAdpt.getGridSpecs().width - 1) * TILE_WIDTH, y: i * TILE_WIDTH});
    }

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
