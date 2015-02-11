define([
    'jquery',
    'crafty'
], function($, Crafty) {

  'use strict';

  var TILE_WIDTH = 32;
  var ASSETS = {
    'sprites': {
      'images/game/players.png': {
        'tile': TILE_WIDTH,
        'tileh': TILE_WIDTH,
        'map': {'SpritePlayerRed': [0, 0],
                'SpritePlayerBlue': [0, 1],
                'SpritePlayerGreen': [0, 2]},
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
  var COLOR_TO_ROW = {
    'red' : 0,
    'blue' : 1,
    'green' : 2
  };

  function initCrafty() {
    var that = this;

    Crafty.c('PlayerHusk', {
      init: function() {
        this.requires('2D, Canvas, SpritePlayerRed, SpriteAnimation');

        this.reel('PlayerMovingRight',600, 0, 0, 1);
        this.reel('PlayerMovingUp',   600, 1, 0, 1);
        this.reel('PlayerMovingLeft', 600, 2, 0, 1);
        this.reel('PlayerMovingDown', 600, 3, 0, 1);
      },

      setColor: function(colorString) {
        console.log("Changing player color to " + colorString);
        var row = COLOR_TO_ROW[colorString];
        this.sprite(0, row, 1, 1);
        this.reel('PlayerMovingRight',600, 0, row, 1);
        this.reel('PlayerMovingUp',   600, 1, row, 1);
        this.reel('PlayerMovingLeft', 600, 2, row, 1);
        this.reel('PlayerMovingDown', 600, 3, row, 1);
      }

    });

    Crafty.c('Player', {
      init: function() {
        this.requires('PlayerHusk, Fourway, Collision');

        this.fourway(that._playerModelAdpt.getSpeed());

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
          that._playerModelAdpt.setPosition(this.x, this.y);
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

        that._gameModelAdpt.onDoorVisit(doorParts[0].obj.doorID);

        /* Lock the door to prevent double usages. */
        this.attr({'doorLock': true});

        /* Player cannot move as they go through a door */
        this.disableControl();
      },

      pickUpItem: function(item) {
        if (this.attr('itemLock')) {
          return;
        }
        this.attr({'itemLock' : true});
        var thisPlayer = this;
        switch(item[0].obj.type) {
          case "SpeedInc":
            var increaseBy = item[0].obj.amount;

            that._playerModelAdpt.onSpeedIncClick(increaseBy);

            /* Increase absolute value of movement in both x and y by 1
               because releasing a key decreases movement by speed, and
               we are increasing speed. Prevents weird gravity. */
            if(this._movement.x > 0) {
              this._movement.x = this._movement.x + increaseBy;
            }
            if(this._movement.x < 0) {
              this._movement.x = this._movement.x - increaseBy;
            }
            if(this._movement.y > 0) {
              this._movement.y = this._movement.y + increaseBy;
            }
            if(this._movement.y < 0) {
              this._movement.y = this._movement.y - increaseBy;
            }
            break;
          default:
            that._playerModelAdpt.useItem(item[0].obj.stat, item[0].obj.amount);
        }
        io.socket.delete('/item/' + item[0].obj.itemID, {}, function(data) {
          thisPlayer.attr({'itemLock': false});
        });
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

    Crafty.init(that._gameModelAdpt.getDimensions().width,
                that._gameModelAdpt.getDimensions().height,
                document.getElementById('game-stage'));

    Crafty.load(ASSETS, function() {
    });

  }

  function start() {
    this._gameModelAdpt.fetchGames();
  }

  function loadRoom(roomConfig) {
    removeAllHusks.call(this);

    Crafty('RoomItem').each(function() { this.destroy(); });

    Crafty.background(roomConfig.background);

    setupBarriers.call(this, roomConfig.doors);
    placeItems.call(this, roomConfig.items);

    /* Sets the player location and re-allows door usage. */
    this._player.attr({x: this._playerModelAdpt.getX(),
                       y: this._playerModelAdpt.getY(),
                       doorLock: false});

    for (var id in this._otherPlayerModelAdpts) {
      var otherPlayer = this._otherPlayerModelAdpts[id];
      if (otherPlayer.getRoom() == this._playerModelAdpt.getRoom()) {
        makePlayerHusk.call(this, otherPlayer.getID(),
                            otherPlayer.getX(), otherPlayer.getY(), otherPlayer.getColor());

      }
    }

    /* Enable player control once through door */
    this._player.enableControl();
  }

  function placeItems(items) {
    for (var i = 0; i < items.length; i++) {
      var item = Crafty.e(items[i].type).attr({x: items[i].x, y: items[i].y, type: items[i].type, stat: items[i].stat, amount: items[i].amount, itemID: items[i].id});
      this._items[items[i].id] = item;
    }
  }

  function makePlayerView(playerModelAdpt) {
    this._playerModelAdpt = playerModelAdpt;

    this._player = Crafty.e('Player');
    this._player.setColor(this._playerModelAdpt.getColor());

    return this._player;
  }

  function addPlayerToList(name) {
    var playerList = document.getElementById('player-list');

    var li = document.createElement('li');
    li.appendChild(document.createTextNode(name));
    playerList.appendChild(li);
  }

  function makePlayerHusk(id, x, y, color) {
     var husk = Crafty.e('PlayerHusk').attr({x: x, y: y});
     husk.setColor(color);
     this._husks[id] = husk;
   }

  function addOtherPlayer(playerModelAdpt) {
    var that = this;

    this._otherPlayerModelAdpts[playerModelAdpt.getID()] = playerModelAdpt;

    var playerList = document.getElementById('player-list');

    var li = document.createElement('li');
    li.appendChild(document.createTextNode(playerModelAdpt.getName()));
    playerList.appendChild(li);

    return {
      setLocation: function(newX, newY) {
        that._husks[playerModelAdpt.getID()].attr({x: newX, y: newY});
      },

      setVisibility: function(visible) {
        if (visible === true) {
          makePlayerHusk.call(that, playerModelAdpt.getID(),
                              playerModelAdpt.getX(), playerModelAdpt.getY(), playerModelAdpt.getColor());
        } else {
          removeHusk.call(that, playerModelAdpt.getID());
        }
      }
    }
  }

  function removeAllHusks() {
    for (var key in this._husks) {
      this._husks[key].destroy(); // destroy Crafty entity
    }
    this._husks = {};
  }

  function removeHusk(id) {
    if (this._husks[id] !== undefined) {
      this._husks[id].destroy();
      delete this._husks[id];
    }
  }

  function removeItem(id) {
    if(id in this._items) {
      this._items[id].destroy();
      delete this._items[id];
    }
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
    var widthInTiles = this._gameModelAdpt.getDimensions().width/TILE_WIDTH;
    var heightInTiles = this._gameModelAdpt.getDimensions().height/TILE_WIDTH;

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

  function initGUI() {
    var that = this;

    document.getElementById('btn-join').addEventListener('click', function() {
      var select = document.getElementById('select-game');
      var name = document.getElementById('ipt-name');

      if (name.value.length === 0) {
        alert('Please enter a non-empty name.');
        return
      }

      that._gameModelAdpt.onJoinClick(name.value, select[select.selectedIndex].value);
    });

    document.getElementById('btn-create-game').addEventListener('click', function() {
      that._gameModelAdpt.onCreateGameClick(document.getElementById('ipt-game-name').value);
    });

    document.getElementById('btn-speed-inc').addEventListener('click', function() {
      that._playerModelAdpt.onSpeedIncClick(1);
    });

    document.getElementById('btn-speed-dec').addEventListener('click', function() {
      that._playerModelAdpt.onSpeedDecClick();
    });
  }

  return function GameView(gameModelAdpt) {
    this._gameModelAdpt = gameModelAdpt;
    this._player = null;
    this._playerModelAdpt = null;
    this._otherPlayerModelAdpts = {};
    this._husks = {};
    this._items = {};

    initGUI.call(this);
    initCrafty.call(this);

    this.addOtherPlayer = addOtherPlayer.bind(this);
    this.loadRoom = loadRoom.bind(this);
    this.makePlayerView = makePlayerView.bind(this);
    this.removeAllHusks = removeAllHusks.bind(this);
    this.removeItem = removeItem.bind(this);
    this.setGameOptions = setGameOptions.bind(this);
    this.start = start.bind(this);
  }
});
