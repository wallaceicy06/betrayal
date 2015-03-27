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

          getKeys: function() {
            return playerModel.keys;
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

          setColor: function(newColor) {
            playerModel.color = newColor;
          },

          setPosition: function(x, y) {
            playerModel.setPosition(x, y);
          },

          setDirection: function(newDir) {
            playerModel.direction = newDir;
          },

          isTraitor: function() {
            return playerModel.isTraitor;
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
              case "keys":
                playerModel.keys = playerModel.keys + amount;
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

          onKeysChange: function(newKeys) {
            playerView.setKeys(newKeys);
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

          getKeys: function() {
            return playerModel.keys;
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

          isTraitor: function() {
            return playerModel.isTraitor;
          },
        });
      },

      installSpriteMap: function(sprites) {
        that._view.installSpriteMap(sprites);
      },

      loadGame: function() {
        that._view.loadPurgatory();
        that._view.displayGamePane(true);
      },

      startGame: function(roomConfig) {
        that._view.enableGame(true);
        that._view.loadRoom(roomConfig);
      },

      loadRoom: function(roomConfig) {
        that._view.loadRoom(roomConfig);
      },

      loadMap: function(mapConfig) {
        that._view.loadMap(mapConfig);
      },

      reset: function() {
        that._view.reset();
      },

      removeAllHusks: function() {
        that._view.removeAllHusks();
      },

      setHuskColor: function(id, colorString) {
        that._view.setHuskColor(id, colorString);
      },

      changePlayerSprite: function(spriteName) {
        that._view.changePlayerSprite(spriteName);
      },

      removeItem: function(id) {
        that._view.removeItem(id);
      },

      addItem: function(item) {
        that._view.placeItems([item]);
      },

      addGame: function(game) {
        that._view.addGameOption(game);
      },

      setGames: function(games) {
        that._view.setGameOptions(games);
      },

      /*
       * Received a chat or event message that needs to be displayed
       */
      messageReceived: function(playerID, message) {
        that._view.appendChatMessage(playerID, message);
      },

      displayTextOverlay: function(title, flavorText, text, timeout, dismissable, cb) {
        that._view.displayTextOverlay(title, flavorText, text, timeout, dismissable, cb);
      },

      hideRelicsShowKeys: function() {
        that._view.hideRelicsShowKeys();
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

      onCreateGameClick: function(playerName, gameName) {
        that._model.createGame(playerName, gameName);
      },

      onStartGameClick: function() {
        that._model.startGame();
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

      attack: function() {
        that._model.attack();
      },

      useTraitorPower: function() {
        that._model.useTraitorPower();
      }
    });

    this.start = start;
  }
});
