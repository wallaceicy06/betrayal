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

  function destroy() {
    this._gameModelAdpt.onDestroy();
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
      get: function() {
        return this._color;
      },
      set: function(newColor) {
        this._color = newColor;
      }
    });

    Object.defineProperty(this, 'speed', {
      get: function() {
        return this._speed;
      },
      set: function(newSpeed) {
        if (newSpeed !== this._speed) {
          var oldSpeed = this._speed;
          this._speed = newSpeed;
          this._gameModelAdpt.onSpeedChange(this._speed, oldSpeed);
        }
      }
    });

    Object.defineProperty(this, 'maxHealth', {
      get: function() {
        return this._maxHealth;
      },
      set: function(newVal) {
        if (newVal !== this._maxHealth) {
          this._maxHealth = newVal;
          this._gameModelAdpt.onMaxHealthChange(newVal);
        }
      }
    });

    Object.defineProperty(this, 'curHealth', {
      get: function() {
        return this._curHealth;
      },
      set: function(newVal) {
        if (newVal !== this._curHealth && newVal <= this._maxHealth) {
          this._curHealth = newVal;
          this._gameModelAdpt.onCurHealthChange(newVal);
        }
      }
    });

    Object.defineProperty(this, 'weapon', {
      get: function() {
        return this._weapon;
      },
      set: function(newVal) {
        if (newVal !== this._weapon) {
          this._weapon = newVal;
          this._gameModelAdpt.onWeaponChange(newVal);
        }
      }
    });

    Object.defineProperty(this, 'relics', {
      get: function() {
        return this._relics;
      },
      set: function(newVal) {
        if (newVal !== this._relics) {
          this._relics = newVal;
          this._gameModelAdpt.onRelicsChange(newVal);
        }
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

    Object.defineProperty(this, 'isTraitor', {
      value: false,
      writable: true
    });

    this._gameModelAdpt = null;
    this._room = room;

    this.installGameModelAdpt = installGameModelAdpt.bind(this);
    this.setPosition = setPosition.bind(this);
    this.destroy = destroy.bind(this);

    this._color = color;
    this._speed = 5;
    this._maxHealth = 3;
    this._curHealth = 3;
    this._weapon = 1;
    this._relics = 0;
  }
});
