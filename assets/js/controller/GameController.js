define([
    'jquery',
    'model/GameModel',
    'view/GameView'
], function($, GameModel, GameView) {
  'use strict';

  /*
   * Start both the model and view
   */
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
      /* Game Model -> Game View Adapter */

      makePlayerViewAdpt: function(playerModel) {
        var playerView = that._view.makePlayerView({
          /* Player View -> Player Model Adapter for our player */

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

          useItem: function(stat, amount) {
            switch(stat) {
              case "speed":
                playerModel.speed = playerModel.speed + amount;
                break;
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
          /* Player Model -> Player View Adapter */

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
          /* Player View -> Player Model Adapter for other players*/

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

      installSpriteMap: function(sprites) {
        that._view.installSpriteMap(sprites);
      },

      startGame: function(roomConfig) {
        that._view.loadRoom(roomConfig);
        that._view.displayGamePane(true);
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

      addGame: function(game) {
        that._view.addGameOption(game);
      },

      setGames: function(games) {
        that._view.setGameOptions(games);
      },

      changeColor: function(color) {
        that._view.changeColor(color);
      },

      /*
       * Received a chat or event message that needs to be displayed
       */
      messageReceived: function(playerID, message) {
        if (playerID == undefined) {
          that._view.appendEvent(message);
        }
        else {
          that._view.appendChatMessage(playerID, message);
        }
      },

      /*
       * Notify our player that they have died
       */
      notifyDead: function() {
        that._view.notifyDead();
        setTimeout(function() {
          that._view.displayGamePane(false);
        }, 3000);
      }
    });

    this._view = new GameView({
      /* Game View -> Game Model Adapter */

      fetchGames: function() {
        return that._model.fetchGames();
      },

      getDimensions: function() {
        return that._model.dimensions;
      },

      onDoorVisit: function(doorID) {
        return that._model.onDoorVisit(doorID);
      },

      onFurnitureInteract: function(furnitureID) {
        return that._model.onFurnitureInteract(furnitureID);
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
