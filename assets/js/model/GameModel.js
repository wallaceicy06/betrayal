define([
    'model/Player'
], function(Player) {

  'use strict';

  var GRID_DIMENSIONS = {
    width: 24,
    height: 20
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
  }

  return function GameModel(viewAdpt) {
    console.log('constructing a game model');

    _viewAdpt = viewAdpt;

    this.getGateways = getGateways;
    this.getGridSpecs = getGridSpecs;
    this.start = start;
  }
});

