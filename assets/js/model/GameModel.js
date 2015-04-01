define([
    'underscore',
    'model/Player',
    'model/MapNode',
    'model/HauntFactory',
    'model/Room'
], function(_, Player, MapNode, HauntFactory, Room) {

  'use strict';

  var DIMENSIONS = {
    width: 576,
    height: 512
  }

  var ATTACK_COOLDOWN = 500;
  var MIN_SEND_WAIT = 32;

  function joinGame(playerName, gameID) {
    var that = this;

    io.socket.get('/game/' + gameID, function (game) {
      that._haunts = game.haunts;
      that._viewAdpt.installSpriteMap(game.sprites);

      var color;
      if (game.players.length === 0) {
        color = 'blue';
      } else {
        switch (game.players[game.players.length - 1].color) {
          case 'blue':
            color = 'red';
            break;
          case 'red':
            color = 'green';
            break;
          case 'green':
            color = 'purple';
            break;
          case 'purple':
            color = 'blue';
          default:
            color = 'green';
        }
      }

      io.socket.post('/player', {name: playerName,
                                 game: game.id,
                                 room: game.startingRoom,
                                 color: color}, function (player) {

        that._player = new Player(player.id, player.name, player.color,
                                  player.room, {x: 64, y: 64});

        var roomID = player.room;

        var playerViewAdpt = that._viewAdpt.makePlayerViewAdpt(that._player);
        that._player.installGameModelAdpt({
          /* (This) Player Model -> Game Model adapter. */

          acquireItem: function(itemID, success) {
            removeItem.call(that, itemID, success);
          },

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
              io.socket.delete('/player/' + player.id, {}, function(data) {
                that._viewAdpt.displayTextOverlay("You died", "Game over", "", 3000,
                                                  false, function() {
                  reset.call(that);
                  that._viewAdpt.reset();
                });
              });
            } else {
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

          onKeysChange: function(newKeys) {
            playerViewAdpt.onKeysChange(newKeys);
            io.socket.put('/player/adjustStat/' + player.id,
                          {stat: 'keys', newValue: newKeys},
                          function (player) {});
          },

          onRoomChange: function(newRoom) {
            /* Do nothing. */
          },

          onTraitorSet: function(newVal) {
            io.socket.put('/player/' + player.id, {isTraitor: newVal},
              function(player) {});
          },

          onDestroy: function() {
            /* Do nothing. */
          },

          onPositionChange: function(newX, newY) {
            var curTime = new Date().getTime();
            if (curTime - that._lastSend > MIN_SEND_WAIT) {
              io.socket.put('/player/' + player.id, {locX: newX, locY: newY},
                            function (player) {});
              that._lastSend = curTime;
            }
          },

          onDirectionChange: function(newDirection) {
          }
        });

        fetchRoom.call(that, roomID, function (room) {
          that._currentRoom = room;
          that._miniMap = new MapNode(room.id, room.name);
          that._currentMiniRoom = that._miniMap;
        });

        /* Populate other players object when join game */
        game.players.forEach(function(v, i, a) {
          var player = new Player(v.id, v.name, v.color, v.room,
                                  {x: v.locX, y: v.locY});

          var playerViewAdpt = that._viewAdpt.addOtherPlayer(player);
          player.installGameModelAdpt({
            /* (Other) Player Model -> Game Model Adapter */

            acquireItem: function(itemID, success) {
              /* Do nothing. */
            },

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

            onKeysChange: function(newKeys) {
              playerViewAdpt.onKeysChange(newKeys);
            },

            onPositionChange: function(newX, newY) {
              if (player.room === that._currentRoom.id) {
                playerViewAdpt.setLocation(newX, newY);
              }
            },

            onDirectionChange: function(newDirection) {
              /* Do nothing */
            },

            onTraitorSet: function(newVal) {
              /* Do nothing */
            },

            onDestroy: function() {
              playerViewAdpt.destroy();
              delete that._otherPlayers[v.id];
              if (jQuery.isEmptyObject(that._otherPlayers) && that._player.isTraitor) {
                that._viewAdpt.displayTextOverlay("You Won!", "You have "
                  + "successfully murdered all your friends. Congratulations!", "",
                  10000, false, function() {

                  destroyGame.call(that);
                  reset.call(that);
                  that._viewAdpt.reset();
                });
              }
            }
          });

          that._otherPlayers[v.id] = player;

          playerViewAdpt.setVisibility(player.room === roomID);
        });

        that._viewAdpt.loadGame();

        that._gameID = gameID;
      });
    });
  }

  function fetchGames() {
    var that = this;

    io.socket.get('/game', function(games) {
      var validGames = [];

      _.each(games, function(g) {
        if (!g.active) {
          validGames.push(g);
        }
      });

      that._viewAdpt.setGames(validGames);
    });
  };

  function createGame(playerName, gameName) {
    var that = this;

    io.socket.post('/game', {name: gameName}, function(game, jwres) {
      that.fetchGames()
      that.joinGame(playerName, game.id);
    });
  }

  function start() {
  }

  function startGame() {
    var that = this;

    io.socket.put('/game/' + this._gameID, {active: true}, function(res) {
      var roomConfig = prepareRoomConfig.call(that, that._currentRoom);

      that._viewAdpt.startGame(roomConfig);
    });
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

      io.socket.put('/player/changeRoom/' + that._player.id,
                    {room: that._currentRoom.id}, function (playersInRoom) {

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

        /* Set locations of other players in room. */
        playersInRoom.forEach(function(v, i, a) {
          if (v.id != that._player.id) {
            that._otherPlayers[v.id].setPosition(v.locX, v.locY);
          }
        });

        /* Set the current mini room to the one we just moved to. */
        that._currentMiniRoom = newMiniRoom;

        that._viewAdpt.loadRoom(roomConfig);
      });
    });

  }

  function onFurnitureInteract(furnitureID) {
    var that = this;

    io.socket.post('/room/interact/' + this._currentRoom.id,
                   {furnitureID: furnitureID}, function(resData) {

      /* Don't do anything if there was no interaction. */
      if (_.isEmpty(resData)) {
        return;
      }

      that._viewAdpt.displayTextOverlay(resData.title, resData.flavorText,
                                        resData.text, 3000, true, function() {
        for (var stat in resData.effect) {
          /* For right now, event effects only alter stats. */
          that._player[stat] = that._player[stat] + resData.effect[stat];
        }
      });

    });
  }

  function removeItem(itemID, success) {
    var that = this;

    io.socket.delete('/item/' + itemID, function(data) {
      that._currentRoom.removeItem(itemID);
      success();
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
            furniture: room.objects};
  }

  function assembleMap() {
    this._viewAdpt.loadMap(this._miniMap);
  }

  function fetchRoom(roomID, cb) {
    var that = this;

    if (_.has(that._roomCache, roomID)) {
      cb(that._roomCache[roomID]);
    } else {
      io.socket.get('/room/' + roomID, function (room) {
        var newRoom = new Room(room.id, room.gatewaysOut, room.gatewaysIn,
                               room.background, room.items, room.objects, {
          /* Room -> GameModel Adapter */
          onAddItem: function(item) {
            /*
             * Only add the item to the view if the current room is that item's
             * room.
             */
            if (that._currentRoom.id == item.room) {
              that._viewAdpt.placeItem(item);
            }
          },

          onRemoveItem: function(itemID) {
            that._viewAdpt.removeItem(itemID);
          }
        });

        /* Add the newly created room to the cache. */
        that._roomCache[roomID] = newRoom;

        cb(newRoom);
      });
    }
  }

  function sendChatMessage(message) {
    io.socket.put('/game/sendChatMessage/' + this._gameID,
                  {message: message, playerID: this._player.id},
                  function (resData, jwr) {});
  }

  function sendEventMessage(message) {
    io.socket.put('/game/sendChatMessage/' + this._gameID, {message: message,
                  playerID: undefined}, function (resData, jwr) {});
  }

  /*
   * Performs the given event, altering player stats as necessary.
   * Returns the title and text of the event to be displayed.
   */
  function performEvent(eventID) {
    io.socket.put('/room/removeEvent/' + this._currentRoom.id, {},
                  function(resData, jwr) {});
    for (var stat in event.effect) {
      /* For right now, event effects only alter stats. */
      this._player[stat] = this._player[stat] + event.effect[stat];
    }
    return {title: event.title, flavorText: event.flavorText, text: event.text};
  }

  /* Checks if this player can attack, and tells server this player is attacking */
  function attack() {
    if (!this._combatEnabled) {
      return;
    }
    var curTime = new Date().getTime();
    if (curTime - this._lastAttack > ATTACK_COOLDOWN) {
      this._lastAttack = curTime;
      this._viewAdpt.attackAnimation();
      io.socket.put('/player/attack/' + this._player.id, {},
                    function(redData, jwr) {});
    }
  }

  function useTraitorPower() {
    if (this._hauntAdpt === null) {
      console.log("Can't use traitor power before start of haunt.");
      return;
    } else if (!this._player.isTraitor) {
      console.log("Heroes can't use traitor power");
      return;
    }
    this._hauntAdpt.usePower();
  }

  function initSockets() {
    var that = this;

    io.socket.on('player', function(o) {
      if (o.verb === 'created' && o.data.game == that._gameID
          && o.id !== that._player.id) {

        var player =  new Player(o.id,
                                 o.data.name,
                                 o.data.color,
                                 o.data.room,
                                 {x: o.data.locX, y: o.data.locY});

        var playerViewAdpt = that._viewAdpt.addOtherPlayer(player);
        player.installGameModelAdpt({
          /* (Other) Player -> Game Model adapter. */

          acquireItem: function(itemID, success) {
            removeItem.call(that, itemID, success);
          },

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

          onKeysChange: function(newKeys) {
            playerViewAdpt.onKeysChange(newKeys);
          },

          onPositionChange: function(newX, newY) {
            if (player.room === that._currentRoom.id) {
              playerViewAdpt.setLocation(newX, newY);
            }
          },

          onDirectionChange: function(newDirection) {
            /* Do nothing */
          },

          onTraitorSet: function(newVal) {
            /* Do nothing */
          },

          onDestroy: function() {
            playerViewAdpt.destroy();
            delete that._otherPlayers[player.id];
            if (jQuery.isEmptyObject(that._otherPlayers) && that._player.isTraitor) {
              that._viewAdpt.displayTextOverlay("You Won!", "You have "
                + "successfully murdered all your friends. Congratulations!", "",
                10000, false, function() {
                reset.call(that);
                that._viewAdpt.reset();
              });
            }

          }
        });

        that._otherPlayers[o.id] = player;

        /* Subscribe to the new player. */
        io.socket.get('/player/subscribe/' + o.id, function(resData) {});

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
        } else if (o.data.color !== undefined && o.id !== that._player.id) {
          that._otherPlayers[o.id].color = o.data.color;
          that._viewAdpt.setHuskColor(o.id, o.data.color);
        } else { /* Stat update */
          if (o.id !== that._player.id) {
            for (var key in o.data) {
              if (key !== "updatedAt") {
                /* TODO: make this less jank. */
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
      }
    });

    io.socket.on('item', function(o) {
      if (o.verb === 'created') {
        /* If we cached this room, add the item to the cached version. */
        if (o.data.room in that._roomCache) {
          that._roomCache[o.data.room].addItem(o.data);
        }

        io.socket.get('/item/subscribe/' + o.data.id, function(res) {});
      } else if (o.verb === 'destroyed') {
        /* If we cached this room, remove the item to the cached version. */
        if (o.previous.room in that._roomCache) {
          that._roomCache[o.previous.room].removeItem(o.previous.id);
        }
      }
    });

    io.socket.on('game', function(o) {
      if (o.verb === 'created') {
        that._viewAdpt.addGame(o.data);
      } else if (o.id == that._gameID && o.verb === 'messaged') {
        if (o.data.verb === 'heroesWon') {
          var message;

          if (that._player.isTraitor) {
            that._viewAdpt.displayTextOverlay("Game Over", "You have failed " +
                                              "your mission. The heroes have " +
                                              "escaped", "", 10000, false, function() {
              destroyGame.call(that);
              reset.call(that);
              that._viewAdpt.reset();
            });
          } else {
            that._viewAdpt.displayTextOverlay("You Won!", "You have escaped " +
                                              "the house! Congratulations!", "",
                                              10000, false, function() {
              destroyGame.call(that);
              reset.call(that);
              that._viewAdpt.reset();
            });
          }
        } else if (o.data.verb === 'chat') {
          that._viewAdpt.messageReceived(o.data.playerID, o.data.message);
        }

      } else if (o.verb === 'updated') {
        fetchGames.call(that);

        if (o.id != that._gameID) {
          return;
        }

        if (o.data.active !== undefined) {
          var roomConfig = prepareRoomConfig.call(that, that._currentRoom);

          that._viewAdpt.startGame(roomConfig);

        } else if (o.data.haunt !== undefined) {
          /*
           * An update on the game indicates that the haunt is starting
           */
          that._combatEnabled = true;

          that._viewAdpt.hideRelicsShowKeys();

          var factory = new HauntFactory({  /* Haunt to Game Model Adapter */
            changeSprite: function(spriteName) {
              that._viewAdpt.changePlayerSprite(spriteName);
              io.socket.put('/player/' + that._player.id, {color: spriteName},
                function(err, player) {});
            }
          });
          that._hauntAdpt = factory.makeHauntAdapter(o.data.haunt);

          if (o.data.traitor === that._player.id) {
            that._player.isTraitor = true;
            that._viewAdpt.displayTextOverlay('Traitor',
                                              that._haunts[o.data.haunt].traitorFlavor,
                                              that._haunts[o.data.haunt].traitorText,
                                              10000, false, function() {});
          } else {
            that._viewAdpt.displayTextOverlay('Hero',
                                              that._haunts[o.data.haunt].heroFlavor,
                                              that._haunts[o.data.haunt].heroText,
                                              10000, false, function() {});
          }
        }
      } else if (o.verb === 'destroyed') {
          fetchGames.call(that);

          if (o.id == that._gameID) {
            reset.call(that);
            that._viewAdpt.reset();
          }
      }
    });
  }

  function destroyGame() {
    io.socket.post('/game/destroy/' + this._gameID, {}, function(res) {
    });
  }

  function reset() {
    this._player = null;
    this._currentRoom = null;
    this._otherPlayers = {};
    this._gameID = null;
    this._miniMap = null;
    this._currentMiniRoom = null;
    this._haunts = null;
    this._lastSend = new Date().getTime();
    this._lastAttack = new Date().getTime();
    this._combatEnabled = false;
    this._hauntAdpt = null;
  }


  return function GameModel(viewAdpt) {
    this._viewAdpt = viewAdpt;
    this._roomCache = {};

    reset.call(this);
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
    this.onFurnitureInteract = onFurnitureInteract.bind(this);
    this.sendChatMessage = sendChatMessage.bind(this);
    this.sendEventMessage = sendEventMessage.bind(this);
    this.reloadRoom = reloadRoom.bind(this);
    this.assembleMap = assembleMap.bind(this);
    this.performEvent = performEvent.bind(this);
    this.attack = attack.bind(this);
    this.useTraitorPower = useTraitorPower.bind(this);
    this.start = start.bind(this);
    this.startGame = startGame.bind(this);
  }
});

