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
    _viewAdpt.loadRoom(ROOMS[_currentRoom]);
  }

  function onDoorVisit(doorID) {
    if (doorID === 'north') {
      _player.setY(DIMENSIONS.height - 1);
    } else if (doorID === 'east') {
      _player.setX(0);
    } else if (doorID === 'south') {
      _player.setY(0);
    } else if (doorID === 'west') {
      _player.setX(DIMENSIONS.width - 1);
    }

    _viewAdpt.loadRoom(ROOMS[ROOMS[_currentRoom]['doors'][doorID]]);
  }

  return function GameModel(viewAdpt) {
    console.log('constructing a game model');

    _viewAdpt = viewAdpt;

    _currentRoom = 1;

    this.getGateways = getGateways;
    this.getDimensions = getDimensions;
    this.onDoorVisit = onDoorVisit;
    this.start = start;
  }
});

