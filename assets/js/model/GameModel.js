define([
    'model/Player'
], function(Player) {

  'use strict';

  var DIMENSIONS = {
    width: 768,
    height: 640
  };
  var ROOMS = {
    1: {background: 'blue', doors: {east: 2, south: 3}},
    2: {background: 'black', doors: {west: 1, south: 4}},
    3: {background: 'yellow', doors: {east: 4, north: 1}},
    4: {background: 'green', doors: {west: 3, north: 2}}
  };

  var _viewAdpt;
  var _player;
  var _currentRoom;

  function getDimensions() {
    return DIMENSIONS;
  }

  function getGateways() {
    return {north: 1,
            east: 2,
            south: 3,
            west: 4}
  }

  function start() {
    _player = new Player();
    _player.installViewAdpt(_viewAdpt.makePlayerViewAdpt(_player));
  }

  function onDoorVisit(doorID) {
    if (doorID === 'north') {
      _player.setY(DIMENSIONS.height - 65);
    } else if (doorID === 'east') {
      _player.setX(32);
    } else if (doorID === 'south') {
      _player.setY(32);
    } else if (doorID === 'west') {
      _player.setX(DIMENSIONS.width - 65);
    }

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
      var roomConfig = {background: room.name, doors: doors};
      _viewAdpt.loadRoom(roomConfig);
    });
    
  }

  function fetchRoom(roomID, cb) {
    io.socket.get('/room/' + roomID, function (room){ cb(room); });
  }

  return function GameModel(viewAdpt) {
    console.log('constructing a game model');

    _viewAdpt = viewAdpt;

    fetchRoom(1, function (room) {
      _currentRoom = room;
      var doors = {};
      for (var i = 0; i < room['gatewaysOut'].length; i++) {
        var gateway = room['gatewaysOut'][i];
        doors[gateway['direction']] = gateway['roomTo'];
      }
      _viewAdpt.loadRoom({background: room.name, doors: doors});
    });

    this.getGateways = getGateways;
    this.getDimensions = getDimensions;
    this.onDoorVisit = onDoorVisit;
    this.start = start;
  }
});

