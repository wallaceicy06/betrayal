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
  var _otherPlayers = []; // other players in current room

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
      console.log("Game ID: " + game.id);
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
        console.log("Entering room " + id);
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



      io.socket.put('/player/changeRoom/' + _player.getID(), {room: _currentRoom.id}, function (player) {});
    });

  }

  function fetchRoom(roomID, cb) {
    io.socket.get('/room/' + roomID, function (room) {
      var playersInRoom = room.players; // get other players

      _viewAdpt.removeAllHusks();

      console.log("other players:");
      for (var i = 0; i < playersInRoom.length; i++) {
        if (playersInRoom[i].id != _player.getID()) {
          io.socket.get('/player/' + playersInRoom[i].id, function (resData) {
            console.log(resData);
            _otherPlayers.push(resData); // add player model to other players array
            _viewAdpt.makePlayerHusk(resData.locX, resData.locY); // draw other player
          });
        }
      }

      cb(room);
    });
  }

  return function GameModel(viewAdpt) {
    console.log('constructing a game model');

    io.socket.on('room', function(o) {console.log(o);});

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

