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

    var allRooms = Object.keys(Room.layouts).slice(1);
    sails.shuffle.knuthShuffle(allRooms);

    var openGridLocs = [];

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

      x = openGridLocs[randLoc][0];
      y = openGridLocs[randLoc][1];

      roomID = allRooms.pop();
      room = Room.layouts[roomID];
      houseGrid[x][y] = roomID;
      roomsToCreate.push({game: game.id, name: roomID, background: room.floor});

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
        var thisRoomID = houseGrid[i][j];
        var thisRoom = Room.layouts[thisRoomID]

        if (thisRoom === undefined) {
          continue;
        }

        var roomNorthID = (i == 0 ? null : houseGrid[i - 1][j]);
        var roomEastID = (j == houseGrid[0].length - 1 ? null : houseGrid[i][j + 1]);
        var roomSouthID = (i == houseGrid.length - 1 ? null : houseGrid[i + 1][j]);
        var roomWestID = (j == 0 ? null : houseGrid[i][j - 1]);

        var roomNorth = Room.layouts[roomNorthID];
        var roomEast = Room.layouts[roomEastID];
        var roomSouth = Room.layouts[roomSouthID];
        var roomWest = Room.layouts[roomWestID];

        if (roomNorth != null && thisRoom.gateways.north && roomNorth.gateways.south) {
          gatewaysToCreate.push({roomFrom: thisRoomID, roomTo: roomNorthID, direction: 'north'})
        }
        if (roomEast != null && thisRoom.gateways.east && roomEast.gateways.west) {
          gatewaysToCreate.push({roomFrom: thisRoomID, roomTo: roomEastID, direction: 'east'})
        }
        if (roomSouth != null && thisRoom.gateways.south && roomSouth.gateways.north) {
          gatewaysToCreate.push({roomFrom: thisRoomID, roomTo: roomSouthID, direction: 'south'})
        }
        if (roomWest != null && thisRoom.gateways.west && roomWest.gateways.east) {
          gatewaysToCreate.push({roomFrom: thisRoomID, roomTo: roomWestID, direction: 'west'})
        }
      }
    }

    var databaseID = {};

    Room.create(roomsToCreate)
      .then(function(rooms) {
        console.log('rooms created');

        rooms.forEach(function(v, i, a) {
          databaseID[v.name] = v.id;

          /* Possibly add an event to this room */
          var events = Object.keys(sails.config.gameconfig.events);
          if (Math.random() < .3) {
            var index = Math.floor((Math.random() * events.length));
            Room.update(v.id, {event: events[index]}, function(room) {});
            events.splice(index, 1);
          }
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

