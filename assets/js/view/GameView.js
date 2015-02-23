define([
    'jquery',
    'crafty',
    'view/SpriteMap',
], function($, Crafty, SpriteMap) {

  'use strict';

  var TILE_WIDTH = 32;
  var ASSETS = {
    'sprites': {
      'images/game/player_sprites.png': {
        'tile': TILE_WIDTH,
        'tileh': TILE_WIDTH,
        'map': {'SpritePlayerRed': [0, 0],
                'SpritePlayerBlue': [0, 1],
                'SpritePlayerGreen': [0, 2]},
      },
      'images/game/wall.png': {
        'tile': TILE_WIDTH,
        'tileh': TILE_WIDTH,
        'map': {'SpriteWall': [0, 0]}
      },
      'images/game/door.png': {
      'tile': TILE_WIDTH,
      'tileh': TILE_WIDTH,
      'map': {'SpriteDoor': [0,0]}
      },
      'images/game/item_sprites.png': {
        'tile': TILE_WIDTH,
        'tileh': TILE_WIDTH,
        'map': {'SpriteSpeedInc': [0, 0],
                'SpriteMaxHealth': [1, 0],
                'SpriteCurHealth': [2, 0],
                'SpriteWeapon': [3, 0],
                'SpriteRelic': [4, 0]},
      },
      'images/game/map_rooms.png' : {
        'tile': TILE_WIDTH,
        'tileh': TILE_WIDTH,
        'map': {'SpriteBlueRoom': [0,0],
                'SpriteWhiteRoom': [0,1],
                'SpriteYellowRoom': [0,2],
                'SpriteGreenRoom': [0,3]}
      },
      'images/game/chair.png' : {
        'tile': TILE_WIDTH,
        'tileh': TILE_WIDTH,
        'map': {'SpriteChair': [0,0]}
      },
      'images/game/furniture.png' : {
        'tile': TILE_WIDTH,
        'tileh': TILE_WIDTH,
        'map': {'SpriteFurniture': [0,0]}
      }
    }
  }

  var COLOR_TO_ROW = {
    'red' : 0,
    'blue' : 1,
    'green' : 2
  };

  var ROOM_TO_SPRITE = {
    'blue': 0,
    'black': 1,
    'yellow': 2,
    'green': 3
  };

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

      setColor: function(colorString) {
        console.log("Changing player color to " + colorString);
        var row = COLOR_TO_ROW[colorString];
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

        this.bind('NewDirection', function(data) {
          if (data.x > 0) {
            this.animate('PlayerMovingRight', -1);
          } else if (data.x < 0) {
            this.animate('PlayerMovingLeft', -1);
          } else if (data.y > 0) {
            this.animate('PlayerMovingDown', -1);
          } else if (data.y < 0) {
            this.animate('PlayerMovingUp', -1);
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

      useDoor: function(doorParts) {
        /*
         * If the door lock has been enabled, this will prevent a door from
         * being used twice for the same room.
         */
        if (this.attr('doorLock')) {
          console.log('the lock prevented a double move');
          return;
        }

        that._gameModelAdpt.onDoorVisit(doorParts[0].obj.doorID);

        /* Lock the door to prevent double usages. */
        this.attr({'doorLock': true});

        /* Player cannot move as they go through a door */
        this.disableControl();
      },

      pickUpItem: function(item) {
        if (this.attr('itemLock')) {
          return;
        }
        this.attr({'itemLock' : true});
        var thisPlayer = this;
        switch(item[0].obj.type) {
          case "SpeedInc":
            var increaseBy = item[0].obj.amount;

            that._playerModelAdpt.onSpeedIncClick(increaseBy);
            /* I don't think a fixMovement is necessary here anymore b/c it is
               called in playerViewAdpt made in GameController */
            break;
          default:
            that._playerModelAdpt.useItem(item[0].obj.stat, item[0].obj.amount);
        }
        io.socket.delete('/item/' + item[0].obj.itemID, {}, function(data) {
          thisPlayer.attr({'itemLock': false});
        });
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
      }

    });

    Crafty.c('Item', {
      init: function() {
        this.requires('2D, Canvas, RoomItem');
      }
    });

    Crafty.c('SpeedInc', {
      init: function() {
        this.requires('Item, SpriteSpeedInc');
      }
    });

    Crafty.c('MaxHealth', {
      init: function() {
        this.requires('Item, SpriteMaxHealth');
      }
    });

    Crafty.c('CurHealth', {
      init: function() {
        this.requires('Item, SpriteCurHealth');
      }
    });

    Crafty.c('Weapon', {
      init: function() {
        this.requires('Item, SpriteWeapon');
      }
    });

    Crafty.c('Relic', {
      init: function() {
        this.requires('Item, SpriteRelic');
      }
    });

    Crafty.c('Wall', {
      init: function() {
        this.requires('2D, Canvas, Solid, SpriteWall, RoomItem');
      }
    });

    Crafty.c('Door', {
      init: function() {
        this.requires('2D, Canvas, SpriteDoor, RoomItem');
      }
    });

    Crafty.c('Furniture', {
      init: function() {
        this.requires('2D, Canvas, RoomItem, Solid, SpriteFurniture');
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

    Crafty.init(that._gameModelAdpt.getDimensions().width,
                that._gameModelAdpt.getDimensions().height,
                document.getElementById('game-stage'));

    Crafty.load(ASSETS, function() {
    });

    Crafty.defineScene('room', function(roomConfig) {
      Crafty.background(roomConfig.background);

      setupBarriers.call(that, roomConfig.doors);
      placeItems.call(that, roomConfig.items);
      placeFurniture.call(that, roomConfig.furniture);

      var oldPlayerEntity = that._player;

      /* Sets the player location and re-allows door usage. */
      that._player = Crafty.e('Player').attr({x: that._playerModelAdpt.getX(),
                                              y: that._playerModelAdpt.getY(),
                                              doorLock: false})
                                       .setColor(that._playerModelAdpt.getColor());
      if (oldPlayerEntity !== null) {
        that._player.animate(oldPlayerEntity.getReel().id, -1);
      }

      for (var id in that._otherPlayerModelAdpts) {
        var otherPlayer = that._otherPlayerModelAdpts[id];
        if (otherPlayer.getRoom() == that._playerModelAdpt.getRoom()) {
          makePlayerHusk.call(that, otherPlayer.getID(),
                              otherPlayer.getX(),
                              otherPlayer.getY(),
                              otherPlayer.getColor());
        }
      }

      that._mapEnabled = false;

      that._player.enableControl();

      if (roomConfig.event !== undefined && roomConfig.event !== -1) {
        that._player.disableControl();
        var eventInfo = that._gameModelAdpt.performEvent(roomConfig.event);  //performEvent does the action of the event and returns the text to display
        var eventBackground = Crafty.e('2D, DOM, Color')
          .color('white');
        var eventTitle = Crafty.e('2D, DOM, Text')
          .text(eventInfo.title)
          .textFont({size: '20px'})
          .css({'text-align': 'center', 'top': '15px'});
        var eventText = Crafty.e('2D, DOM, Text')
          .css({'text-align': 'center', 'top': '45px'})
          .text(eventInfo.text)
          .textFont({size: '14px'});
        eventBackground.attach(eventTitle); //Attach eventTitle and eventText as children of event so that they will move together
        eventBackground.attach(eventText);
        eventBackground.attr({x: that._gameModelAdpt.getDimensions().width/2 - 175, y: that._gameModelAdpt.getDimensions().height/2 - 175, w: 350, h: 350});
        setTimeout(function() {
          eventBackground.destroy();    //Remove the event text box
          eventText.destroy();
          that._player.enableControl(); //Allow player to move again
        }, 3000); //Display the event text box for 3 seconds
      }
    });

    Crafty.defineScene('map', function(mapConfig) {
      Crafty.background('black');

      var toVisit = [{room: mapConfig,
                      x: that._gameModelAdpt.getDimensions().width / 2 - (TILE_WIDTH / 2),
                      y: that._gameModelAdpt.getDimensions().height / 2 - (TILE_WIDTH / 2)}];

      while (toVisit.length > 0) {
        var curNode;

        curNode = toVisit.shift();

        Crafty.e('MapRoom').attr({x: curNode.x, y: curNode.y})

        if (curNode.room.id === that._playerModelAdpt.getRoom()) {
          Crafty.e('PlayerHusk').attr({x: curNode.x, y: curNode.y})
                                .setColor(that._playerModelAdpt.getColor());
        }

        if (curNode.room.hasGateway('north')) {
          toVisit.push({room: curNode.room.getGateway('north'),
                        x: curNode.x, y: curNode.y - TILE_WIDTH});
        }

        if (curNode.room.hasGateway('east')) {
          toVisit.push({room: curNode.room.getGateway('east'),
                        x: curNode.x + TILE_WIDTH, y: curNode.y});
        }

        if (curNode.room.hasGateway('south')) {
          toVisit.push({room: curNode.room.getGateway('south'),
                        x: curNode.x, y: curNode.y + TILE_WIDTH});
        }

        if (curNode.room.hasGateway('west')) {
          toVisit.push({room: curNode.room.getGateway('west'),
                        x: curNode.x - TILE_WIDTH, y: curNode.y});
        }
      }

      that._mapEnabled = true;
    });

    Crafty.bind('KeyDown', function(e) {
      var inputInFocus = $('input').is(':focus');

      if (!inputInFocus && e.key == Crafty.keys.M) {
        if (that._mapEnabled) {
          that._gameModelAdpt.onDisableMap();
        } else {
          that._gameModelAdpt.onEnableMap();
        }
      }

      if (!inputInFocus && e.key == Crafty.keys.SPACE) {
        that._gameModelAdpt.attack();
      }
    });
  }

  function start() {
    this._gameModelAdpt.fetchGames();
  }

  function displayGamePane() {
    $('#game-pane').removeClass('hidden');
  }

  function loadRoom(roomConfig) {
    Crafty.enterScene('room', roomConfig);
  }

  function loadMap(mapConfig) {
    Crafty.enterScene('map', mapConfig);
  }

  function placeItems(items) {
    for (var i = 0; i < items.length; i++) {
      var item = Crafty.e(items[i].type).attr({x: items[i].x, y: items[i].y, type: items[i].type, stat: items[i].stat, amount: items[i].amount, itemID: items[i].id});
      this._items[items[i].id] = item;
    }
  }

  function placeFurniture(furniture) {
    for (var i = 0; i < furniture.length; i++) {
      Crafty.e('Furniture').attr({x: furniture[i].gridX * TILE_WIDTH,
                                  y: furniture[i].gridY * TILE_WIDTH,
                                  w: SpriteMap[furniture[i].id].gridW * TILE_WIDTH,
                                  h: SpriteMap[furniture[i].id].gridH * TILE_WIDTH})
                           .sprite(SpriteMap[furniture[i].id].gridX,
                                   SpriteMap[furniture[i].id].gridY,
                                   SpriteMap[furniture[i].id].gridW,
                                   SpriteMap[furniture[i].id].gridH);
    }
  }

  function makePlayerView(playerModelAdpt) {
    var that = this;

    this._playerModelAdpt = playerModelAdpt;

    this._player = Crafty.e('Player');
    this._player.setColor(this._playerModelAdpt.getColor());

    addPlayerToList.call(this, playerModelAdpt);

    return {
      setRelics: function(newRelics) {
        $('#' + playerModelAdpt.getID() + '.player-list-item')
          .find('li.player-relics')[0].innerHTML = ('relics: ' + newRelics);
      },

      setWeapon: function(newWeapon) {
        $('#' + playerModelAdpt.getID() + '.player-list-item')
          .find('li.player-weapon')[0].innerHTML = ('weapon: ' + newWeapon);
      },

      setCurHealth: function(newCurHealth) {
        $('#' + playerModelAdpt.getID() + '.player-list-item')
          .find('li.player-cur-health')[0].innerHTML = ('cur health: ' + newCurHealth);
      },

      setMaxHealth: function(newMaxHealth) {
        $('#' + playerModelAdpt.getID() + '.player-list-item')
          .find('li.player-max-health')[0].innerHTML = ('max health: ' + newMaxHealth);
      },

      setSpeed: function(newSpeed) {
        that._player.speed({x: newSpeed, y: newSpeed});
        $('#' + playerModelAdpt.getID() + '.player-list-item')
          .find('li.player-speed')[0].innerHTML = ('speed: ' + newSpeed);
      },

      fixMovement: function(increaseBy) {
        that._player.fixMovement(increaseBy);
      }
    }
  }

  function addPlayerToList(playerModelAdpt) {
    var playerList = document.getElementById('player-list');

    var player = document.createElement('li');
    player.style.cssText = 'color: ' + playerModelAdpt.getColor() + ';';
    player.id = playerModelAdpt.getID();
    player.className = 'player-list-item';
    player.appendChild(document.createTextNode(playerModelAdpt.getName()));

    var playerStats = document.createElement('ul');

    var playerSpeed = document.createElement('li');
    playerSpeed.className = 'player-speed';
    playerSpeed.appendChild(
        document.createTextNode('speed: ' + playerModelAdpt.getSpeed()));
    playerStats.appendChild(playerSpeed);

    var playerMaxHealth = document.createElement('li');
    playerMaxHealth.className = 'player-max-health';
    playerMaxHealth.appendChild(
        document.createTextNode('max health: ' + playerModelAdpt.getMaxHealth()));
    playerStats.appendChild(playerMaxHealth);

    var playerCurHealth = document.createElement('li');
    playerCurHealth.className = 'player-cur-health';
    playerCurHealth.appendChild(
        document.createTextNode('cur health: ' + playerModelAdpt.getCurHealth()));
    playerStats.appendChild(playerCurHealth);

    var playerWeapon = document.createElement('li');
    playerWeapon.className = 'player-weapon';
    playerWeapon.appendChild(
        document.createTextNode('weapon: ' + playerModelAdpt.getWeapon()));
    playerStats.appendChild(playerWeapon);

    var playerRelics = document.createElement('li');
    playerRelics.className = 'player-relics';
    playerRelics.appendChild(
        document.createTextNode('relics: ' + playerModelAdpt.getRelics()));
    playerStats.appendChild(playerRelics);

    player.appendChild(playerStats);

    playerList.appendChild(player);
  }

  function makePlayerHusk(id, x, y, color) {
     var husk = Crafty.e('PlayerHusk').attr({x: x, y: y});
     husk.setColor(color);
     this._husks[id] = husk;
   }

  function addOtherPlayer(playerModelAdpt) {
    var that = this;

    this._otherPlayerModelAdpts[playerModelAdpt.getID()] = playerModelAdpt;

    var playerListItem = addPlayerToList.call(this, playerModelAdpt);

    /*
     * TODO move some of this back to the controller to match the local
     * player
     */
    return {
      destroy: function() {
        appendChatMessage.call(that, playerModelAdpt.getID(), 'left the game');
        removeHusk.call(that, playerModelAdpt.getID());
        delete that._otherPlayerModelAdpts[playerModelAdpt.getID()];
        $('#' + playerModelAdpt.getID() + '.player-list-item').remove();
      },

      onRelicsChange: function(newRelics) {
        $('#' + playerModelAdpt.getID() + '.player-list-item')
          .find('li.player-relics')[0].innerHTML = ('relics: ' + newRelics);
      },


      onWeaponChange: function(newWeapon) {
        $('#' + playerModelAdpt.getID() + '.player-list-item')
          .find('li.player-weapon')[0].innerHTML = ('weapon: ' + newWeapon);
      },

      onCurHealthChange: function(newCurHealth) {
        $('#' + playerModelAdpt.getID() + '.player-list-item')
          .find('li.player-cur-health')[0].innerHTML = ('cur health: ' + newCurHealth);
      },

      onMaxHealthChange: function(newMaxHealth) {
        $('#' + playerModelAdpt.getID() + '.player-list-item')
          .find('li.player-max-health')[0].innerHTML = ('max health: ' + newMaxHealth);
      },

      onSpeedChange: function(newSpeed) {
        $('#' + playerModelAdpt.getID() + '.player-list-item')
          .find('li.player-speed')[0].innerHTML = ('speed: ' + newSpeed);
      },

      setLocation: function(newX, newY) {
        var husk = that._husks[playerModelAdpt.getID()];

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
                              playerModelAdpt.getX(), playerModelAdpt.getY(), playerModelAdpt.getColor());
        } else {
          removeHusk.call(that, playerModelAdpt.getID());
        }
      }
    }
  }

  function removeAllHusks() {
    for (var key in this._husks) {
      this._husks[key].destroy(); // destroy Crafty entity
    }
    this._husks = {};
  }

  function removeHusk(id) {
    if (this._husks[id] !== undefined) {
      this._husks[id].destroy();
      delete this._husks[id];
    }
  }

  function removeItem(id) {
    if(id in this._items) {
      this._items[id].destroy();
      delete this._items[id];
    }
  }

  function setGameOptions(games) {
    var gameOptions = document.getElementById('select-game');

    /* Clear the game options combo box. */
    gameOptions.length = 0;

    games.forEach(function(v, i, a) {
      gameOptions.options.add(new Option(v.name, v.id));
    });
  }

  function setupBarriers(gateways) {
    var widthInTiles = this._gameModelAdpt.getDimensions().width/TILE_WIDTH;
    var heightInTiles = this._gameModelAdpt.getDimensions().height/TILE_WIDTH;

    for (var j = 0; j < widthInTiles; j++) {
      if(!('north' in gateways && (j == widthInTiles/2 || j == widthInTiles/2-1))) {
        Crafty.e('Wall').attr({x: j * TILE_WIDTH, y: 0});
      }
      else {
        Crafty.e('Door').attr({x: j * TILE_WIDTH, y: 0, doorID: 'north'});
      }
      if(!('south' in gateways && (j == widthInTiles/2 || j == widthInTiles/2-1))) {
        Crafty.e('Wall').attr({x: j * TILE_WIDTH, y: (heightInTiles - 1) * TILE_WIDTH});
      }
      else {
        Crafty.e('Door').attr({x: j * TILE_WIDTH, y: (heightInTiles - 1) * TILE_WIDTH, doorID: 'south'});
      }
    }

    for (var i = 0; i < heightInTiles; i++) {
      if(!('west' in gateways && (i == heightInTiles/2 || i == heightInTiles/2-1))) {
        Crafty.e('Wall').attr({x: 0, y: i * TILE_WIDTH});
      }
      else {
        Crafty.e('Door').attr({x: 0, y: i * TILE_WIDTH, doorID: 'west'});
      }
      if(!('east' in gateways && (i == heightInTiles/2 || i == heightInTiles/2-1))) {
        Crafty.e('Wall').attr({x: (widthInTiles - 1) * TILE_WIDTH, y: i * TILE_WIDTH});
      }
      else {
        Crafty.e('Door').attr({x: (widthInTiles - 1) * TILE_WIDTH, y: i * TILE_WIDTH, doorID: 'east'});
      }
    }

  }

  function appendChatMessage(playerID, message) {
    var sender;

    if (playerID === this._playerModelAdpt.getID()) {
      sender = this._playerModelAdpt;
    } else {
      for (var id in this._otherPlayerModelAdpts) {
        if (playerID == id) {
          sender = this._otherPlayerModelAdpts[id];
          break;
        }
      }
    }

    var messageElement = document.createElement('p');
    messageElement.style.cssText = 'color: ' + sender.getColor() + ';';
    messageElement.appendChild(
        document.createTextNode(sender.getName() + ': ' + message));

    $('#chatroom').find('div.messages').append(messageElement);
  }

  function appendEvent(message) {
    var messageElement = document.createElement('p');
    messageElement.appendChild(document.createTextNode(message));
    $('#chatroom').find('div.messages').append(messageElement);
  }

  function initGUI() {
    var that = this;

    document.getElementById('btn-join').addEventListener('click', function() {
      var select = document.getElementById('select-game');
      var name = document.getElementById('ipt-name');

      if (name.value.length === 0) {
        alert('Please enter a non-empty name.');
        return
      }

      /* Disable join button */
      this.disabled = true;

      that._gameModelAdpt.onJoinClick(name.value, select[select.selectedIndex].value);
    });

    document.getElementById('btn-create-game').addEventListener('click', function() {
      that._gameModelAdpt.onCreateGameClick(document.getElementById('ipt-game-name').value);
    });

    document.getElementById('btn-speed-inc').addEventListener('click', function() {
      that._playerModelAdpt.onSpeedIncClick(1);
    });

    document.getElementById('btn-speed-dec').addEventListener('click', function() {
      that._playerModelAdpt.onSpeedDecClick();
    });

    document.getElementById('btn-send-message').addEventListener('click', function() {
      var messageText = document.getElementById('ipt-message');

      that._gameModelAdpt.onSendChatMessage(messageText.value);
    });
  }

  return function GameView(gameModelAdpt) {
    this._gameModelAdpt = gameModelAdpt;
    this._player = null;
    this._playerModelAdpt = null;
    this._otherPlayerModelAdpts = {};
    this._husks = {};
    this._items = {};
    this._mapEnabled = false;

    initGUI.call(this);
    initCrafty.call(this);

    this.addOtherPlayer = addOtherPlayer.bind(this);
    this.appendChatMessage = appendChatMessage.bind(this);
    this.appendEvent = appendEvent.bind(this);
    this.displayGamePane = displayGamePane.bind(this);
    this.loadRoom = loadRoom.bind(this);
    this.loadMap = loadMap.bind(this);
    this.makePlayerView = makePlayerView.bind(this);
    this.removeAllHusks = removeAllHusks.bind(this);
    this.removeItem = removeItem.bind(this);
    this.setGameOptions = setGameOptions.bind(this);
    this.start = start.bind(this);
  }
});
