define([
    'model/GameModel',
    'view/GameView'
], function(GameModel, GameView) {
  'use strict';

  function start() {
    this._model.start();
    this._view.start();
  }

  /*
   * Constructor for the GameController.
   */
  return function GameController() {
    var that = this;

    this._model = new GameModel({
      makePlayerViewAdpt: function(playerModel) {
        var playerView = that._view.makePlayerView({
          getSpeed: function() {
            return playerModel.speed;
          },

          setSpeed: function(speed) {
            playerModel.speed = speed;
          },

          getX: function() {
            return playerModel.x;
          },

          getY: function() {
            return playerModel.y;
          },

          setPosition: function(x, y) {
            playerModel.setPosition(x, y);
          },

          onSpeedIncClick: function() {
            playerModel.speed = playerModel.speed + 1;
          },

          onSpeedDecClick: function() {
            playerModel.speed = playerModel.speed() - 1;
          },
        });

        return {
          /* Player View Adapter */
          onSpeedChange: function(newSpeed) {
            playerView.speed({x : newSpeed, y : newSpeed});
          }
        }
      },

      addPlayer: function(name) {
        that._view.addPlayerToList(name);
      },

      loadRoom: function(roomConfig) {
        that._view.loadRoom(roomConfig);
      },

      makePlayerHusk: function(id, x, y) {
        that._view.makePlayerHusk(id, x, y);
      },

      removeAllHusks: function() {
        that._view.removeAllHusks();
      },

      removeHusk: function(id) {
        that._view.removeHusk(id);
      },

      moveHusk: function(id, x, y) {
        that._view.moveHusk(id, x, y);
      },

      setGames: function(games) {
        that._view.setGameOptions(games);
      }
    });

    this._view = new GameView({
      fetchGames: function() {
        return that._model.fetchGames();
      },

      getDimensions: function() {
        return that._model.dimensions;
      },

      onDoorVisit: function(doorID) {
        return that._model.onDoorVisit(doorID);
      },

      onJoinClick: function(name, gameID) {
        return that._model.joinGame(name, gameID)
      },

      onCreateGameClick: function(name) {
        return that._model.createGame(name);
      },
    });

    this.start = start;
  }
});

