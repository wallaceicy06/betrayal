define([
    'model/game_model',
    'view/game_view'
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
      makePlayerViewAdpt: function(playerModel) {
        var playerView = _view.makePlayerView({
          getSpeed: function() {
            return playerModel.getSpeed();
          },

          onSpeedIncClick: function() {
            playerModel.setSpeed(playerModel.getSpeed() + 1);
          },

          onSpeedDecClick: function() {
            playerModel.setSpeed(playerModel.getSpeed() - 1);
          }
        });

        return {
          /* Player View Adapter */

          onSpeedChange: function(newSpeed) {
            playerView.fourway(newSpeed);
          }
        }
      }
    });

    _view = new GameView({
      getGridSpecs: function() {
        return _model.getGridSpecs();
      }
    });

    this.start = start;
  }
});

