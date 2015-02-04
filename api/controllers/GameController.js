/**
 * GameController
 *
 * @description :: Server-side logic for managing games
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var Q = require('q');

var ROOMS = [
    {roomNum: 1, name: 'blue'},
    {roomNum: 2, name: 'black'},
    {roomNum: 3, name: 'yellow'},
    {roomNum: 4, name: 'green'}
  ];

var GATEWAYS = [
    {roomFrom: 1, roomTo: 2, direction: 'east'},
    {roomFrom: 1, roomTo: 4, direction: 'south'},
    {roomFrom: 2, roomTo: 3, direction: 'south'},
    {roomFrom: 4, roomTo: 3, direction: 'east'}
  ];

  var OPPOSITE_DIRECTIONS = {
    'east': 'west',
    'west': 'east',
    'north': 'south',
    'south': 'north'
  }

var roomNumsToIDs = {};

module.exports = {
	create: function(req, res) {
    Game.create({name: req.body.name},
                 function(err, game) {
      if (err) {
        console.log(err);
        res.json(err);
        return;
      }

      var deferredsArray = [];
      var promisesArray = [];

      for (var i = 0; i < ROOMS.length; i++) {
        var deferred = Q.defer();
        ROOMS[i]['game'] = game.id;
        Room.create(ROOMS[i], function(err, room) {
          roomNumsToIDs[room.roomNum] = room.id;
          deferredsArray[room.roomNum - 1].resolve();
        });
        deferredsArray.push(deferred);
        promisesArray.push(deferred.promise);
      }

      Q.all(promisesArray).then(function() {
        game.startingRoom = roomNumsToIDs[0];

        for (var i = 0; i < GATEWAYS.length; i ++) {
          /* Create gateway from GATEWAYS list */
          var gateway = {}
          gateway['roomFrom'] = roomNumsToIDs[GATEWAYS[i]['roomFrom']];
          gateway['roomTo'] = roomNumsToIDs[GATEWAYS[i]['roomTo']];
          gateway['direction'] = GATEWAYS[i]['direction'];
          Gateway.create(gateway, function(err, gateway) {});

          /* Create corresponding gateway in other direction */
          gateway['roomFrom'] = roomNumsToIDs[GATEWAYS[i]['roomTo']];
          gateway['roomTo'] = roomNumsToIDs[GATEWAYS[i]['roomFrom']];
          gateway['direction'] = OPPOSITE_DIRECTIONS[GATEWAYS[i]['direction']];
          Gateway.create(gateway, function(err, gateway) {});
        }
      });
      

      res.json(game.toJSON());
    });
  }
};

