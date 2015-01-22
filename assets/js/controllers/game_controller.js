define([
    'models/game_model',
    'views/game_view'
], function(GameModel, GameView) {
  'use strict';

  var _model;
  var _view;

  function start() {
    _model.start();
    _view.start();
  }

  /*
   * Constructor for the GameController.
   */
  return function GameController() {
    _model = new GameModel({
    });

    _view = new GameView({
      getGridSpecs: function() {
        return _model.getGridSpecs();
      }
    });

    this.start = start;
  }
});

