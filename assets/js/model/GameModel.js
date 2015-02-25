define([
    'model/Player',
    'model/MapNode'
], function(Player, MapNode) {

  'use strict';

  var DIMENSIONS = {
    width: 576,
    height: 512
  }

  var ATTACK_RADIUS = 64;
  var MIN_SEND_WAIT = 20;

  function joinGame(playerName, gameID) {
    var that = this;

    var blueColor = 'blue';

    io.socket.get('/game/' + gameID, function (game) {
      that._events = game.events;
      that._viewAdpt.installSpriteMap(game.sprites);

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
        that._player = new Player(player.id, player.name, player.color, player.room, {x: 64, y: 64});

        var roomID = player.room;

        var playerViewAdpt = that._viewAdpt.makePlayerViewAdpt(that._player);
        that._player.installGameModelAdpt({
          onSpeedChange: function(newSpeed, oldSpeed) {
            playerViewAdpt.onSpeedChange(newSpeed, oldSpeed);
            io.socket.put('/player/adjustStat/' + player.id,
                          {stat: 'speed', newValue: newSpeed},
                          function (player) {});
          },

          onMaxHealthChange: function(newMaxHealth) {
            playerViewAdpt.onMaxHealthChange(newMaxHealth);
            io.socket.put('/player/adjustStat/' + player.id,
                          {stat: 'maxHealth', newValue: newMaxHealth},
                          function (player) {});
          },

          onCurHealthChange: function(newCurHealth) {
            if (newCurHealth < 1) {
              that._viewAdpt.notifyDead();
              io.socket.delete('/player/' + player.id, {}, function(data) {});
            }
            else {
              playerViewAdpt.onCurHealthChange(newCurHealth);
              io.socket.put('/player/adjustStat/' + player.id,
                            {stat: 'curHealth', newValue: newCurHealth},
                            function (player) {});
            }
          },

          onWeaponChange: function(newWeapon) {
            playerViewAdpt.onWeaponChange(newWeapon);
            io.socket.put('/player/adjustStat/' + player.id,
                          {stat: 'weapon', newValue: newWeapon},
                          function (player) {});
          },

          onRelicsChange: function(newRelics) {
            playerViewAdpt.onRelicsChange(newRelics);
            io.socket.put('/player/adjustStat/' + player.id,
                          {stat: 'relics', newValue: newRelics},
                          function (player) {});
          },

          onRoomChange: function(newRoom) {
            /* Do nothing. */
          },

          onDestroy: function() {
            /* Do nothing. */
          },

          onPositionChange: function(newX, newY) {
            var curTime = new Date().getTime();
            if (curTime - that._lastSend > MIN_SEND_WAIT) {
              io.socket.put('/player/' + player.id, {locX: newX, locY: newY}, function (player) {});
              that._lastSend = curTime;
            }
          }
        });

        fetchRoom.call(that, roomID, function (room) {
          that._currentRoom = room;
          that._miniMap = new MapNode(room.id, room.name);
          that._currentMiniRoom = that._miniMap;

          var roomConfig = prepareRoomConfig.call(that, room);

          that._viewAdpt.startGame(roomConfig);
        });

        /* Populate other players object when join game */
        game.players.forEach(function(v, i, a) {
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
            },

            onDestroy: function() {
              playerViewAdpt.destroy();
              delete that._otherPlayers[v.id];
            }
          });

          that._otherPlayers[v.id] = player;

          playerViewAdpt.setVisibility(player.room === that._currentRoom.id);
        });

        that._gameID = parseInt(gameID);
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
        /* get ID of room player is going to */
        var id = this._currentRoom.gatewaysOut[i].roomTo;
        break;
      }
    }

    var that = this;

    fetchRoom.call(this, id, function (room) {
      that._currentRoom = room;
      that._player.room = room.id;

      var roomConfig = prepareRoomConfig.call(that, room);

      var newMiniRoom = new MapNode(room.id, room.name);

      io.socket.put('/player/changeRoom/' + that._player.id, {room: that._currentRoom.id}, function (player) {
        /*
         * Set the position of the player in the new room and add that room
         * as a connection to our mini map.
         */
        if (doorID === 'north') {
          that._player.setPosition(that._player.x, DIMENSIONS.height - 65);
          that._currentMiniRoom.setGateway('north', newMiniRoom);
        } else if (doorID === 'east') {
          that._player.setPosition(33, that._player.y);
          that._currentMiniRoom.setGateway('east', newMiniRoom);
        } else if (doorID === 'south') {
          that._player.setPosition(that._player.x, 33);
          that._currentMiniRoom.setGateway('south', newMiniRoom);
        } else if (doorID === 'west') {
          that._player.setPosition(DIMENSIONS.width - 65, that._player.y);
          that._currentMiniRoom.setGateway('west', newMiniRoom);
        }

        /* Set the current mini room to the one we just moved to. */
        that._currentMiniRoom = newMiniRoom;

        that._viewAdpt.loadRoom(roomConfig);
      });
    });

  }

  function reloadRoom() {
    var that = this;

    fetchRoom.call(this, this._currentRoom.id, function(room) {
      var roomConfig = prepareRoomConfig.call(that, room);

      that._viewAdpt.loadRoom(roomConfig);
    });
  }

  function prepareRoomConfig(room) {
    var doors = {};
    for (var i = 0; i < room.gatewaysOut.length; i++) {
      var gateway = room.gatewaysOut[i];
      doors[gateway.direction] = gateway.roomTo;
    }

    return {background: room.background,
            doors: doors,
            items: room.items,
            furniture: room.objects,
            event: room.event};
  }

  function assembleMap() {
    this._viewAdpt.loadMap(this._miniMap);
  }

  function fetchRoom(roomID, cb) {
    io.socket.get('/room/' + roomID, function (room) {
      cb(room);
    });
  }

  function sendChatMessage(message) {
    io.socket.put('/game/sendChatMessage/' + this._gameID, {message: message, playerID: this._player.id}, function (resData, jwr){});
  }

  function sendEventMessage(message) {
    io.socket.put('/game/sendChatMessage/' + this._gameID, {message: message, playerID: undefined}, function (resData, jwr){});
  }

  /*
   * Performs the given event, altering player stats as necessary.
   * Returns the title and text of the event to be displayed.
   */
  function performEvent(eventID) {
    io.socket.put('/room/removeEvent/' + this._currentRoom.id, {}, function(resData, jwr){});
    var event = this._events[eventID];
    for (var stat in event.effect) {  //For right now, event effects only alter stats
      this._player[stat] = this._player[stat] + event.effect[stat];
    }
    return {title: event.title, text: event.text};
  }

  /* This player deals damage to all other players within a certain radius */
  function attack() {
    for (var id in this._otherPlayers) {
      var otherPlayer = this._otherPlayers[id];
      if (otherPlayer.room === this._player.room
        && otherPlayer.x < this._player.x + ATTACK_RADIUS + 32
        && otherPlayer.x > this._player.x - ATTACK_RADIUS
        && otherPlayer.y < this._player.y + ATTACK_RADIUS + 32
        && otherPlayer.y > this._player.y - ATTACK_RADIUS) {
        /* Roll dice for combat based on weapon strength - same as board game */
        var playerDamaged;
        var damage;
        var myRoll = 0;
        for (var i = 0; i < this._player.weapon; i++) {
          myRoll += Math.floor(Math.random() * 2);
        }
        var otherRoll = 0;
        for (var i = 0; i < otherPlayer.weapon; i++) {
          otherRoll += Math.floor(Math.random() * 2);
        }
        if (myRoll > otherRoll) {
          playerDamaged = otherPlayer;
          damage = myRoll - otherRoll;
        }
        else if (myRoll < otherRoll) {
          playerDamaged = this._player;
          damage = otherRoll - myRoll;
        }
        if (playerDamaged == undefined) {
          this.sendEventMessage(this._player.name + " attacked " +
            otherPlayer.name + "! No one was hurt.");
        }
        else {
          playerDamaged.curHealth -= damage;
          this.sendEventMessage(this._player.name + " attacked " +
            otherPlayer.name + "! " + playerDamaged.name + " took " + damage
            + " damage.");
          io.socket.put('/player/adjustStat/' + id,
                        {stat: 'curHealth', newValue: otherPlayer.curHealth},
                        function (player) {});
        }
      }
    }
  }

  function initSockets() {
    var that = this;

    io.socket.on('player', function(o) {
      if (o.verb === 'created' && o.data.game === that._gameID
          && o.id !== that._player.id) {
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
          },

          onDestroy: function() {
            playerViewAdpt.destroy();
            delete that._otherPlayers[v.id];
          }
        });

        that._otherPlayers[o.id] = player;

        playerViewAdpt.setVisibility(player.room === that._currentRoom.id);
      } else if (o.verb === 'updated') {
        if (o.data.locX !== undefined
          && o.data.locY !== undefined
          && o.id !== that._player.id) {
          that._otherPlayers[o.id].x = o.data.locX;
          that._otherPlayers[o.id].y = o.data.locY;
        }
        /* Temporary bug fix? */
        if (o.data.room !== undefined) {
          if (o.data.room !== null && o.id !== that._player.id) {
            that._otherPlayers[o.id].room = o.data.room;
          }
        /* Stat update */
        } else {
          if (o.id !== that._player.id) {
            for (var key in o.data) {
              if (key !== "updatedAt") { //TODO: make this less jank
                that._otherPlayers[o.id][key] = o.data[key];
              }
            }
          }
          else {
            for (var key in o.data) {
              if (key !== 'updatedAt') {
                that._player[key] = o.data[key];
              }
            }
          }
        }
      } else if (o.verb === 'destroyed') {
          that._otherPlayers[o.id].destroy();
      }
    });

    io.socket.on('room', function(o) {
      if (o.verb === 'messaged' && o.data.verb === 'playerUpdated'
          && o.data.id in that._otherPlayers
          && o.id === that._currentRoom.id
          && o.data.id !== that._player.id) {

        that._otherPlayers[o.data.id].setPosition(o.data.data.locX,
                                                  o.data.data.locY);

      } else if (o.verb === 'messaged' && o.data.verb === 'itemRemoved'
                 && o.id === that._currentRoom.id) {

        that._viewAdpt.removeItem(o.data.id);

      }
    });

    io.socket.on('game', function(o) {
      if (o.verb === 'messaged') {
        that._viewAdpt.messageReceived(o.data.playerID, o.data.message);
      }
    });
  }

  return function GameModel(viewAdpt) {
    this._player = null;
    this._viewAdpt = viewAdpt;
    this._currentRoom = null;
    this._otherPlayers = {};
    this._gameID = null;
    this._miniMap = null;
    this._currentMiniRoom = null;
    this._events = null;
    this._lastSend = new Date().getTime();

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
    this.sendChatMessage = sendChatMessage.bind(this);
    this.sendEventMessage = sendEventMessage.bind(this);
    this.reloadRoom = reloadRoom.bind(this);
    this.assembleMap = assembleMap.bind(this);
    this.performEvent = performEvent.bind(this);
    this.attack = attack.bind(this);
    this.start = start.bind(this);
  }
});

