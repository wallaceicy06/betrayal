define([
    'jquery',
    'underscore',
    'crafty',
    'templates',
    'view/MiniMap'
], function($, _, Crafty, Templates, MiniMap) {

  'use strict';

  var COLOR_TO_ROW = {
    'red' : 15,
    'blue' : 16,
    'green' : 17,
    'purple' : 18,
    'plant' : 21,
    'chair' : 22,
    'toilet' : 23,
    'key' : 24
  };
  var TILE_WIDTH = 32;
  var ASSETS = {
    'audio': {
        'powerup': ['sounds/powerup.wav'],
        'game_start': ['sounds/game_start.mp3'],
        'die': ['sounds/die.wav'],
        'thunder': ['sounds/thunder.mp3'],
        'slider': ['sounds/slider.mp3'],
        'tossed': ['sounds/tossed.mp3'],
        'pop': ['sounds/pop.wav'],
        'organ': ['sounds/organ.wav']
    },
    'sprites': {
      'images/game/sprites.png': {
        'tile': TILE_WIDTH,
        'tileh': TILE_WIDTH,
        'map': {'SpriteFurniture': [0,0],
                'SpriteGrayWall': [7, 13],
                'SpriteGreenWall': [8, 13],
                'SpriteDoor': [6,13],
                'SpriteLockedDoor': [10, 13],
                'SpriteWhiteRoom': [8, 13],
                'SpriteSpeedInc': [0, 14],
                'SpriteMaxHealth': [1, 14],
                'SpriteCurHealth': [2, 14],
                'SpriteWeapon': [6, 14],
                'SpriteRelic': [4, 14],
                'SpritePlayerRed': [0, COLOR_TO_ROW['red']],
                'SpritePlayerBlue': [0, COLOR_TO_ROW['blue']],
                'SpritePlayerGreen': [0, COLOR_TO_ROW['green']],
                'SpritePlayerPurple': [0, COLOR_TO_ROW['purple']]},
      },
      'images/game/fire_attack.png': {
        'tile': 160,
        'tileh': 160,
        'map': {
          'AttackSprite': [0, 0]
        }
      }
    }
  }

  var ROOM_TO_SPRITE = {
    'blue': 0,
    'black': 1,
    'yellow': 2,
    'green': 3
  };

  var ATTACK_DUR = 300; // in milliseconds
  var STAT_TEMPLATE = _.template('<img class="<%=imgClass%>">');
  var PLAYER_LIST_ITEM_TEMPLATE = 'assets/templates/playerlistitem.html';
  var OVERLAY_TEMPLATE = 'assets/templates/overlay.html';
  var OVERLAY_CHAT_TEMPLATE = 'assets/templates/overlay_chat.html';

  var MIN_DOOR_WAIT = 500;

  function installSpriteMap(sprites) {
    this._spriteMap = sprites;
  }

  function initCrafty() {
    var that = this;

    Crafty.c('PlayerHusk', {
      init: function() {
        this.requires('2D, Canvas, SpritePlayerRed, SpriteAnimation');

        this.reel('PlayerMovingRight',600, 0, 0, 1);
        this.reel('PlayerMovingUp',   600, 1, 0, 1);
        this.reel('PlayerMovingLeft', 600, 2, 0, 1);
        this.reel('PlayerMovingDown', 600, 3, 0, 1);

        this.animate('PlayerMovingRight', -1);
      },

      setSprite: function(spriteString) {
        var row = COLOR_TO_ROW[spriteString];
        this.sprite(0, row, 1, 1);
        this.reel('PlayerMovingRight',600, 0, row, 1);
        this.reel('PlayerMovingUp',   600, 1, row, 1);
        this.reel('PlayerMovingLeft', 600, 2, row, 1);
        this.reel('PlayerMovingDown', 600, 3, row, 1);

        return this;
      }

    });

    Crafty.c('Player', {
      init: function() {
        this.requires('PlayerHusk, Fourway, Collision');

        this.fourway(that._playerModelAdpt.getSpeed());

        this.onHit('Solid', this.stopMovement);
        this.onHit('Door', this.useDoor);
        this.onHit('Item', this.pickUpItem);
        this.onHit('HeroItem', this.pickUpHeroItem);

        this.bind('NewDirection', function(data) {
          if (data.x > 0) {
            this.animate('PlayerMovingRight', -1);
            that._playerModelAdpt.setDirection('east');
          } else if (data.x < 0) {
            this.animate('PlayerMovingLeft', -1);
            that._playerModelAdpt.setDirection('west');
          } else if (data.y > 0) {
            this.animate('PlayerMovingDown', -1);
            that._playerModelAdpt.setDirection('south');
          } else if (data.y < 0) {
            this.animate('PlayerMovingUp', -1);
            that._playerModelAdpt.setDirection('north');
          } else {
            this.pauseAnimation();
          }
        });

        this.bind('Moved', function(oldPosition) {
          that._playerModelAdpt.setPosition(this.x, this.y);
        });
      },

      stopMovement: function() {
        if (this._movement) {
          this.x -= this._movement.x;
          this.y -= this._movement.y;
        }
      },

      interact: function() {
        var player = this; /* the player */

        var interacted = false;
        Crafty('Furniture').each(function(f) {
          if (interacted) {
            return;
          }

          if (player.intersect(this.interactRect())) {
            interacted = that._gameModelAdpt.onFurnitureInteract(this.furnitureID);
          }
        });
      },

      useDoor: function(doorParts) {
        this.stopMovement();

        var curTime = new Date().getTime();
        if (curTime - that._lastDoorVisit < MIN_DOOR_WAIT) {
          return;
        }

        /* Player cannot move as they go through a door */
        this.disableControl();

        that._lastDoorVisit = curTime;


        var thatPlayer = this;

        that._gameModelAdpt.onDoorVisit(doorParts[0].obj.doorID, function() {
          thatPlayer.enableControl();
        });
      },

      pickUpItem: function(item) {
        var theItem = item[0].obj;

        if (theItem.itemLock === true) {
          return;
        }

        theItem.attr({'itemLock' : true});
        that._playerModelAdpt.useItem(theItem.itemID, theItem.stat,
                                      theItem.amount);
        Crafty.audio.play('powerup');

      },

      /* TODO: Change this later to two Player entities. */
      pickUpHeroItem: function(item) {
        if (that._playerModelAdpt.isTraitor()) {
          return this;
        }

        return this.pickUpItem(item);
      },


      fixMovement: function(increaseBy) {
        /* Increase absolute value of movement in both x and y by the amount
           speed was increased by because releasing a key decreases movement
           by speed, and we are increasing speed. Prevents weird gravity. */
        if(this._movement.x > 0) {
          this._movement.x = this._movement.x + increaseBy;
        }
        if(this._movement.x < 0) {
          this._movement.x = this._movement.x - increaseBy;
        }
        if(this._movement.y > 0) {
          this._movement.y = this._movement.y + increaseBy;
        }
        if(this._movement.y < 0) {
          this._movement.y = this._movement.y - increaseBy;
        }
      },

      /* Only called if this player is the traitor in the locked doors haunt.
         Returns the string doorID (direction) of the door or undefined
         if no door is found. */
      lockDoor: function() {
        var player = this; /* the player */
        var doorID;

        Crafty('Door').each(function(f) {
          if (player.intersect(this.interactRect())) {
            doorID = this.doorID;
          }
        });
        return doorID; //We did not find a door to lock
      }

    });

    Crafty.c('Attack', {
      init: function() {
        this.requires('2D, Canvas, AttackSprite, SpriteAnimation');
        this.reel('AttackAnimation', ATTACK_DUR, 0, 0, 5);
      },
    });

    Crafty.c('Item', {
      init: function() {
        this.requires('2D, Canvas, RoomItem, SpriteFurniture');
      },
    });

    Crafty.c('HeroItem', {
      init: function() {
        this.requires('2D, Canvas, RoomItem, SpriteFurniture');
      },
    });

    Crafty.c('Wall', {
      init: function() {
        this.requires('2D, Canvas, Solid, RoomItem');
      }
    });

    Crafty.c('Interactable', {
      interactRect: function() {
        var mbr = this.mbr();

        return {
          x: mbr._x - 1 * TILE_WIDTH,
          y: mbr._y - 1 * TILE_WIDTH,
          w: mbr._w + 2 * TILE_WIDTH,
          h: mbr._h + 2 * TILE_WIDTH
        };
      }
    });

    Crafty.c('Door', {
      init: function() {
        this.requires('2D, Canvas, SpriteDoor, RoomItem, Interactable');
      }
    });

    Crafty.c('LockedDoor', {
      init: function() {
        this.requires('Door, SpriteLockedDoor');
      }
    });

    Crafty.c('Furniture', {
      init: function() {
        this.requires('2D, Canvas, RoomItem, SpriteFurniture, Interactable');
      }
    });

    Crafty.c('SolidFurniture', {
      init: function() {
        this.requires('Furniture, Solid');
      }
    });

    Crafty.c('Chair', {
      init: function() {
        this.requires('Furniture, SpriteChair');
      }
    });

    Crafty.c('MapRoom', {
      init: function() {
        this.requires('2D, Canvas, SpriteWhiteRoom');
      },
    });

    Crafty.c('OverlayText', {
      init: function() {
        this.requires('HTML');
      },

      setText: function(text) {
        this.replace('<p>' + text + '</p>');
        return this;
      }
    });

    Crafty.c('OverlayTitle', {
      init: function() {
        this.requires('OverlayText');
      }
    });

    Crafty.c('OverlayFlavor', {
      init: function() {
        this.requires('OverlayText');
      }
    });

    Crafty.c('OverlayBody', {
      init: function() {
        this.requires('OverlayText');
      }
    });

    Crafty.c('Overlay', {
      init: function() {
        this.requires('2D, HTML, Color');
        this.color('white');
        this.attr({dismissable: true});
      },

      dismiss: function() {
        if (this.dismissable) {
          this.destroy();
        }

        that._player.enableControl();

        return this;
      },

      setDismiss: function(canDismiss, cb) {
        this.attr({dismissable: canDismiss});
        this.bind('Remove', cb);
        return this;
      },

      setText: function(titleText, flavorText, bodyText) {
        this.attr({x: that._gameModelAdpt.getDimensions().width/2 - 175,
                   y: that._gameModelAdpt.getDimensions().height/2 - 175,
                   w: 350,
                   h: 350});

        var overlayTitle = Crafty.e('OverlayTitle').setText(titleText);
        var overlayFlavor = Crafty.e('OverlayFlavor').setText(flavorText);
        var overlayBody = Crafty.e('OverlayBody').setText(bodyText);

        this.attach(overlayTitle);
        this.attach(overlayFlavor);
        this.attach(overlayBody);

        return this;
      }
    });

    Crafty.init(that._gameModelAdpt.getDimensions().width,
                that._gameModelAdpt.getDimensions().height,
                document.getElementById('game-stage'));

    Crafty.load(ASSETS, function() {
    });

    Crafty.defineScene('purgatory', function() {
      Crafty.background('black');

      var waitImage = Crafty.e('2D, Canvas, Image')
        .image("images/game/wait_screen.png")
        .attr({x: 576/2 - 200, y: 512/2 - 200, w: 400, h: 400});

    });

    Crafty.defineScene('room', function(roomConfig) {
      Crafty.background(roomConfig.background);

      setupBarriers.call(that, roomConfig.doors, roomConfig.wallSprite);
      placeItems.call(that, roomConfig.items);
      placeFurniture.call(that, roomConfig.furniture);

      var oldPlayerEntity = that._player;

      /* Sets the player location and re-allows door usage. */
      that._player = Crafty.e('Player').attr({x: that._playerModelAdpt.getX(),
                                              y: that._playerModelAdpt.getY(),
                                              doorLock: false})
                                       .setSprite(that._playerModelAdpt
                                                     .getSprite());
      if (oldPlayerEntity !== null) {
        that._player.animate(oldPlayerEntity.getReel().id, -1);
      }

      for (var id in that._otherPlayerModelAdpts) {
        var otherPlayer = that._otherPlayerModelAdpts[id];
        if (otherPlayer.getRoom() == that._playerModelAdpt.getRoom()) {
          makePlayerHusk.call(that, otherPlayer.getID(),
                              otherPlayer.getX(),
                              otherPlayer.getY(),
                              otherPlayer.getSprite());
        }
      }


      if (roomConfig.event !== undefined && roomConfig.event !== -1) {
        /*
         * performEvent does the action of the event and returns the text to
         * display.
         */
        var eventInfo = that._gameModelAdpt.performEvent(roomConfig.event);
        displayTextOverlay.call(that, eventInfo.title, eventInfo.flavorText, eventInfo.text, 5000);
      }
    });

    Crafty.bind('KeyDown', function(e) {
      var inputInFocus = $('input').is(':focus');

      if (!inputInFocus) {
        switch (e.key) {
          case Crafty.keys.SPACE:
            that._gameModelAdpt.attack();
            break;

          /* Forward slash */
          case 191:
            /*
             * This timeout is to prevent the letter 'c' from being typed in
             * the chat box since this event will be handled by it as soon as
             * the box becomes in focus.
             */
            setTimeout(function() {
              that._player.disableControl();
              $('#omni-box').fadeIn();
              $('#ipt-message').focus();
            }, 10);
            break;

          case Crafty.keys.F:
            that._player.interact();
            break;

          case Crafty.keys.E:

            that._gameModelAdpt.useTraitorPower();
            break;

          default:
        }
      } else {
        switch(e.key) {
          case Crafty.keys.ESC:


            /* Focuses the game div. */
            window.location.hash = '#game-stage';

            /* De-focuses all input elements. */
            $('input').blur();

            that._player.enableControl();
            break;

          default:
            break;
        }
      }
    });
  }

  function start() {
    this._gameModelAdpt.fetchGames();
  }

  function goToBeginningOptions() {
    displayJoinExisting.call(this, false);
    displayJoinNew.call(this, false);
    displayJoinOptions.call(this, true);
  }

  function displayStartGameButton(display) {
    if (display == true) {
      $('#game-start').removeClass('hidden');
    } else {
      $('#game-start').addClass('hidden');
    }
  }

  function displayJoinOptions(display) {
    if (display === true) {
      $('#join-options').removeClass('hidden');
    } else {
      $('#join-options').addClass('hidden');
    }
  }

  function displayJoinExisting(display) {
    if (display === true) {
      $('#form-join-existing').removeClass('hidden');
    } else {
      $('#form-join-existing').addClass('hidden');
    }
  }

  function displayJoinNew(display) {
    if (display === true) {
      $('#form-join-new').removeClass('hidden');
    } else {
      $('#form-join-new').addClass('hidden');
    }
  }

  function reset() {
    $('#player-list').empty();
    $('#message-list').empty();
    displayGamePane.call(this, false);
    this._miniMap.reset();
  }

  function displayGamePane(display) {
    if (display === true) {
      $('#game-pane').removeClass('hidden');
      $('#header').removeClass('hidden');
      $('#join-pane').addClass('hidden');
      $('#splash-screen').addClass('hidden');
    } else {
      Crafty.audio.stop();
      goToBeginningOptions.call(this);
      $('#game-pane').addClass('hidden');
      $('#header').addClass('hidden');
      $('#join-pane').removeClass('hidden');
      $('#splash-screen').removeClass('hidden');
    }
  }

  function enableGame(enable) {
    displayStartGameButton.call(this, false);
    Crafty.audio.stop();
    Crafty.audio.play('slider', -1);
  }

  function loadPurgatory() {
    Crafty.audio.play('tossed', -1);
    Crafty.enterScene('purgatory');
  }

  function loadRoom(roomConfig) {
    Crafty.enterScene('room', roomConfig);
  }

  function loadMap(allRooms) {
    this._miniMap.drawMap(allRooms, this._playerModelAdpt.getRoom());
  }

  function placeItem(item) {
    var type = (item.heroesOnly ? 'HeroItem' : 'Item');

    var newItem = Crafty.e(type).attr({ x: item.gridX * TILE_WIDTH,
                                        y: item.gridY * TILE_WIDTH,
                                        type: item.type,
                                        stat: item.stat,
                                        amount: item.amount,
                                        itemID: item.id})
                                .sprite(this._spriteMap[item.type].gridX,
                                        this._spriteMap[item.type].gridY,
                                        this._spriteMap[item.type].gridW,
                                        this._spriteMap[item.type].gridH);

    this._items[item.id] = newItem;
  }

  function placeItems(items) {
    var that = this;

    _.each(items, function(i) {
      placeItem.call(that, i);
    });
  }

  function placeFurniture(furniture) {
    var that = this;

    _.each(_.keys(furniture), function(k) {
      var furnConfig = furniture[k];

      var newFurniture;
      if (furnConfig.solid) {
        newFurniture = Crafty.e('SolidFurniture');
      } else {
        newFurniture = Crafty.e('Furniture');
      }

      newFurniture.attr({x: furnConfig.gridX * TILE_WIDTH,
                         y: furnConfig.gridY * TILE_WIDTH,
                         w: that._spriteMap[furnConfig.type].gridW
                            * TILE_WIDTH,
                         h: that._spriteMap[furnConfig.type].gridH
                            * TILE_WIDTH,
                         furnitureID: k})
                  .sprite(that._spriteMap[furnConfig.type].gridX,
                          that._spriteMap[furnConfig.type].gridY,
                          that._spriteMap[furnConfig.type].gridW,
                          that._spriteMap[furnConfig.type].gridH)
      newFurniture.rotation = furnConfig.rotation;
    });
  }

  function makePlayerView(playerModelAdpt) {
    var that = this;

    this._playerModelAdpt = playerModelAdpt;

    this._player = Crafty.e('Player');
    this._player.setSprite(this._playerModelAdpt.getSprite());

    addPlayerToList.call(this, playerModelAdpt);
    $('#' + playerModelAdpt.getID() + '.player-list-item').addClass('my-stats');

    return {
      destroy: function() {
        $('#' + playerModelAdpt.getID() + '.player-list-item').remove();

        Crafty.audio.play('die');
      },

      setRelics: function(newRelics) {
        $('#' + playerModelAdpt.getID() + '.player-list-item')
          .find('div.player-relics img').each(function(index) {
            if (index < newRelics) {
              $(this).removeClass('invisible');
            } else {
              $(this).addClass('invisible');
            }
          });
      },

      setKeys: function(newKeys) {
        $('#' + playerModelAdpt.getID() + '.player-list-item')
          .find('div.player-keys img').each(function(index) {
            if (index < newKeys) {
              $(this).removeClass('invisible');
            } else {
              $(this).addClass('invisible');
            }
          });
      },

      setWeapon: function(newWeapon) {
        $('#' + playerModelAdpt.getID() + '.player-list-item')
          .find('div.player-weapon img').each(function(index) {
            if (index < newWeapon) {
              $(this).removeClass('invisible');
            } else {
              $(this).addClass('invisible');
            }
          });
      },

      setCurHealth: function(newCurHealth) {
        $('#' + playerModelAdpt.getID() + '.player-list-item')
          .find('div.player-health img').each(function(index) {
            if (index < newCurHealth) {
              $(this).removeClass('empty_heart');
              $(this).addClass('full_heart');
            } else {
              $(this).removeClass('full_heart');
              $(this).addClass('empty_heart');
            }
          });
      },

      setMaxHealth: function(newMaxHealth) {
        $('#' + playerModelAdpt.getID() + '.player-list-item')
          .find('div.player-health img').each(function(index) {
            if (index < newMaxHealth) {
              $(this).removeClass('invisible');
            } else {
              $(this).addClass('invisible');
            }
          });
      },

      setSpeed: function(newSpeed) {
        that._player.speed({x: newSpeed, y: newSpeed});

        $('#' + playerModelAdpt.getID() + '.player-list-item')
          .find('div.player-speed img').each(function(index) {
            if (index < newSpeed) {
              $(this).removeClass('invisible');
            } else {
              $(this).addClass('invisible');
            }
          });
      },

      fixMovement: function(increaseBy) {
        that._player.fixMovement(increaseBy);
      },

      lockDoor: function() {
        return that._player.lockDoor();
      }
    }
  }

  function addPlayerToList(playerModelAdpt) {

    var rendered = Templates[PLAYER_LIST_ITEM_TEMPLATE]({ id: playerModelAdpt.getID(),
                                                          name: playerModelAdpt.getName(),
                                                          color: playerModelAdpt.getColor(),
                                                          curHealth: playerModelAdpt.getCurHealth(),
                                                          maxHealth: playerModelAdpt.getMaxHealth(),
                                                          speed: playerModelAdpt.getSpeed(),
                                                          weapon: playerModelAdpt.getWeapon(),
                                                          relics: playerModelAdpt.getRelics(),
                                                          keys: playerModelAdpt.getKeys()
    });

    $('#player-list').append(rendered);
  }

  function makePlayerHusk(id, x, y, sprite) {
     if (Crafty._current === 'room') {
       var husk = Crafty.e('PlayerHusk').attr({x: x, y: y});
       husk.setSprite(sprite);
       this._husks[id] = husk;
     }
   }

  function addOtherPlayer(playerModelAdpt) {
    var that = this;

    this._otherPlayerModelAdpts[playerModelAdpt.getID()] = playerModelAdpt;

    var playerListItem = addPlayerToList.call(this, playerModelAdpt);

    /*
     * TODO maybe make an actual view code thing for this?
     */
    return {
      destroy: function() {
        removeHusk.call(that, playerModelAdpt.getID());
        delete that._otherPlayerModelAdpts[playerModelAdpt.getID()];
        $('#' + playerModelAdpt.getID() + '.player-list-item').remove();

        Crafty.audio.play('die');
      },

      setRelics: function(newRelics) {
        $('#' + playerModelAdpt.getID() + '.player-list-item')
          .find('div.player-relics img').each(function(index) {
            if (index < newRelics) {
              $(this).removeClass('invisible');
            } else {
              $(this).addClass('invisible');
            }
          });
      },

      setKeys: function(newKeys) {
        $('#' + playerModelAdpt.getID() + '.player-list-item')
          .find('div.player-keys img').each(function(index) {
            if (index < newKeys) {
              $(this).removeClass('invisible');
            } else {
              $(this).addClass('invisible');
            }
          });
      },

      setWeapon: function(newWeapon) {
        $('#' + playerModelAdpt.getID() + '.player-list-item')
          .find('div.player-weapon img').each(function(index) {
            if (index < newWeapon) {
              $(this).removeClass('invisible');
            } else {
              $(this).addClass('invisible');
            }
          });
      },

      setCurHealth: function(newCurHealth) {
        $('#' + playerModelAdpt.getID() + '.player-list-item')
          .find('div.player-health img').each(function(index) {
            if (index < newCurHealth) {
              $(this).removeClass('empty_heart');
              $(this).addClass('full_heart');
            } else {
              $(this).removeClass('full_heart');
              $(this).addClass('empty_heart');
            }
          });
      },

      setMaxHealth: function(newMaxHealth) {
        $('#' + playerModelAdpt.getID() + '.player-list-item')
          .find('div.player-health img').each(function(index) {
            if (index < newMaxHealth) {
              $(this).removeClass('invisible');
            } else {
              $(this).addClass('invisible');
            }
          });
      },

      setSpeed: function(newSpeed) {
        $('#' + playerModelAdpt.getID() + '.player-list-item')
          .find('div.player-speed img').each(function(index) {
            if (index < newSpeed) {
              $(this).removeClass('invisible');
            } else {
              $(this).addClass('invisible');
            }
          });
      },

      setLocation: function(newX, newY) {
        var husk = that._husks[playerModelAdpt.getID()];

        /* Don't try to change location for a husk that doesn't exist. */
        if (husk === undefined) {
          return;
        }

        var oldX = husk.x;
        var oldY = husk.y;

        var deltaX = newX - oldX;
        var deltaY = newY - oldY;

        if (Math.abs(deltaX) >= Math.abs(deltaY)) {
          if (deltaX > 0) {
            husk.animate('PlayerMovingRight', -1);
          } else if (deltaX < 0) {
            husk.animate('PlayerMovingLeft', -1);
          }
        } else {
          if (deltaY > 0) {
            husk.animate('PlayerMovingDown', -1);
          } else if (deltaY < 0) {
            husk.animate('PlayerMovingUp', -1);
          }
        }

        husk.attr({x: newX, y: newY});
      },

      setVisibility: function(visible) {
        if (visible === true) {
          makePlayerHusk.call(that, playerModelAdpt.getID(),
                              playerModelAdpt.getX(), playerModelAdpt.getY(),
                              playerModelAdpt.getSprite());
        } else {
          removeHusk.call(that, playerModelAdpt.getID());
        }
      }
    }
  }

  function removeAllHusks() {
    for (var key in this._husks) {
      /* Destroy Crafty entity. */
      this._husks[key].destroy();
    }
    this._husks = {};
  }

  function removeHusk(id) {
    if (this._husks[id] !== undefined) {
      this._husks[id].destroy();
      delete this._husks[id];
    }
  }

  function setHuskSprite(id, newSprite) {
    if (this._husks[id] !== undefined) {
      this._husks[id].setSprite(newSprite);
    }
  }

  function changePlayerSprite(spriteName) {
    var reel = this._player.getReel().id;
    this._player.setSprite(spriteName);
    /* TODO: Find a non-jank way to do this.
       The player reel wasn't being changed because it was
       always the same as the current reel. By changing it
       to right, it will actually set the reel properly,
       unless trying to set it to right, but that's the default. */
    this._player.reel('PlayerMovingRight');
    this._player.reel(reel);
    this._playerModelAdpt.setSprite(spriteName);
  }

  function removeItem(itemID) {
    if(itemID in this._items) {
      this._items[itemID].destroy();
      delete this._items[itemID];
    }
  }

  function attackAnimation(locX, locY) {
    var attack = Crafty.e('Attack')
      .attr({x: locX - TILE_WIDTH*2, y: locY - TILE_WIDTH*2});
    attack.animate('AttackAnimation', 1);
    var that = this;
    setTimeout(function() {
      attack.destroy();
    }, ATTACK_DUR);
  }

  function addGameOption(game) {
    var gameOptions = document.getElementById('select-game');

    gameOptions.options.add(new Option(game.name, game.id));

    document.getElementById('btn-join').disabled = false;
  }

  function setGameOptions(games) {
    var gameOptions = document.getElementById('select-game');

    /* Clear the game options combo box. */
    gameOptions.length = 0;

    if (games.length > 0) {
      document.getElementById('btn-join').disabled = false;
    } else {
      document.getElementById('btn-join').disabled = true;
    }

    games.forEach(function(v, i, a) {
      addGameOption.call(this, v);
    });
  }

  function setupBarriers(gateways, wallSprite) {
    var widthInTiles = this._gameModelAdpt.getDimensions().width/TILE_WIDTH;
    var heightInTiles = this._gameModelAdpt.getDimensions().height/TILE_WIDTH;

    console.log(gateways);

    for (var j = 0; j < widthInTiles; j++) {
      if(!('north' in gateways
           && (j == widthInTiles/2 || j == widthInTiles/2-1))) {

        Crafty.e('Wall', wallSprite).attr({x: j * TILE_WIDTH, y: 0});
      } else {
        var door;

        if (gateways.north.locked) {
          door = Crafty.e('LockedDoor');
        } else {
          door = Crafty.e('Door');
        }

        door.attr( {x: j * TILE_WIDTH, y: 0, doorID: 'north' });
      }

      if(!('south' in gateways
           && (j == widthInTiles/2 || j == widthInTiles/2-1))) {
        Crafty.e('Wall', wallSprite).attr({x: j * TILE_WIDTH,
                               y: (heightInTiles - 1) * TILE_WIDTH});
      } else {
        var door;

        if (gateways.south.locked) {
          door = Crafty.e('LockedDoor');
        } else {
          door = Crafty.e('Door');
        }

        door.attr({ x: j * TILE_WIDTH,
                    y: (heightInTiles - 1) * TILE_WIDTH,
                    doorID: 'south' });
      }
    }

    for (var i = 0; i < heightInTiles; i++) {
      if(!('west' in gateways
           && (i == heightInTiles/2 || i == heightInTiles/2-1))) {

        Crafty.e('Wall', wallSprite).attr({x: 0,
                               y: i * TILE_WIDTH});
      } else {
        var door;

        if (gateways.west.locked) {
          door = Crafty.e('LockedDoor');
        } else {
          door = Crafty.e('Door');
        }

        door.attr({ x: 0, y: i * TILE_WIDTH, doorID: 'west' });
      }

      if(!('east' in gateways
           && (i == heightInTiles/2 || i == heightInTiles/2-1))) {

        Crafty.e('Wall', wallSprite).attr({x: (widthInTiles - 1) * TILE_WIDTH,
                               y: i * TILE_WIDTH});
      } else {
        var door;

        if (gateways.east.locked) {
          door = Crafty.e('LockedDoor');
        } else {
          door = Crafty.e('Door');
        }

        door.attr({ x: (widthInTiles - 1) * TILE_WIDTH,
                    y: i * TILE_WIDTH,
                    doorID: 'east' });
      }
    }

  }

  function appendChatMessage(player, message) {
    var chatOverlay = $(Templates[OVERLAY_CHAT_TEMPLATE]({ name: player.name,
                                                           color: player.color,
                                                           message: message
    }));

    $('#chat-stack').append(chatOverlay);

    chatOverlay.fadeIn('slow');
    setTimeout(function() {
      chatOverlay.fadeOut('slow', function() {this.remove()});
    }, 2500);
  }

  /**
   * Display a title and text for the given amount of time as an overlay
   * Disable player movement while text is being displayed
   * (Used for events, death, etc.)
   * timeout must be in ms
   */
  function displayTextOverlay(titleText, flavorText, bodyText, timeout,
                              dismissable, cb) {
    var that = this;

    var secondsLeft = timeout / 1000;

    var overlay = $(Templates[OVERLAY_TEMPLATE]({ title: titleText,
                                                  flavor: flavorText,
                                                  body: bodyText,
                                                  dismissable: dismissable,
                                                  seconds: secondsLeft}));

   var existingDismissable = $('#overlay-stack .dismissable');

    existingDismissable.fadeOut('fast', function() {
      this.remove();
      $('#overlay-stack').append(overlay);
      overlay.fadeIn('slow');
    });

    if (existingDismissable.length == 0) {
      $('#overlay-stack').append(overlay);
      overlay.fadeIn('slow');
    }

    setTimeout(function() {
      overlay.fadeOut('slow', function() {this.remove()});
    }, timeout + 3000);

    if (secondsLeft > 0) {
      that._player.disableControl();

      $('#game-stage').fadeTo('fast', 0.2);
      var timer = setInterval(function() {
        secondsLeft--;
        that._player.disableControl();
        overlay.find('.seconds').text(secondsLeft);

        if (secondsLeft <= 0) {
          overlay.children('.countdown').fadeOut();
          $('#game-stage').fadeTo('fast', 1);
          that._player.enableControl();
          clearInterval(timer);
          cb();
        }
      }, 1000);
    }
  }

  function playSound(sound) {
    Crafty.audio.play(sound);
  }

  function onHauntStart() {
    /* Hide relics, show keys */
    $('.player-relics').addClass('hidden');
    $('.player-keys').removeClass('hidden');
    /* Play thunder sound */
    Crafty.audio.play('thunder');
  }

  function formToJSON(inputArray) {
    var formData = {};
    _.map(inputArray, function(i) {
      formData[i.name] = i.value;
    });

    return formData;
  }

  function initGUI() {
    var that = this;

    this._miniMap = new MiniMap({
      getMiniMapID: function() {
        return 'mini-map';
      },

      getPlayerAdpt: function() {
        return that._playerModelAdpt;
      },

      getOtherPlayerAdpts: function() {
        return that._otherPlayerModelAdpts;
      },
    });

    document.getElementById('btn-goto-new').addEventListener('click', function() {
      displayJoinOptions.call(that, false);
      displayJoinNew.call(that, true);
    });

    document.getElementById('btn-goto-existing').addEventListener('click', function() {
      displayJoinOptions.call(that, false);
      displayJoinExisting.call(that, true);
    });

    $('#form-join-new').submit(function(e) {
      event.preventDefault();

      var formData = formToJSON($(this).serializeArray());

      displayStartGameButton.call(this, true);

      if (formData.playerName === '') {
        $(this).children('.alert').text('Player name cannot be blank.').removeClass('invisible');
        return;
      }

      if (formData.gameName === '') {
        $(this).children('.alert').text('Game name cannot be blank.').removeClass('invisible');
        return;
      }

      $(this).children('.alert').addClass('invisible');

      that._gameModelAdpt.onCreateGameClick(formData.playerName, formData.gameName);
    });

    $('#form-join-existing').submit(function(e) {
      event.preventDefault();

      var formData = formToJSON($(this).serializeArray());

      displayStartGameButton.call(this, false);

      if (formData.playerName === '') {
        $(this).children('.alert').text('Player name cannot be blank.').removeClass('invisible');
        return;
      }

      if (formData.gameID === undefined) {
        $(this).children('.alert').text('You must select a game.').removeClass('invisible');
        return;
      }

      $(this).children('.alert').addClass('invisible');

      that._gameModelAdpt.onJoinClick(formData.playerName, formData.gameID);

    });

    $('#ipt-message').focusout(function(e) {
      $('#omni-box').fadeOut();
      $('#game-stage').focus();
    });

    $('#form-send-message').submit(function(e) {
      event.preventDefault();

      $('#omni-box').fadeOut();
      $('#game-stage').focus();

      var formData = formToJSON($(this).serializeArray());
      $(this)[0].reset();

      that._gameModelAdpt.onSendChatMessage(formData.message);

    });

    document.getElementById('btn-game-start').addEventListener('click', function() {
      that._gameModelAdpt.onStartGameClick();
    });

    document.getElementById('btn-game-leave').addEventListener('click', function() {
      that._gameModelAdpt.onLeaveGameClick();
    });

    $('.options-sound label').click(function() {
      var selected = $(this).children('input').attr('id');

      if (selected === 'ipt-soundon') {
        Crafty.audio.unmute();
      } else if (selected === 'ipt-soundoff') {
        Crafty.audio.mute();
      }
    });

    /* Prevent default actions for arrow keys. */
    window.addEventListener("keydown", function(e) {
        if([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
    }, false);

    $('button.cancel').each(function(index, value) {
      value.onclick = goToBeginningOptions.bind(this);
    });

    $('#ipt-message').each(function(index, value) {
      value.onfocus = function() {
        that._player.disableControl();
      }

      value.onblur = function() {
        that._player.enableControl();
      }
    });

    $('.options-sound .btn').click(function() {
      var selection = $(this).children('input').attr('id');

      if (selection === 'ipt-soundon') {
        Crafty.audio.unmute();
      } else if (selection === 'ipt-soundoff') {
        Crafty.audio.mute();
      }
    });

    // Only show the GUI after the document has loaded.
    // $(document).ready(function() {
      // $('div.main').removeClass('hidden');
    // });
  }

  return function GameView(gameModelAdpt) {
    this._gameModelAdpt = gameModelAdpt;
    this._player = null;
    this._playerModelAdpt = null;
    this._otherPlayerModelAdpts = {};
    this._husks = {};
    this._items = {};
    this._spriteMap = null;
    this._miniMap = null;
    this._lastDoorVisit = new Date().getTime();

    initGUI.call(this);
    initCrafty.call(this);

    this.addOtherPlayer = addOtherPlayer.bind(this);
    this.appendChatMessage = appendChatMessage.bind(this);
    this.attackAnimation = attackAnimation.bind(this);
    this.changePlayerSprite = changePlayerSprite.bind(this);
    this.displayGamePane = displayGamePane.bind(this);
    this.enableGame = enableGame.bind(this);
    this.displayTextOverlay = displayTextOverlay.bind(this);
    this.onHauntStart = onHauntStart.bind(this);
    this.installSpriteMap = installSpriteMap.bind(this);
    this.loadPurgatory = loadPurgatory.bind(this);
    this.loadRoom = loadRoom.bind(this);
    this.loadMap = loadMap.bind(this);
    this.makePlayerView = makePlayerView.bind(this);
    this.playSound = playSound.bind(this);
    this.placeItem = placeItem.bind(this);
    this.removeAllHusks = removeAllHusks.bind(this);
    this.removeItem = removeItem.bind(this);
    this.reset = reset.bind(this);
    this.addGameOption = addGameOption.bind(this);
    this.setGameOptions = setGameOptions.bind(this);
    this.setHuskSprite = setHuskSprite.bind(this);
    this.start = start.bind(this);
  }

});
