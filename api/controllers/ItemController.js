/**
 * ItemController
 *
 * @description :: Server-side logic for managing items
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	destroy: function(req, res) {
    Item.findOne(req.param('id'), function (err, item) {
      if (err) {
        console.log(err);
        res.json(err);
        return;
      }

      if(item !== undefined) {
        Room.message(item.room, {id: item.id, verb: 'itemRemoved'});

        if (item.stat === 'relics') {
          Room.findOne(item.room, function (err, room) {
            if (err) {
              console.log(err);
              res.json(err);
            }

            //TODO: Find a cleaner way to do this
            Game.findOne(room.game).populate('players').populate('rooms')
              .then(function (game) {
                if (game.relicsRemaining - 1 == 0) {
                  var traitor = game.players[Math.floor(Math.random() * game.players.length)];
                  var allHaunts = Object.keys(Game.haunts);
                  var haunt = allHaunts[Math.floor(Math.random() * allHaunts.length)];
                  Game.update(game.id, {traitor: traitor, haunt: haunt}, function(err, updatedGame) {
                    if (err) {
                      console.log(err);
                      res.json(err);
                    }

                    Game.publishUpdate(game.id, {traitor: traitor, haunt: haunt});

                    /* Create keys for heroes to pick up */
                    for (var x = 0; x < (game.players.length - 1)*2; x++) {
                      var allRooms = game.rooms.slice(1); //Rooms, excluding entryway
                      var chosenRoom = allRooms[Math.floor(Math.random() * allRooms.length)];

                      var possibleLocs = Room.layouts[chosenRoom.name].itemLocs;
                      var loc = possibleLocs[Math.floor(Math.random() * possibleLocs.length)];

                      Item.create({type: 'key',
                                   stat: 'keys',
                                   amount: 1,
                                   gridX: loc.x,
                                   gridY: loc.y,
                                   room: chosenRoom})
                        .then(function(item) {
                          Room.message(item.room, {verb: 'itemCreated', item: item});
                        })
                        .catch(function(err) {
                          console.log(err);
                          res.json(err);
                        });
                    }
                    Game.update(game.id, {keysRemaining: (game.players.length-1)*2}, function(err, game) {});
                  });
                }
                Game.update(game.id, {relicsRemaining: (game.relicsRemaining - 1)}, function(err, game) {});
              })
              .catch(function (err) {
                console.log(err);
                res.json(err);
              });
          });
        } else if (item.stat === 'keys') {
          Room.findOne(item.room)
            .then(function(room) {
              Game.findOne(room.game).populate('players')
                .then(function(game) {
                  /* If we just picked up a key in the entryway, check if the heroes just won */
                  if (room.name === 'entryway' && game.keysRemaining-1 === 0) {
                    var won = true;
                    for (var i = 0; i < game.players.length; i++) {
                      var p = game.players[i];
                      if (!p.isTraitor && p.room !== room.id) {
                        won = false;
                      }
                    }
                    if (won) {
                      Game.message(game.id, {verb: 'heroesWon'});
                    }
                  }

                  /* Keep track of number of keys remaining */
                  Game.update(game.id, {keysRemaining: game.keysRemaining-1}, function(err, game) {});
                })
            })
            .catch(function(err) {
              console.log(err);
              res.json(err);
              return;
            });
        }

        Item.destroy({id: req.param('id')}, function(err, items) {
          if (err) {
            console.log(err);
            res.json(err);
            return;
          }
          res.json(items);
        });
      }
    });
  }
};

