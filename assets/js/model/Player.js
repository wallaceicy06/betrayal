define([
], function() {

  'use strict';

  function setPosition(x, y) {
    this.x = x;
    this.y = y;
    this._gameModelAdpt.onPositionChange(x, y);
  }

  function installGameModelAdpt(gameModelAdpt) {
    this._gameModelAdpt = gameModelAdpt;
  }

  return function Player(id, name, color, room, initPos) {
    Object.defineProperty(this, 'id', {
      value: id,
      writable: false
    });

    Object.defineProperty(this, 'name', {
      value: name,
      writable: false
    });

    Object.defineProperty(this, 'color', {
      value: color,
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

    Object.defineProperty(this, 'maxHealth', {
      get: function() {
        return this._maxHealth;
      },
      set: function(newVal) {
        this._maxHealth = newVal;
        this._gameModelAdpt.onMaxHealthChange(newVal);
      }
    });

    Object.defineProperty(this, 'curHealth', {
      get: function() {
        return this._curHealth;
      },
      set: function(newVal) {
        if (newVal < this._maxHealth) {
          this._maxHealth = newVal;
          this._gameModelAdpt.onCurHealthChange(newVal);
        }
      }
    });

    Object.defineProperty(this, 'weapon', {
      get: function() {
        return this._weapon;
      },
      set: function(newVal) {
        this._weapon = newVal;
        this._gameModelAdpt.onWeaponChange(newVal);
      }
    });

    Object.defineProperty(this, 'relics', {
      get: function() {
        return this._relics;
      },
      set: function(newVal) {
        this._maxHealth = newVal;
        this._gameModelAdpt.onRelicsChange(newVal);
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
    this._maxHealth = 3;
    this._curHealth = 3;
    this._weapon = 1;
    this._relics = 0;
  }
});
