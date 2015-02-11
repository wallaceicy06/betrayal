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
        var that = this;

        that._speed = newSpeed;
        io.socket.put('/player/adjustStat/' + this.id, {stat: 'speed', newValue: newSpeed}, function (player) {});
        that._playerViewAdpt.onSpeedChange(that._speed);
      }
    });

    Object.defineProperty(this, 'maxHealth', {
      get: function() {
        return this._maxHealth;
      },
      set: function(newVal) {
        this._maxHealth = newVal;
        io.socket.put('/player/adjustStat/' + this.id, {stat: 'maxHealth', newValue: newVal}, function (player) {});
      }
    });

    Object.defineProperty(this, 'curHealth', {
      get: function() {
        return this._curHealth;
      },
      set: function(newVal) {
        this._maxHealth = newVal;
        io.socket.put('/player/adjustStat/' + this.id, {stat: 'curHealth', newValue: newVal}, function (player) {});
      }
    });

    Object.defineProperty(this, 'weapon', {
      get: function() {
        return this._weapon;
      },
      set: function(newVal) {
        this._weapon = newVal;
        io.socket.put('/player/adjustStat/' + this.id, {stat: 'weapon', newValue: newVal}, function (player) {});
      }
    });

    Object.defineProperty(this, 'relics', {
      get: function() {
        return this._relics;
      },
      set: function(newVal) {
        this._maxHealth = newVal;
        io.socket.put('/player/adjustStat/' + this.id, {stat: 'relics', newValue: newVal}, function (player) {});
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
    this._maxHealth = 3;
    this._curHealth = 3;
    this._weapon = 1;
    this._relics = 0;
  }
});
