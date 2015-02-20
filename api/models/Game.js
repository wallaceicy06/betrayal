/**
* Game.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  autoWatch: false,

  attributes: {
  	name: {type: 'string',
  		     required: true},
  	rooms: {collection: 'room',
  			    via: 'game'},
    startingRoom: {model: 'room',
                   required: false},
    players: {collection: 'player',
              via: 'game'}
  },

  generateHouse: function(game, cb) {
    var roomsToCreate = [];
    var gatewaysToCreate = [];

    var allRooms = Room.layouts.slice(1);
    sails.shuffle.knuthShuffle(allRooms);

    var openGridLocs = [];

    var houseGrid = new Array(14);
    for (var i = 0; i < houseGrid.length; i++) {
      houseGrid[i] = new Array(16);
    }

    var room = Room.layouts[0];
    var x = 7;
    var y = 6;

    houseGrid[x][y] = room;
    openGridLocs.push([6,6], [7,5], [7,7]);
    roomsToCreate.push({game: game.id, name: room.id, background: room.floor});

    while (allRooms.length > 0) {
      var randLoc = Math.floor(Math.random() * openGridLocs.length);
      var randRoom = Math.floor(Math.random() * allRooms.length);

      x = openGridLocs[randLoc][0];
      y = openGridLocs[randLoc][1];

      room = allRooms.pop();
      houseGrid[x][y] = room;
      roomsToCreate.push({game: game.id, name: room.id, background: room.floor});

      if (room.gateways.north && houseGrid[x - 1][y] === undefined) {
        openGridLocs.push([x - 1, y]);
      }
      if (room.gateways.east && houseGrid[x][y + 1] === undefined) {
        openGridLocs.push([x, y + 1]);
      }
      if (room.gateways.south && houseGrid[x + 1][y] === undefined) {
        openGridLocs.push([x + 1, y]);
      }
      if (room.gateways.west && houseGrid[x][y - 1] === undefined) {
        openGridLocs.push([x, y - 1]);
      }
    }

    for (var i = 0; i < houseGrid.length; i++) {
      for (var j = 0; j < houseGrid[0].length; j++) {
        var thisRoom = houseGrid[i][j];

        if (thisRoom === undefined) {
          continue;
        }

        var roomNorth = (i == 0 ? null : houseGrid[i - 1][j]);
        var roomEast = (j == houseGrid[0].length - 1 ? null : houseGrid[i][j + 1]);
        var roomSouth = (i == houseGrid.length - 1 ? null : houseGrid[i + 1][j]);
        var roomWest = (j == 0 ? null : houseGrid[i][j - 1]);

        if (roomNorth != null && thisRoom.gateways.north && roomNorth.gateways.south) {
          gatewaysToCreate.push({roomFrom: thisRoom.id, roomTo: roomNorth.id, direction: 'north'})
        }
        if (roomEast != null && thisRoom.gateways.east && roomEast.gateways.west) {
          gatewaysToCreate.push({roomFrom: thisRoom.id, roomTo: roomEast.id, direction: 'east'})
        }
        if (roomSouth != null && thisRoom.gateways.south && roomSouth.gateways.north) {
          gatewaysToCreate.push({roomFrom: thisRoom.id, roomTo: roomSouth.id, direction: 'south'})
        }
        if (roomWest != null && thisRoom.gateways.west && roomWest.gateways.east) {
          gatewaysToCreate.push({roomFrom: thisRoom.id, roomTo: roomWest.id, direction: 'west'})
        }
      }
    }

    var databaseID = {};

    var startRoom = Room.create(roomsToCreate)
      .then(function(rooms) {
        console.log('rooms created');

        rooms.forEach(function(v, i, a) {
          databaseID[v.name] = v.id;
        });

        gatewaysToCreate.forEach(function(v, i, a) {
          v.roomFrom = databaseID[v.roomFrom];
          v.roomTo = databaseID[v.roomTo];
        });

        return Gateway.create(gatewaysToCreate);
      })
      .then(function(gateways) {
        console.log('gateways created');
      })
      .catch(function(err) {
        console.log(err);
      })
      .done(function() {
        cb(databaseID['entryway']);
      });
  }
};

