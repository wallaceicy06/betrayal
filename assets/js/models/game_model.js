define([
], function() {

  'use strict';

  var GRID_DIMENSIONS = {
    width: 24,
    height: 20
  };

  function getGridSpecs() {
    return GRID_DIMENSIONS;
  }

  function start() {
  }

  return function GameModel(view) {
    console.log('constructing a game model');

    this.getGridSpecs = getGridSpecs;
    this.start = start;
  }
});

