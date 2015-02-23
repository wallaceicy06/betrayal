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

          setSpeed: function(speed) {   /* Is this method necessary? */
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
          onSpeedChange: function(newSpeed, oldSpeed) {
            playerView.setSpeed(newSpeed);
            playerView.fixMovement(newSpeed - oldSpeed);
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

      startGame: function(roomConfig) {
        that._view.loadRoom(roomConfig);
        that._view.displayGamePane();
      },

      loadRoom: function(roomConfig) {
        that._view.loadRoom(roomConfig);
      },

      loadMap: function(mapConfig) {
        that._view.loadMap(mapConfig);
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

      messageReceived: function(playerID, message) {
        that._view.appendChatMessage(playerID, message);
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
      },

      onEnableMap: function() {
        return that._model.assembleMap();
      },

      onDisableMap: function() {
        return that._model.reloadRoom();
      },

      performEvent: function(eventID) {
        return that._model.performEvent(eventID);
      },

      attack: function() {
        that._model.attack();
      }
    });

    this.start = start;
  }
});
