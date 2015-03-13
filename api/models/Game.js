/**
* Game.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  autoWatch: false,

  autosubscribe: ['message', 'update'],

  attributes: {
  	name: {type: 'string',
  		     required: true},
  	rooms: {collection: 'room',
  			    via: 'game'},
    startingRoom: {model: 'room',
                   required: false},
    players: {collection: 'player',
              via: 'game'},
    relicsRemaining: {type: 'integer',
                      required: false},
    traitor: {model: 'player',
              required: false},
    haunt: {type: 'string',
            required: false},
    keysRemaining: {type: 'integer',
                    required: false}
  },

  generateHouse: function(game, cb) {
    var roomsToCreate = [];
    var gatewaysToCreate = [];
    var openGridLocs = [];

    /* Put all rooms except the entryway into allRooms and shuffle. */
    var allRooms = Object.keys(Room.layouts).slice(1);
    allRooms = _.shuffle(allRooms);

    /* Sums the total abundance to make percentages of items relative. */
    var totalAbundance = 0;
    _.each(_.values(Game.items), function(i) {
      totalAbundance += i.abundance;
    });

    var numRelics = 0;

    /* Add 2 items per room per the abundance specifications. */
    var itemBank = [];
    for (i in Game.items) {
      _.times(Math.round(Game.items[i].abundance / totalAbundance
                         * allRooms.length * 2), function(n) {
        if (Game.items[i].stat === 'relics') {
          numRelics++;
        }
        itemBank.push(i);
      });
    }

    Game.update(game.id, {relicsRemaining: numRelics}, function(game){});

    /* Randomly order the items. */
    itemBank = _.shuffle(itemBank);

    var houseGrid = new Array(14);
    for (var i = 0; i < houseGrid.length; i++) {
      houseGrid[i] = new Array(16);
    }

    var roomID = 'entryway';
    var room = Room.layouts[roomID];
    var x = 7;
    var y = 6;

    houseGrid[x][y] = roomID;
    openGridLocs.push([6,6], [7,5], [7,7]);
    roomsToCreate.push({game: game.id, name: roomID, background: room.floor});

    while (allRooms.length > 0) {
      var randLoc = Math.floor(Math.random() * openGridLocs.length);
      var randRoom = Math.floor(Math.random() * allRooms.length);
      var itemsToCreate = [];

      x = openGridLocs[randLoc][0];
      y = openGridLocs[randLoc][1];

      roomID = allRooms.pop();
      room = Room.layouts[roomID];
      houseGrid[x][y] = roomID;

      openGridLocs = _.filter(openGridLocs, function(loc) {
        return !(_.isEqual(loc, [x, y]));
      });

      var excludePts = [];
      var i, j;

      /* Exclude walls. */
      for (i = 0; i < Room.dimensions.gridW; i++) {
        for (j = 0; j < Room.dimensions.gridH; j++) {
          if (i == 0 || i == Room.dimensions.gridW - 1) {
            excludePts.push([i, j]);
          } else if (j == 0 || j == Room.dimensions.gridH - 1) {
            excludePts.push([i, j]);
          }
        }
      }

      /* Exclude objects. */
      _.each(Room.layouts[roomID].objects, function(o) {
        var x = o.gridX;
        var y = o.gridY;

        for (i = o.gridX; i < o.gridX + Game.sprites[o.id].gridW; i++) {
          for (j = o.gridY; j < o.gridY + Game.sprites[o.id].gridH; j++) {
            excludePts.push([i, j]);
          }
        }
      });

      _.times(2, function(n) {
        var item = itemBank.pop();
        var loc = RandomService.randomGridLoc(Room.dimensions.gridW,
                                              Room.dimensions.gridH,
                                              excludePts);
        itemsToCreate.push({type: item,
                            stat: Game.items[item].stat,
                            amount: Game.items[item].amount,
                            gridX: loc.x,
                            gridY: loc.y});
      });

      roomsToCreate.push({game: game.id,
                          name: roomID,
                          background: room.floor,
                          items: itemsToCreate});

      if (room.gateways.north && houseGrid[x - 1][y] == undefined) {
        openGridLocs.push([x - 1, y]);
      }
      if (room.gateways.east && houseGrid[x][y + 1] == undefined) {
        openGridLocs.push([x, y + 1]);
      }
      if (room.gateways.south && houseGrid[x + 1][y] == undefined) {
        openGridLocs.push([x + 1, y]);
      }
      if (room.gateways.west && houseGrid[x][y - 1] == undefined) {
        openGridLocs.push([x, y - 1]);
      }
    }


    for (var i = 0; i < houseGrid.length; i++) {
      for (var j = 0; j < houseGrid[0].length; j++) {
        var thisRoomID = houseGrid[i][j];

        if (thisRoomID === undefined) {
          continue;
        }

        var thisRoom = Room.layouts[thisRoomID]

        var roomNorthID = (i == 0 ? null : houseGrid[i - 1][j]);
        var roomEastID = (j == houseGrid[0].length - 1
                          ? null : houseGrid[i][j + 1]);
        var roomSouthID = (i == houseGrid.length - 1
                           ? null : houseGrid[i + 1][j]);
        var roomWestID = (j == 0 ? null : houseGrid[i][j - 1]);

        var roomNorth = Room.layouts[roomNorthID];
        var roomEast = Room.layouts[roomEastID];
        var roomSouth = Room.layouts[roomSouthID];
        var roomWest = Room.layouts[roomWestID];

        if (roomNorth != null && thisRoom.gateways.north
            && roomNorth.gateways.south) {
          gatewaysToCreate.push({roomFrom: thisRoomID,
                                 roomTo: roomNorthID,
                                 direction: 'north'})
        }
        if (roomEast != null && thisRoom.gateways.east
            && roomEast.gateways.west) {
          gatewaysToCreate.push({roomFrom: thisRoomID,
                                 roomTo: roomEastID,
                                 direction: 'east'})
        }
        if (roomSouth != null && thisRoom.gateways.south
            && roomSouth.gateways.north) {
          gatewaysToCreate.push({roomFrom: thisRoomID,
                                 roomTo: roomSouthID,
                                 direction: 'south'})
        }
        if (roomWest != null && thisRoom.gateways.west
            && roomWest.gateways.east) {
          gatewaysToCreate.push({roomFrom: thisRoomID,
                                 roomTo: roomWestID,
                                 direction: 'west'})
        }
      }
    }

    var databaseID = {};

    Room.create(roomsToCreate)
      .then(function(rooms) {
        rooms.forEach(function(v, i, a) {
          databaseID[v.name] = v.id;
        });

        /* Really simple test. */
        Event.create({room: databaseID['entryway'], container: 'rug', card: 'spiders'})
          .catch(function(err) {
            console.log(err);
          });

        gatewaysToCreate.forEach(function(v, i, a) {
          v.roomFrom = databaseID[v.roomFrom];
          v.roomTo = databaseID[v.roomTo];
        });

        return Gateway.create(gatewaysToCreate);
      })
      .then(function(gateways) {
        /* Gateways created. */
      })
      .catch(function(err) {
        console.log(err);
      })
      .done(function() {
        cb(databaseID['entryway']);
      });
  },

  items: sails.config.gameconfig.items,

  sprites: sails.config.gameconfig.sprites,

  haunts: sails.config.gameconfig.haunts
};
