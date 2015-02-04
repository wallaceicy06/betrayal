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
      },
      'images/game/door.png': {
      'tile': TILE_WIDTH,
      'tileh': TILE_WIDTH,
      'map': {'SpriteDoor': [0,0]}
      }
    }
  }

  var _player;
  var _gameModelAdpt;
  var _playerModelAdpt;

  function initCrafty() {
    Crafty.c('Player', {
      init: function() {
        this.requires('2D, Canvas, Fourway, Collision, SpritePlayer, SpriteAnimation');

        this.fourway(_playerModelAdpt.getSpeed());

        this.reel('PlayerMovingRight',600, 0, 0, 1);
        this.reel('PlayerMovingUp',   600, 1, 0, 1);
        this.reel('PlayerMovingLeft', 600, 2, 0, 1);
        this.reel('PlayerMovingDown', 600, 3, 0, 1);

        this.onHit('Solid', this.stopMovement);
        this.onHit('Door', this.useDoor);

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

        this.bind('Moved', function(oldPosition) {
          _playerModelAdpt.setPosition(this.x, this.y);
        });
      },

      stopMovement: function() {
        if (this._movement) {
          this.x -= this._movement.x;
          this.y -= this._movement.y;
        }
      },

      useDoor: function(doorParts) {
        /*
         * If the door lock has been enabled, this will prevent a door from
         * being used twice for the same room.
         */
        if (this.attr('doorLock')) {
          console.log('the lock prevented a double move');
          return;
        }

        _gameModelAdpt.onDoorVisit(doorParts[0].obj.doorID);

        /* Lock the door to prevent double usages. */
        this.attr({'doorLock': true});

        /* Player cannot move as they go through a door */
        this.disableControl();
      }

    });

    Crafty.c('Wall', {
      init: function() {
        this.requires('2D, Canvas, Solid, SpriteWall, RoomItem');
      }
    });

    Crafty.c('Door', {
      init: function() {
        this.requires('2D, Canvas, SpriteDoor, RoomItem');
      }
    });

    Crafty.init(_gameModelAdpt.getDimensions().width,
                _gameModelAdpt.getDimensions().height,
                document.getElementById('game-stage'));

    Crafty.load(ASSETS, function() {
    });

  }

  function start() {
    _gameModelAdpt.fetchGames();
  }

  function loadRoom(roomConfig) {
    Crafty('RoomItem').each(function() { this.destroy(); });
    Crafty.background(roomConfig.background);
    setupBarriers(roomConfig.doors);

    /* Sets the player location and re-allows door usage. */
    _player.attr({x: _playerModelAdpt.getX(),
                  y: _playerModelAdpt.getY(),
                  doorLock: false});

    /* Enable player control once through door */
    _player.enableControl();
  }

  function makePlayerView(playerModelAdpt) {
    _playerModelAdpt = playerModelAdpt;

    _player = Crafty.e('Player');

    return _player;
  }

  function setGameOptions(games) {
    var gameOptions = document.getElementById('select-game');

    /* Clear the game options combo box. */
    gameOptions.length = 0;

    games.forEach(function(v, i, a) {
      gameOptions.options.add(new Option(v.name, v.id));
    });
  }

  function setupBarriers(gateways) {
    var widthInTiles = _gameModelAdpt.getDimensions().width/TILE_WIDTH;
    var heightInTiles = _gameModelAdpt.getDimensions().height/TILE_WIDTH;

    for (var j = 0; j < widthInTiles; j++) {
      if(!('north' in gateways && (j == widthInTiles/2 || j == widthInTiles/2-1))) {
        Crafty.e('Wall').attr({x: j * TILE_WIDTH, y: 0});
      }
      else {
        Crafty.e('Door').attr({x: j * TILE_WIDTH, y: 0, doorID: 'north'});
      }
      if(!('south' in gateways && (j == widthInTiles/2 || j == widthInTiles/2-1))) {
        Crafty.e('Wall').attr({x: j * TILE_WIDTH, y: (heightInTiles - 1) * TILE_WIDTH});
      }
      else {
        Crafty.e('Door').attr({x: j * TILE_WIDTH, y: (heightInTiles - 1) * TILE_WIDTH, doorID: 'south'});
      }
    }

    for (var i = 0; i < heightInTiles; i++) {
      if(!('west' in gateways && (i == heightInTiles/2 || i == heightInTiles/2-1))) {
        Crafty.e('Wall').attr({x: 0, y: i * TILE_WIDTH});
      }
      else {
        Crafty.e('Door').attr({x: 0, y: i * TILE_WIDTH, doorID: 'west'});
      }
      if(!('east' in gateways && (i == heightInTiles/2 || i == heightInTiles/2-1))) {
        Crafty.e('Wall').attr({x: (widthInTiles - 1) * TILE_WIDTH, y: i * TILE_WIDTH});
      }
      else {
        Crafty.e('Door').attr({x: (widthInTiles - 1) * TILE_WIDTH, y: i * TILE_WIDTH, doorID: 'east'});
      }
    }

  }

  return function GameView(gameModelAdpt) {
    _gameModelAdpt = gameModelAdpt;

    document.getElementById('btn-join').addEventListener('click', function() {
      var select = document.getElementById('select-game');
      var name = document.getElementById('ipt-name');

      _gameModelAdpt.onJoinClick(name, select[select.selectedIndex].value);
    });

    document.getElementById('btn-create-game').addEventListener('click', function() {
      _gameModelAdpt.onCreateGameClick(document.getElementById('ipt-game-name').value);
    });

    document.getElementById('btn-speed-inc').addEventListener('click', function() {
      _playerModelAdpt.onSpeedIncClick();
    });

    document.getElementById('btn-speed-dec').addEventListener('click', function() {
      _playerModelAdpt.onSpeedDecClick();
    });

    initCrafty();

    this.loadRoom = loadRoom;
    this.setGameOptions = setGameOptions;
    this.start = start;
    this.makePlayerView = makePlayerView;
  }
});
