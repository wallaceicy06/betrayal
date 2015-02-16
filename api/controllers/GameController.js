/**
 * GameController
 *
 * @description :: Server-side logic for managing games
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var ROOMS = [
    {roomNum: 1, name: 'blue', background: '#6699FF'},
    {roomNum: 2, name: 'black', background: '#FFFFFF'},
    {roomNum: 3, name: 'yellow', background: '#FFFF99'},
    {roomNum: 4, name: 'green', background: '#00FFCC'}
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
};

var roomNumsToIDs = {};

var ITEM_TYPES = [
  {type: 'SpeedInc', stat: 'speed'},
  {type: 'MaxHealth', stat: 'maxHealth'},
  {type: 'CurHealth', stat: 'curHealth'},
  {type: 'Weapon', stat: 'weapon'},
  {type: 'Relic', stat: 'relics'}
];

module.exports = {

  findOne: function(req, res) {
    Game.findOne(req.params.id).populate('rooms').populate('players').populate('startingRoom').exec(function(err, game) {
      res.json(game);
    });
  },

  sendChatMessage: function(req, res) {
    Game.message(req.params.id, {message: req.body.message, playerID: req.body.playerID});

    res.json();
  },

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
        var deferred = sails.q.defer();
        ROOMS[i]['game'] = game.id;
        Room.create(ROOMS[i], function(err, room) {
          roomNumsToIDs[room.roomNum] = room.id;
          deferredsArray[room.roomNum - 1].resolve();
        });
        deferredsArray.push(deferred);
        promisesArray.push(deferred.promise);
      }

      sails.q.all(promisesArray).then(function() {
        Game.update(game.id, {startingRoom: roomNumsToIDs[1]}, function(err, game) {});

        for (var i = 0; i < GATEWAYS.length; i ++) {
          /* Create gateway from GATEWAYS list. */
          var gateway = {}
          gateway['roomFrom'] = roomNumsToIDs[GATEWAYS[i]['roomFrom']];
          gateway['roomTo'] = roomNumsToIDs[GATEWAYS[i]['roomTo']];
          gateway['direction'] = GATEWAYS[i]['direction'];
          Gateway.create(gateway, function(err, gateway) {});

          /* Create corresponding gateway in other direction. */
          gateway['roomFrom'] = roomNumsToIDs[GATEWAYS[i]['roomTo']];
          gateway['roomTo'] = roomNumsToIDs[GATEWAYS[i]['roomFrom']];
          gateway['direction'] = OPPOSITE_DIRECTIONS[GATEWAYS[i]['direction']];
          Gateway.create(gateway, function(err, gateway) {});
        }

        /* Randomly place items */
        for (var i = 0; i < 6; i++) {
          /* Select a random room */
          var roomNum = Math.floor((Math.random() * Object.keys(roomNumsToIDs).length) + 1);
          /* Select random x and y coordinates */
          var x = Math.floor((Math.random() * 512) + 128); //Allow items from x = 128 to x = 640
          var y = Math.floor((Math.random() * 384) + 128); //Allow items from y = 128 to y = 512
          /* Select a random item type */
          var itemNum = Math.floor((Math.random() * ITEM_TYPES.length));
          /* Create item */
          Item.create({type: ITEM_TYPES[itemNum].type, stat: ITEM_TYPES[itemNum].stat, amount: 1, room: roomNumsToIDs[roomNum], x: x, y: y}, function(err, item) {});
        }
      });


      res.json(game.toJSON());
    });
  }
};

