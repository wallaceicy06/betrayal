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

  function start() {
    _player = new Player();
    _player.installViewAdpt(_viewAdpt.makePlayerViewAdpt(_player));
  }

  return function GameModel(viewAdpt) {
    console.log('constructing a game model');

    _viewAdpt = viewAdpt;

    this.getGridSpecs = getGridSpecs;
    this.start = start;
  }
});

