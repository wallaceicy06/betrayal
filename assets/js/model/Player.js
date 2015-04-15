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

  function useItem(itemID, stat, amount) {
    var that = this;

    this._gameModelAdpt.acquireItem(itemID, function() {
      switch(stat) {
        case 'speed':
          that.speed = Math.max(0, that.speed + amount);
          break;
        case 'maxHealth':
          that.maxHealth = Math.max(0, that.maxHealth + amount);
          that.curHealth = Math.min(that.curHealth, that.maxHealth);
          break;
        case 'curHealth':
          that.curHealth = Math.max(0, that.curHealth + amount);
          break;
        case 'weapon':
          that.weapon = Math.max(0, that.weapon + amount);
          break;
        case 'relics':
          that.relics = that.relics + amount;
          break;
        case 'keys':
          that.keys = that.keys + amount;
          break;
        default:
          console.log('Unknown stat: ' + stat);
          break;
      }
    });
  }

  function lockDoor() {
    return this._gameModelAdpt.lockDoor();
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

    Object.defineProperty(this, 'sprite', {
      get: function() {
        return this._sprite;
      },
      set: function(newSprite) {
        this._sprite = newSprite;
      }
    });

    Object.defineProperty(this, 'speed', {
      get: function() {
        return this._speed;
      },
      set: function(newSpeed) {
        if (newSpeed !== this._speed && newSpeed <= this._MAX_STAT) {
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
        if (newVal !== this._maxHealth && newVal <= this._MAX_STAT) {
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
        if (newVal !== this._weapon && newVal <= this._MAX_STAT) {
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

    Object.defineProperty(this, 'keys', {
      get: function() {
        return this._keys;
      },
      set: function(newVal) {
        if (newVal !== this._keys) {
          this._keys = newVal;
          this._gameModelAdpt.onKeysChange(newVal);
        }
      }
    })

    Object.defineProperty(this, 'x', {
      value: initPos.x,
      writable: true
    });

    Object.defineProperty(this, 'y', {
      value: initPos.y,
      writable: true
    });

    Object.defineProperty(this, 'direction', {
      get: function() {
        return this._direction;
      },
      set: function(newDirection) {
        if (newDirection !== this._direction) {
          this._direction = newDirection;
          this._gameModelAdpt.onDirectionChange(newDirection);
        }
      }
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
      get: function() {
        return this._isTraitor;
      },
      set: function(newVal) {
        if (newVal !== this._isTraitor) {
          this._isTraitor = newVal;
          this._gameModelAdpt.onTraitorSet(newVal);
        }
      }
    });

    this._gameModelAdpt = null;
    this._room = room;

    this.installGameModelAdpt = installGameModelAdpt.bind(this);
    this.setPosition = setPosition.bind(this);
    this.destroy = destroy.bind(this);
    this.useItem = useItem.bind(this);
    this.lockDoor = lockDoor.bind(this);

    this._sprite = color; //Initially sprite is the same as color
    this._isTraitor = false;
    this._speed = 5;
    this._maxHealth = 3;
    this._curHealth = 3;
    this._weapon = 1;
    this._relics = 0;
    this._keys = 0;
    this._MAX_STAT = 7; // maximum for each stat (limited by image size in side panel)
  }
});
