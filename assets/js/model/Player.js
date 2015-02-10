define([
], function() {

  'use strict';

  function setPosition(x, y) {
    this.x = x;
    this.y = y;
    io.socket.put('/player/' + this.id, {locX: this.x, locY: this.y}, function (player) {});
  }

  function installViewAdpt(playerViewAdpt) {
    this._playerViewAdpt = playerViewAdpt;
  }

  return function Player(id, name) {
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
        this._playerViewAdpt.onSpeedChange(this._speed);
      }
    });

    Object.defineProperty(this, 'x', {
      value: 64,
      writable: true
    });

    Object.defineProperty(this, 'y', {
      value: 64,
      writable: true
    });

    this.installViewAdpt = installViewAdpt;
    this.setPosition = setPosition;

    this._speed = 5;
  }
});
