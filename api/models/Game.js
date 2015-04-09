/**
* Game.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  autoWatch: false,

  autosubscribe: ['message', 'update', 'destroy'],

  attributes: {
    active: {type: 'boolean',
             required: true,
             defaultsTo: false},
  	name: {type: 'string',
  		     required: true},
  	rooms: {collection: 'room',
  			    via: 'game'},
    startingRoom: {model: 'room',
                   required: false},
    players: {collection: 'player',
              via: 'game'},
    traitor: {model: 'player',
              required: false},
    haunt: {type: 'string',
            required: false},
  },

  checkWin: function(gameID, roomID) {
    var game;

    Game.findOne(gameID).populate('players').populate('rooms')
      .then(function(found) {
        if (found === undefined) {
          throw new Error('Game could not be found.');
        }

        game = found;

        if (game.haunt === undefined) {
          return -1;
        }

        return Item.count({stat: 'keys', game: gameID});
      })
      .then(function(keyCount) {
        if (keyCount === 0) {
          for (var i = 0; i < game.players.length; i++) {
            var p = game.players[i];
            if (!p.isTraitor && p.room !== roomID) {
              return;
            }
          }

          /* If we made it through, then the heroes won. */
          Game.message(game.id, {verb: 'heroesWon'});
        }
      })
      .catch(function(err) {
        sails.log.error(err);
      });
  },

  startHaunt: function(gameID) {
    var game;

    Game.findOne(gameID).populate('players').populate('rooms')
      .then(function(found) {
        if (found === undefined) {
          return;
        }

        game = found;

        var traitor = game.players[Math.floor(Math.random()
                                   * game.players.length)];

        var allHaunts = _.keys(Game.haunts);
        var haunt = allHaunts[Math.floor(Math.random() * allHaunts.length)];

        return Game.update(game.id, {traitor: traitor, haunt: haunt});
      })
      .then(function(updatedGames) {
        var updatedGame = updatedGames[0];

        Game.publishUpdate(updatedGame.id, {traitor: updatedGame.traitor, haunt: updatedGame.haunt});

        var itemsToCreate = [];

        var numKeysToPlace = 2 * (game.players.length - 1);

        var allRooms = game.rooms.slice(0);

        var exithallwaysToCreate = [];
        _.times(numKeysToPlace - 2, function(i) {
          exithallwaysToCreate.push({ game: updatedGame.id,
                                      name: 'exithallway',
                                      background: Room.layouts.exithallway.floor });
        });

        while (numKeysToPlace > 0) {
          var chosenRoom = allRooms[Math.floor(Math.random() * allRooms.length)];

          var possibleLocs = Room.layouts[chosenRoom.name].itemLocs;

          if (possibleLocs.length == 0) {
            continue;
          }

          var loc = possibleLocs[Math.floor(Math.random() * possibleLocs.length)];

          itemsToCreate.push({type: 'key', stat: 'keys', amount: 1,
                              gridX: loc.x, gridY: loc.y, room: chosenRoom,
                              game: game.id});

          numKeysToPlace--;
        }

        sails.log.info('exit hallways to create');
        sails.log.info(exithallwaysToCreate);

        return [Item.create(itemsToCreate),
                Room.findOne({ game: game.id, name: 'exithallway' }),
                exithallwaysToCreate];
      }).spread(function(items, firstExit, exitHallwaysToCreate) {
        _.each(items, function(item) {
          Item.publishCreate(item);
        });

        var exit = {game: game.id, name: 'exit', background: Room.layouts.exit.floor};

        return [firstExit, Room.create(exitHallwaysToCreate), Room.create(exit)];
      })
      .spread(function(firstExit, exitHallways, exit) {
        var gatewaysToCreate = [];
        var prevRoomID = firstExit.id;

        _.each(exitHallways, function (room) {

          gatewaysToCreate.push({ roomFrom: prevRoomID,
                                  roomTo: room.id,
                                  direction: 'south',
                                  locked: true })
          gatewaysToCreate.push({ roomFrom: room.id,
                                  roomTo: prevRoomID,
                                  direction: 'north' })
          prevRoomID = room.id;
        });

        gatewaysToCreate.push({ roomFrom: prevRoomID,
                                roomTo: exit.id,
                                direction: 'south',
                                locked: true });

        gatewaysToCreate.push({ roomFrom: exit.id,
                                roomTo: prevRoomID,
                                direction: 'north' });

        sails.log.info('about to create gateways');
        sails.log.info(gatewaysToCreate);

        return Gateway.create(gatewaysToCreate);
      })
      .then(function(gateways) {
        sails.log.info('gateways created');
        sails.log.info(gateways);
      })
      .catch(function(err) {
        sails.log.error(err);
      });
  },

  generateHouse: function(game, cb) {
    var roomsToCreate = [];
    var gatewaysToCreate = [];
    var openGridLocs = [];

    /* Put all rooms except the entryway, exit into allRooms and shuffle. */
    var allRooms = _.keys(_.omit(Room.layouts, ['entryway', 'exithallway', 'exit', 'dummy']));
    allRooms = _.shuffle(allRooms);

    /* Sums the total abundance to make percentages of items relative. */
    var totalAbundance = 0;
    _.each(_.values(Game.items), function(i) {
      totalAbundance += i.abundance;
    });


    sails.log.info(allRooms);

    /* Add 2 items per room per the abundance specifications. */
    var itemBank = [];
    for (i in Game.items) {
      _.times(Math.round(Game.items[i].abundance / totalAbundance
                         * allRooms.length * 2), function(n) {
        itemBank.push(i);
      });
    }

    /* Randomly order the items. */
    itemBank = _.shuffle(itemBank);

    var houseGrid = new Array(14);
    for (var i = 0; i < houseGrid.length; i++) {
      houseGrid[i] = new Array(16);
    }

    var entrywayLayout = Room.layouts.entryway;
    var exitLayout = Room.layouts.exithallway;

    var i = 7;
    var j = 6;

    houseGrid[i][j] = 'entryway';
    openGridLocs.push([6,6], [7,5], [7,7]);
    roomsToCreate.push({game: game.id, name: 'entryway', background: entrywayLayout.floor});

    houseGrid[i + 1][j] = 'exithallway';
    roomsToCreate.push({game: game.id, name: 'exithallway', background: exitLayout.floor});

    for (var k = i + 2; k < houseGrid.length; k++) {
      houseGrid[k][j] = 'dummy';
    }

    gatewaysToCreate.push({roomFrom: 'entryway',
                           roomTo: 'exithallway',
                           direction: 'south',
                           locked: true});

    gatewaysToCreate.push({roomFrom: 'exithallway',
                           roomTo: 'entryway',
                           direction: 'north'});

    var roomID;
    var room;

    while (allRooms.length > 0) {
      var randLoc = Math.floor(Math.random() * openGridLocs.length);

      var itemsToCreate = [];

      i = openGridLocs[randLoc][0];
      j = openGridLocs[randLoc][1];

      roomID = allRooms.shift();
      room = Room.layouts[roomID];

      var fits = false;

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

      if (roomNorth != null && room.gateways.north
          && roomNorth.gateways.south) {
        fits = true;
      }
      if (roomEast != null && room.gateways.east
          && roomEast.gateways.west) {
        fits = true;
      }
      if (roomSouth != null && room.gateways.south
          && roomSouth.gateways.north) {
        fits = true;
      }
      if (roomWest != null && room.gateways.west
          && roomWest.gateways.east) {
        fits = true;
      }

      if (!fits) {
        allRooms.push(roomID);
        continue;
      }


      houseGrid[i][j] = roomID;

      openGridLocs = _.filter(openGridLocs, function(loc) {
        return !(_.isEqual(loc, [i, j]));
      });

      var possibleLocs = Room.layouts[roomID].itemLocs.slice(0);
      _.times(Math.min(1, possibleLocs.length), function(n) {
        var item = itemBank.pop();

        var index = Math.floor(Math.random() * possibleLocs.length);
        var loc = possibleLocs[index];
        possibleLocs.splice(index, 1);
        itemsToCreate.push({type: item,
                            stat: Game.items[item].stat,
                            amount: Game.items[item].amount,
                            gridX: loc.x,
                            gridY: loc.y,
                            game: game.id});
      });

      roomsToCreate.push({game: game.id,
                          name: roomID,
                          background: room.floor,
                          items: itemsToCreate});

      if (room.gateways.north && houseGrid[i - 1][j] == undefined) {
        openGridLocs.push([i - 1, j]);
      }
      if (room.gateways.east && houseGrid[i][j + 1] == undefined) {
        openGridLocs.push([i, j + 1]);
      }
      if (room.gateways.south && houseGrid[i + 1][j] == undefined) {
        openGridLocs.push([i + 1, j]);
      }
      if (room.gateways.west && houseGrid[i][j - 1] == undefined) {
        openGridLocs.push([i, j - 1]);
      }
    }

    var interactableObjects = [];

    for (var i = 0; i < houseGrid.length; i++) {
      for (var j = 0; j < houseGrid[0].length; j++) {
        var thisRoomID = houseGrid[i][j];

        if (thisRoomID === undefined) {
          continue;
        }

        var thisRoom = Room.layouts[thisRoomID];

        _.each(_.keys(thisRoom.objects), function(k) {
          var id = k;
          var o = thisRoom.objects[k];

          if (_.has(Room.interactable, o.type)) {
            interactableObjects.push({room: thisRoomID,
                                      container: id});
          }
        });

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

    var eventsToCreate = [];

    var databaseID = {};

    Room.create(roomsToCreate)
      .then(function(rooms) {
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
        /* Shuffle the interactable objects. */
        interactableObjects = _.shuffle(interactableObjects);

        /* Randomly select objects to put events in. */
        _.each(_.keys(Game.cards), function(c) {
          var object = interactableObjects.pop();

          var event = {
            room: databaseID[object.room],
            container: object.container,
            card: c,
            game: game
          };

          eventsToCreate.push(event);
        });

        sails.log.info(eventsToCreate);

        return Event.create(eventsToCreate)
      })
      .catch(function(err) {
        sails.log.error(err);
      })
      .done(function() {
        cb(databaseID['entryway']);
      });
  },

  items: sails.config.gameconfig.items,

  sprites: sails.config.gameconfig.sprites,

  cards: sails.config.gameconfig.cards,

  haunts: sails.config.gameconfig.haunts
};
