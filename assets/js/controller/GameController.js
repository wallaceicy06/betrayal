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

          setSpeed: function(speed) {
            return playerModel.setSpeed(speed);
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
            playerView.speed({x : newSpeed, y : newSpeed});
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

