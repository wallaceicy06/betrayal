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

          setSprite: function(newSprite) {
            playerModel.sprite = newSprite;
          },

          getSprite: function() {
            return playerModel.sprite;
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

          useItem: function(itemID, stat, amount) {
            return playerModel.useItem(itemID, stat, amount);
          }
        });

        return {
          /* Player Model -> Player View Adapter */

          destroy: function() {
            playerView.destroy();
          },

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
          },

          lockDoor: function() {
            return playerView.lockDoor();
          }
        }
      },

      addOtherPlayer: function(playerModel) {
        var playerView = that._view.addOtherPlayer({
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

          getSprite: function() {
            return playerModel.sprite;
          },

          isTraitor: function() {
            return playerModel.isTraitor;
          },
        });

        return {
          /* (Other) Player Model -> Player View Adapter */

          destroy: function() {
            return playerView.destroy();
          },

          onRelicsChange: function(newRelics) {
            return playerView.setRelics(newRelics);
          },

          onKeysChange: function(newKeys) {
            return playerView.setKeys(newKeys);
          },

          onWeaponChange: function(newWeapon) {
            return playerView.setWeapon(newWeapon);
          },

          onCurHealthChange: function(newCurHealth) {
            return playerView.setCurHealth(newCurHealth);
          },

          onMaxHealthChange: function(newMaxHealth) {
            return playerView.setMaxHealth(newMaxHealth);
          },

          onSpeedChange: function(newSpeed) {
            return playerView.setSpeed(newSpeed);
          },

          setLocation: function(newX, newY) {
            return playerView.setLocation(newX, newY);
          },

          setVisibility: function(visible) {
            return playerView.setVisibility(visible);
          }
        }
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

      updateMap: function(allRooms) {
        that._view.loadMap(allRooms);
      },

      reset: function() {
        that._view.reset();
      },

      removeAllHusks: function() {
        that._view.removeAllHusks();
      },

      setHuskSprite: function(id, newSprite) {
        that._view.setHuskSprite(id, newSprite);
      },

      changePlayerSprite: function(spriteName) {
        that._view.changePlayerSprite(spriteName);
      },

      attackAnimation: function(x, y) {
        that._view.attackAnimation(x, y);
      },

      removeItem: function(id) {
        that._view.removeItem(id);
      },

      placeItem: function(item) {
        that._view.placeItem(item);
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
      messageReceived: function(player, message) {
        that._view.appendChatMessage(player, message);
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

      onDoorVisit: function(doorID, cb) {
        return that._model.onDoorVisit(doorID, cb);
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

      onLeaveGameClick: function() {
        that._model.leaveGame();
      },

      onSendChatMessage: function(message) {
        return that._model.sendChatMessage(message);
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
