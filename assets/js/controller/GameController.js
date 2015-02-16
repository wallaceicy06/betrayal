define([
    'jquery',
    'model/GameModel',
    'view/GameView'
], function($, GameModel, GameView) {
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
          getName: function() {
            return playerModel.name;
          },

          getID: function() {
            return playerModel.id;
          },

          getSpeed: function() {
            return playerModel.speed;
          },

          getMaxHealth: function() {
            return playerModel.maxHealth;
          },

          getCurHealth: function() {
            return playerModel.curHealth;
          },

          getWeapon: function() {
            return playerModel.weapon;
          },

          getRelics: function() {
            return playerModel.relics;
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

          getRoom: function() {
            return playerModel.room;
          },

          getColor: function() {
            return playerModel.color;
          },

          setPosition: function(x, y) {
            playerModel.setPosition(x, y);
          },

          onSpeedIncClick: function(increaseBy) {
            playerModel.speed = playerModel.speed + increaseBy;
          },

          onSpeedDecClick: function() {
            playerModel.speed = playerModel.speed - 1;
          },

          useItem: function(stat, amount) {
            switch(stat) {
              case "maxHealth":
                playerModel.maxHealth = playerModel.maxHealth + amount;
                break;
              case "curHealth":
                playerModel.curHealth = playerModel.curHealth + amount;
                break;
              case "weapon":
                playerModel.weapon = playerModel.weapon + amount;
                break;
              case "relics":
                playerModel.relics = playerModel.relics + amount;
                break;
              default:
                console.log("Unknown stat: " + stat);
                break;
            }
          }
        });

        return {
          /* Player View Adapter */
          onSpeedChange: function(newSpeed) {
            playerView.setSpeed(newSpeed);
          },

          onRelicsChange: function(newRelics) {
            playerView.setRelics(newRelics);
          },

          onWeaponChange: function(newWeapon) {
            playerView.setWeapon(newWeapon);
          },

          onCurHealthChange: function(newCurHealth) {
            playerView.setCurHealth(newCurHealth);
          },

          onMaxHealthChange: function(newMaxHealth) {
            playerView.setMaxHealth(newMaxHealth);
          }
        }
      },

      addOtherPlayer: function(playerModel) {
        return that._view.addOtherPlayer({
          getID: function() {
            return playerModel.id;
          },

          getName: function() {
            return playerModel.name;
          },

          getSpeed: function() {
            return playerModel.speed;
          },

          getMaxHealth: function() {
            return playerModel.maxHealth;
          },

          getCurHealth: function() {
            return playerModel.curHealth;
          },

          getWeapon: function() {
            return playerModel.weapon;
          },

          getRelics: function() {
            return playerModel.relics;
          },

          getX: function() {
            return playerModel.x;
          },

          getY: function() {
            return playerModel.y;
          },

          getRoom: function() {
            return playerModel.room;
          },

          getColor: function() {
            return playerModel.color;
          }
        });
      },

      loadRoom: function(roomConfig) {
        that._view.loadRoom(roomConfig);
      },

      removeAllHusks: function() {
        that._view.removeAllHusks();
      },

      removeItem: function(id) {
        that._view.removeItem(id);
      },

      setGames: function(games) {
        that._view.setGameOptions(games);
      },

      changeColor: function(color) {
        that._view.changeColor(color);
      },

      messageReceived: function(message) {
        that._view.appendChatMessage(message);
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
        return that._model.joinGame(name, gameID);
      },

      onCreateGameClick: function(name) {
        return that._model.createGame(name);
      },

      onSendChatMessage: function(message) {
        return that._model.sendChatMessage(message);
      }
    });

    this.start = start;
  }
});
