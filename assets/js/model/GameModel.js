define([
    'model/Player'
], function(Player) {

  'use strict';

  var DIMENSIONS = {
    width: 768,
    height: 640
  }

  function joinGame(playerName, gameID) {
    var that = this;

    var blueColor = 'blue';

    io.socket.get('/game/' + gameID, function (game) {
      var color;
      switch (game.players.length) {
        case 0:
          color = 'blue';
          break;
        case 1:
          color = 'red';
          break;
        case 2:
          color = 'green';
          break;
        default:
          color = 'green';
      }

      io.socket.post('/player', {name: playerName, game: game.id, room: game.startingRoom, color: color}, function (player) {
        that._player = new Player(player.id, player.name, player.color, player.room.id, {x: 64, y: 64});

        var playerViewAdpt = that._viewAdpt.makePlayerViewAdpt(that._player);
        that._player.installGameModelAdpt({
          onSpeedChange: function(newSpeed) {
            playerViewAdpt.onSpeedChange(newSpeed);
            io.socket.put('/player/adjustStat/' + player.id,
                          {stat: 'speed', newValue: newSpeed},
                          function (player) {});
          },

          onMaxHealthChange: function(newMaxHealth) {
            io.socket.put('/player/adjustStat/' + player.id,
                          {stat: 'maxHealth', newValue: newMaxHealth},
                          function (player) {});
          },

          onCurHealthChange: function(newCurHealth) {
            io.socket.put('/player/adjustStat/' + player.id,
                          {stat: 'curHealth', newValue: newCurHealth},
                          function (player) {});
          },

          onWeaponChange: function(newWeapon) {
            io.socket.put('/player/adjustStat/' + player.id,
                          {stat: 'weapon', nnewValewValue: newWeapon},
                          function (player) {});
          },

          onRelicsChange: function(newRelics) {
            io.socket.put('/player/adjustStat/' + player.id,
                          {stat: 'relics', newValue: newRelics},
                          function (player) {});
          },

          onRoomChange: function(newRoom) {
            /* Do nothing. */
          },

          onPositionChange: function(newX, newY) {
            io.socket.put('/player/' + player.id, {locX: newX, locY: newY}, function (player) {});
          }
        });

        that._currentRoom = player.room;

        fetchRoom.call(that, that._currentRoom, function (room) {
          that._currentRoom = room;
          var doors = {};
          for (var i = 0; i < room.gatewaysOut.length; i++) {
            var gateway = room.gatewaysOut[i];
            doors[gateway.direction] = gateway.roomTo;
          }
          that._viewAdpt.loadRoom({background: room.background, doors: doors, items: room.items});
        });

        /* Populate other players object when join game */
        io.socket.get('/player', function (err, jwr) {
          jwr.body.forEach(function (v, i, a) {
            if (v.id !== that._player.id) {
              var player = new Player(v.id, v.name, v.color, v.room.id, {x: v.locX, y: v.locY})

              var playerViewAdpt = that._viewAdpt.addOtherPlayer(player);
              player.installGameModelAdpt({
                onSpeedChange: function(newSpeed) {
                  playerViewAdpt.onSpeedChange(newSpeed);
                },

                onRoomChange: function(newRoom) {
                  playerViewAdpt.setVisibility(newRoom === that._currentRoom.id);
                },

                onMaxHealthChange: function(newMaxHealth) {
                  playerViewAdpt.onMaxHealthChange(newMaxHealth);
                },

                onCurHealthChange: function(newCurHealth) {
                  playerViewAdpt.onCurHealthChange(newCurHealth);
                },

                onWeaponChange: function(newWeapon) {
                  playerViewAdpt.onWeaponChange(newWeapon);
                },

                onRelicsChange: function(newRelics) {
                  playerViewAdpt.onRelicsChange(newRelics);
                },

                onPositionChange: function(newX, newY) {
                  if (player.room === that._currentRoom.id) {
                    playerViewAdpt.setLocation(newX, newY);
                  }
                }
              });

              that._otherPlayers[v.id] = player;

              playerViewAdpt.setVisibility(player.room === that._currentRoom.id);
            }
          });
        });

      });
    });
  }

  function fetchGames() {
    var that = this;

    io.socket.get('/game', function(games) {
      that._viewAdpt.setGames(games);
    });
  };

  function createGame(name) {
    var that = this;

    io.socket.post('/game', {name: name}, function(game) {
      that.fetchGames();
    });
  }

  function start() {
  }

  function onDoorVisit(doorID) {
    for (var i = 0; i < this._currentRoom.gatewaysOut.length; i++) {
      if (this._currentRoom.gatewaysOut[i].direction === doorID) {
        // get ID of room player is going to
        var id = this._currentRoom.gatewaysOut[i].roomTo;
        break;
      }
    }

    var that = this;

    fetchRoom.call(this, id, function (room) {
      var doors = {};
      for (var i = 0; i < room['gatewaysOut'].length; i++) {
        var gateway = room['gatewaysOut'][i];
        doors[gateway['direction']] = gateway['roomTo'];
      }

      that._currentRoom = room;
      that._player.room = room.id;
      var roomConfig = {background: room.background, doors: doors, items: room.items};

      io.socket.put('/player/changeRoom/' + that._player.id, {room: that._currentRoom.id}, function (player) {
        if (doorID === 'north') {
          that._player.setPosition(that._player.x, DIMENSIONS.height - 65);
        } else if (doorID === 'east') {
          that._player.setPosition(33, that._player.y);
        } else if (doorID === 'south') {
          that._player.setPosition(that._player.x, 33);
        } else if (doorID === 'west') {
          that._player.setPosition(DIMENSIONS.width - 65, that._player.y);
        }

        that._viewAdpt.loadRoom(roomConfig);
      });
    });

  }

  function reloadRoom() {
    var that = this;

    fetchRoom.call(this, this._currentRoom.id, function(room) {
      var doors = {};
      for (var i = 0; i < room['gatewaysOut'].length; i++) {
        var gateway = room['gatewaysOut'][i];
        doors[gateway['direction']] = gateway['roomTo'];
      }

      var roomConfig = {background: room.background, doors: doors, items: room.items};

      that._viewAdpt.loadRoom(roomConfig);
    });
  }

  function assembleMap() {
    var mapConfig = {
      color: 'blue',
      north: null,
      east: null,
      south: {
        color: 'black',
        north: null,
        east: null,
        south: null,
        west: null
      },
      west: null
    }

    this._viewAdpt.loadMap(mapConfig);
  }

  function fetchRoom(roomID, cb) {
    io.socket.get('/room/' + roomID, function (room) {
      cb(room);
    });
  }

  function initSockets() {
    var that = this;

    io.socket.on('player', function(o) {
      if (o.verb === 'created' && o.id !== that._player.id) {
        var player =  new Player(o.id,
                                 o.data.name,
                                 o.data.color,
                                 o.data.room,
                                 {x: o.data.locX, y: o.data.locY});

        var playerViewAdpt = that._viewAdpt.addOtherPlayer(player);
        player.installGameModelAdpt({
          onSpeedChange: function(newSpeed) {
            playerViewAdpt.onSpeedChange(newSpeed);
          },

          onRoomChange: function(newRoom) {
            playerViewAdpt.setVisibility(newRoom === that._currentRoom.id);
          },

          onMaxHealthChange: function(newMaxHealth) {
            playerViewAdpt.onMaxHealthChange(newMaxHealth);
          },

          onCurHealthChange: function(newCurHealth) {
            playerViewAdpt.onCurHealthChange(newCurHealth);
          },

          onWeaponChange: function(newWeapon) {
            playerViewAdpt.onWeaponChange(newWeapon);
          },

          onRelicsChange: function(newRelics) {
            playerViewAdpt.onRelicsChange(newRelics);
          },

          onPositionChange: function(newX, newY) {
            if (player.room === that._currentRoom.id) {
              playerViewAdpt.setLocation(newX, newY);
            }
          }
        });

        that._otherPlayers[o.id] = player;

        playerViewAdpt.setVisibility(player.room === that._currentRoom.id);
      } else if (o.verb === 'updated' && o.id !== that._player.id) {
        if (o.data.locX !== undefined && o.data.locY !== undefined) {
          that._otherPlayers[o.id].x = o.data.locX;
          that._otherPlayers[o.id].y = o.data.locY;
        }
        if (o.data.room !== undefined) {
          that._otherPlayers[o.id].room = o.data.room;
        }
        else {  //stat update
          for (var key in o.data) {
            if (key !== "updatedAt") {
              that._otherPlayers[o.id][key] = o.data[key];
            }
          }
        }
      }
    });

    io.socket.on('room', function(o) {
      if (o.verb === 'addedTo' && o.addedId !== that._player.id && o.id === that._currentRoom.id) {
        /* TODO Not sure if we need this anymore. */
      } else if (o.verb === 'removedFrom' && o.id === that._currentRoom.id) {
        /* TODO Not sure if we need this anymore. */
      } else if (o.verb === 'messaged' && o.data.verb === 'playerUpdated'
                 && o.data.id in that._otherPlayers
                 && o.id === that._currentRoom.id
                 && o.data.id !== that._player.id) {
        that._otherPlayers[o.data.id].setPosition(o.data.data.locX, o.data.data.locY);
      } else if (o.verb === 'messaged' && o.data.verb === 'itemRemoved' && o.id === that._currentRoom.id) {
        that._viewAdpt.removeItem(o.data.id);
      }
    });
  }

  return function GameModel(viewAdpt) {
    this._player = null;
    this._viewAdpt = viewAdpt;
    this._currentRoom = null;
    this._otherPlayers = {};

    initSockets.call(this);

    Object.defineProperty(this, 'dimensions', {
      get: function() {
        return DIMENSIONS;
      }
    });

    this.joinGame = joinGame.bind(this);
    this.fetchGames = fetchGames.bind(this);
    this.createGame = createGame.bind(this);
    this.onDoorVisit = onDoorVisit.bind(this);
    this.reloadRoom = reloadRoom.bind(this);
    this.assembleMap = assembleMap.bind(this);
    this.start = start.bind(this);
  }
});

