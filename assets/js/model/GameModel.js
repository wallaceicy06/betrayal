define([
    'model/Player'
], function(Player) {

  'use strict';

  var GRID_DIMENSIONS = {
    width: 24,
    height: 20
  };
  var ROOMS = {
    1: {background: 'blue', doors: {east: 2, south: 3}},
    2: {background: 'red', doors: {west: 1, south: 4}},
    3: {background: 'yellow', doors: {east: 4, north: 1}},
    4: {background: 'green', doors: {west: 3, north: 2}}
  };

  var _viewAdpt;
  var _player;

  function getGridSpecs() {
    return GRID_DIMENSIONS;
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
    _viewAdpt.loadRoom(ROOMS[1]);
  }

  function onDoorVisit(doorID) {
    _viewAdpt.loadRoom(ROOM[doorID]);
  }

  return function GameModel(viewAdpt) {
    console.log('constructing a game model');

    _viewAdpt = viewAdpt;

    this.getGateways = getGateways;
    this.getGridSpecs = getGridSpecs;
    this.onDoorVisit = onDoorVisit;
    this.start = start;
  }
});

