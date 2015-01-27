define([
    'model/GameModel',
    'view/GameView'
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

    _view = new GameView({
      getGateways: function() {
        return _model.getGateways();
      },

      getGridSpecs: function() {
        return _model.getGridSpecs();
      },

      onDoorVisit: function(doorID) {
        return _model.onDoorVisit(doorID);
      }
    });

    this.start = start;
  }
});

