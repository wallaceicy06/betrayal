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

    io.socket.get('/game/' + gameID, function (game) {
      io.socket.post('/player', {name: playerName, game: game.id, room: game.startingRoom}, function (player) {
        that._player = new Player(player.id, player.name);
        that._player.installViewAdpt(that._viewAdpt.makePlayerViewAdpt(that._player));
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
              that._otherPlayers[v.id] = {id: v.id, room: v.room.id, locX: v.locX, locY: v.locY};

              that._viewAdpt.addPlayer(v.name);

              if (v.room.id === that._currentRoom.id) {
                that._viewAdpt.makePlayerHusk(v.id, v.locX, v.locY); // draw other player
              }
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

  function fetchRoom(roomID, cb) {
    var that = this;

    io.socket.get('/room/' + roomID, function (room) {

      that._viewAdpt.removeAllHusks();

      for (var p in that._otherPlayers) {
        if (that._otherPlayers[p].room === room.id) {
          that._viewAdpt.makePlayerHusk(that._otherPlayers[p].id, that._otherPlayers[p].locX, that._otherPlayers[p].locY); // draw other player
        }
      }

      cb(room);
    });
  }

  function initSockets() {
    var that = this;

    io.socket.on('player', function(o) {
      if (o.verb === 'created' && o.id !== that._player.id) {
        console.log('created player event');
        that._otherPlayers[o.id] = {id: o.id,
                                    name: o.data.name,
                                    locX: o.data.locX,
                                    locY: o.data.locY,
                                    room: o.data.room};

        that._viewAdpt.addPlayer(o.data.name);
      } else if (o.verb === 'updated' && o.id !== that._player.id) {
        /*if (o.data.locX !== undefined && o.data.locY !== undefined) {
          _otherPlayers[o.id].locX = o.data.locX;
          _otherPlayers[o.id].locY = o.data.locY;
        }*/
        if (o.data.room !== undefined) {
          that._otherPlayers[o.id].room = o.data.room;
        }
        if (that._otherPlayers[o.id].room === that._currentRoom.id) {
          that._viewAdpt.moveHusk(o.id, o.data.locX, o.data.locY);
        }
      }
    });

    io.socket.on('room', function(o) {
      if (o.verb === 'addedTo' && o.addedId !== that._player.id && o.id === that._currentRoom.id) {
        io.socket.get('/player/' + o.addedId, function (resData) {
          //_otherPlayers[resData.id] = resData;
          that._viewAdpt.makePlayerHusk(resData.id, resData.locX, resData.locY); // draw other player
        });
      } else if (o.verb === 'removedFrom' && o.id === that._currentRoom.id) {
        io.socket.get('/player/' + o.removedId, function (resData) {
          //delete _otherPlayers[resData.id];
          that._viewAdpt.removeHusk(resData.id); // remove other player image
        });
      } else if (o.verb === 'messaged' && o.data.verb === 'playerUpdated'
                 && o.data.id in that._otherPlayers
                 && o.id === that._currentRoom.id
                 && o.data.id !== that._player.id) {
        that._otherPlayers[o.data.id].locX = o.data.data.locX;
        that._otherPlayers[o.data.id].locY = o.data.data.locY;
        that._viewAdpt.moveHusk(o.data.id, that._otherPlayers[o.data.id].locX, that._otherPlayers[o.data.id].locY);
      } else if (o.verb === 'messaged' && o.data.verb === 'itemRemoved' && o.id === that._currentRoom.id) {
        that._viewAdpt.removeItem(o.data.id);
      }
    });
  }

  return function GameModel(viewAdpt) {
    console.log('constructing a game model');

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
    this.start = start.bind(this);
  }
});

