define([
    'jquery',
    'crafty'
], function($, Crafty) {

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
      },
      'images/game/lightning_bolt.png': {
        'tile': TILE_WIDTH,
        'tileh': TILE_WIDTH,
        'map': {'SpriteSpeedInc': [0,0]}
      }
    }
  }

  var _player;
  var _gameModelAdpt;
  var _playerModelAdpt;
  var _husks = {};

  var _items = {};

  function initCrafty() {
    Crafty.c('PlayerHusk', {
      init: function() {
        this.requires('2D, Canvas, SpritePlayer, SpriteAnimation');

        this.reel('PlayerMovingRight',600, 0, 0, 1);
        this.reel('PlayerMovingUp',   600, 1, 0, 1);
        this.reel('PlayerMovingLeft', 600, 2, 0, 1);
        this.reel('PlayerMovingDown', 600, 3, 0, 1);
      }
    });

    Crafty.c('Player', {
      init: function() {
        this.requires('PlayerHusk, Fourway, Collision');

        this.fourway(_playerModelAdpt.getSpeed());

        this.onHit('Solid', this.stopMovement);
        this.onHit('Door', this.useDoor);
        this.onHit('Item', this.pickUpItem);

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
      },

      pickUpItem: function(item) {
        switch(item[0].obj.type) {
          case "speedInc":
            _playerModelAdpt.onSpeedIncClick();

            /* Increase absolute value of movement in both x and y by 1
               because releasing a key decreases movement by speed, and
               we are increasing speed. Prevents weird gravity. */
            if(this._movement.x > 0) {
              this._movement.x = this._movement.x + 1;
            }
            if(this._movement.x < 0) {
              this._movement.x = this._movement.x - 1;
            }
            if(this._movement.y > 0) {
              this._movement.y = this._movement.y + 1;
            }
            if(this._movement.y < 0) {
              this._movement.y = this._movement.y - 1;
            }
            break;
        }
        _items[item[0].obj.itemID].destroy();
        delete _items[item[0].obj.itemID];
      }

    });

    Crafty.c('Item', {
      init: function() {
        this.requires('2D, Canvas, RoomItem');
      }
    });

    Crafty.c('SpeedInc', {
      init: function() {
        this.requires('Item, SpriteSpeedInc');
      }
    })

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
    placeItems(roomConfig.items);

    /* Sets the player location and re-allows door usage. */
    _player.attr({x: _playerModelAdpt.getX(),
                  y: _playerModelAdpt.getY(),
                  doorLock: false});

    /* Enable player control once through door */
    _player.enableControl();
  }

  function placeItems(items) {
    for (var i = 0; i < items.length; i++) {
      var item = Crafty.e('SpeedInc').attr({x: items[i].x, y: items[y].y, type: items[i].type, itemID: items[i].id});
      _items[items[i].id] = item;
    }
  }

  function makePlayerView(playerModelAdpt) {
    _playerModelAdpt = playerModelAdpt;

    _player = Crafty.e('Player');

    return _player;
  }

  function addPlayerToList(name) {
    var playerList = document.getElementById('player-list');

    var li = document.createElement('li');
    li.appendChild(document.createTextNode(name));
    playerList.appendChild(li);
  }

  function makePlayerHusk(id, x, y) {
    _husks[id] = Crafty.e('PlayerHusk').attr({x: x, y: y});
  }

  function removeAllHusks() {
    for (var key in _husks) {
      _husks[key].destroy(); // destroy Crafty entity
    }
    _husks = {};
  }

  function removeHusk(id) {
    _husks[id].destroy();
    delete _husks[id];
  }

  function moveHusk(id, x, y) {
    _husks[id].attr({x: x, y: y});
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

      if (name.value.length === 0) {
        alert('Please enter a non-empty name.');
        return
      }

      _gameModelAdpt.onJoinClick(name.value, select[select.selectedIndex].value);
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

    this.addPlayerToList = addPlayerToList;
    this.loadRoom = loadRoom;
    this.makePlayerView = makePlayerView;
    this.makePlayerHusk = makePlayerHusk;
    this.moveHusk = moveHusk;
    this.removeAllHusks = removeAllHusks;
    this.removeHusk = removeHusk;
    this.setGameOptions = setGameOptions;
    this.start = start;
  }
});
