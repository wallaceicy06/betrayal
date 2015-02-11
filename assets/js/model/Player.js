define([
], function() {

  'use strict';

  function setPosition(x, y) {
    this.x = x;
    this.y = y;
    this._gameModelAdpt.onPositionChange(x, y);
    // io.socket.put('/player/' + this.id, {locX: this.x, locY: this.y}, function (player) {});
  }

  function installGameModelAdpt(gameModelAdpt) {
    this._gameModelAdpt = gameModelAdpt;
  }

  return function Player(id, name, room, initPos) {
    Object.defineProperty(this, 'id', {
      value: id,
      writable: false
    });

    Object.defineProperty(this, 'name', {
      value: name,
      writable: false
    });

    Object.defineProperty(this, 'speed', {
      get: function() {
        return this._speed;
      },
      set: function(newSpeed) {
        this._speed = newSpeed;
        this._gameModelAdpt.onSpeedChange(this._speed);
      }
    });

    Object.defineProperty(this, 'x', {
      value: initPos.x,
      writable: true
    });

    Object.defineProperty(this, 'y', {
      value: initPos.y,
      writable: true
    });

    Object.defineProperty(this, 'room', {
      get: function(room) {
        return this._room;
      },
      set: function(room) {
        this._room = room;
        this._gameModelAdpt.onRoomChange(this._room);
      }
    });

    this._gameModelAdpt = null;
    this._room = room;

    this.installGameModelAdpt = installGameModelAdpt.bind(this);
    this.setPosition = setPosition.bind(this);

    this._speed = 5;
  }
});
