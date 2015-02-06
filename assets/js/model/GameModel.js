define([
    'model/Player'
], function(Player) {

  'use strict';

  var DIMENSIONS = {
    width: 768,
    height: 640
  };

  var _viewAdpt;
  var _player;
  var _currentRoom;
  var _otherPlayers = {}; // other players in current room

  function getDimensions() {
    return DIMENSIONS;
  }

  function getGateways() {
    return {north: 1,
            east: 2,
            south: 3,
            west: 4}
  }

  function joinGame(playerName, gameID) {
    io.socket.get('/game/' + gameID, function (game) {
      io.socket.post('/player', {name: playerName, game: game.id, room: game.startingRoom.id}, function (player) {
        _player = new Player(player.id, player.name);
        _player.installViewAdpt(_viewAdpt.makePlayerViewAdpt(_player));
        _currentRoom = player.room;

        fetchRoom(_currentRoom, function (room) {
          _currentRoom = room;
          var doors = {};
          for (var i = 0; i < room.gatewaysOut.length; i++) {
            var gateway = room.gatewaysOut[i];
            doors[gateway.direction] = gateway.roomTo;
          }
          _viewAdpt.loadRoom({background: room.background, doors: doors});
        });

        /* Populate other players object when join game */
        io.socket.get('/player', function (err, jwr) {
          jwr.body.forEach(function (v, i, a) {
            if (v.id !== _player.getID()) {
              _otherPlayers[v.id] = {id: v.id, room: v.room.id, locX: v.locX, locY: v.locY};

              _viewAdpt.addPlayer(v.name);

              if (v.room.id === _currentRoom.id) {
                _viewAdpt.makePlayerHusk(v.id, v.locX, v.locY); // draw other player
              }
            }
          });
        });

      });
    });
  }

  function fetchGames() {
    io.socket.get('/game', function(games) {
      _viewAdpt.setGames(games);
    });
  };

  function createGame(name) {
    io.socket.post('/game', {name: name}, function(game) {
      fetchGames();
    });
  }

  function start() {
    // _player = new Player();
    // _player.installViewAdpt(_viewAdpt.makePlayerViewAdpt(_player));
  }

  function onDoorVisit(doorID) {
    for (var i = 0; i < _currentRoom.gatewaysOut.length; i++) {
      if (_currentRoom.gatewaysOut[i].direction === doorID) {
        // get ID of room player is going to
        var id = _currentRoom.gatewaysOut[i].roomTo;
        break;
      }
    }

    fetchRoom(id, function (room){
      var doors = {};
      for (var i = 0; i < room['gatewaysOut'].length; i++) {
        var gateway = room['gatewaysOut'][i];
        doors[gateway['direction']] = gateway['roomTo'];
      }
      _currentRoom = room;
      var roomConfig = {background: room.background, doors: doors};

      io.socket.put('/player/changeRoom/' + _player.getID(), {room: _currentRoom.id}, function (player) {
        if (doorID === 'north') {
          _player.setPosition(_player.getX(), DIMENSIONS.height - 65);
        } else if (doorID === 'east') {
          _player.setPosition(33, _player.getY());
        } else if (doorID === 'south') {
          _player.setPosition(_player.getX(), 33);
        } else if (doorID === 'west') {
          _player.setPosition(DIMENSIONS.width - 65, _player.getY());
        }

        _viewAdpt.loadRoom(roomConfig);
      });
    });

  }

  function fetchRoom(roomID, cb) {
    io.socket.get('/room/' + roomID, function (room) {

      _viewAdpt.removeAllHusks();

      for (var p in _otherPlayers) {
        if (_otherPlayers[p].room === room.id) {
          _viewAdpt.makePlayerHusk(_otherPlayers[p].id, _otherPlayers[p].locX, _otherPlayers[p].locY); // draw other player
        }
      }

      cb(room);
    });
  }

  return function GameModel(viewAdpt) {
    console.log('constructing a game model');

    io.socket.on('player', function(o) {
      if (o.verb === 'created' && o.id !== _player.getID()) {
        console.log('created player event');
        _otherPlayers[o.id] = {id: o.id,
                               name: o.data.name,
                               locX: o.data.locX,
                               locY: o.data.locY,
                               room: o.data.room};

        _viewAdpt.addPlayer(o.data.name);
      } else if (o.verb === 'updated' && o.id !== _player.getID()) {
        /*if (o.data.locX !== undefined && o.data.locY !== undefined) {
          _otherPlayers[o.id].locX = o.data.locX;
          _otherPlayers[o.id].locY = o.data.locY;
        }*/
        if (o.data.room !== undefined) {
          _otherPlayers[o.id].room = o.data.room;
        }
        if (_otherPlayers[o.id].room === _currentRoom.id) {
          _viewAdpt.moveHusk(o.id, o.data.locX, o.data.locY);
        }
      }
    });

    io.socket.on('room', function(o) {
      if (o.verb === 'addedTo' && o.addedId !== _player.getID() && o.id === _currentRoom.id) {
        io.socket.get('/player/' + o.addedId, function (resData) {
          //_otherPlayers[resData.id] = resData;
          _viewAdpt.makePlayerHusk(resData.id, resData.locX, resData.locY); // draw other player
        });
      } else if (o.verb === 'removedFrom' && o.id === _currentRoom.id) {
        io.socket.get('/player/' + o.removedId, function (resData) {
          //delete _otherPlayers[resData.id];
          _viewAdpt.removeHusk(resData.id); // remove other player image
        });
      } else if (o.verb === 'messaged' && o.data.verb === 'playerUpdated' && o.id === _currentRoom.id && o.data.id !== _player.getID()) {
        _otherPlayers[o.data.id].locX = o.data.data.locX;
        _otherPlayers[o.data.id].locY = o.data.data.locY;
        _viewAdpt.moveHusk(o.data.id, _otherPlayers[o.data.id].locX, _otherPlayers[o.data.id].locY);
      }
    });

    _viewAdpt = viewAdpt;

    this.getGateways = getGateways;
    this.getDimensions = getDimensions;
    this.joinGame = joinGame;
    this.fetchGames = fetchGames;
    this.createGame = createGame;
    this.onDoorVisit = onDoorVisit;
    this.start = start;
  }
});

