define([
    'model/GameModel',
    'view/GameView'
], function(GameModel, GameView) {
  'use strict';

  var _modelAdpt;
  var _viewAdpt;

  function start() {
    _modelAdpt.start();
    _viewAdpt.start();
  }

  /*
   * Constructor for the GameController.
   */
  return function GameController() {
    _modelAdpt = new GameModel({
      makePlayerViewAdpt: function(playerModel) {
        var playerView = _viewAdpt.makePlayerView({
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

    _viewAdpt = new GameView({
      getGridSpecs: function() {
        return _modelAdpt.getGridSpecs();
      }
    });

    this.start = start;
  }
});

