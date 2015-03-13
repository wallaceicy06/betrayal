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
                    for (var x = 0; x < game.players.length - 1; x++) {
                      var room = game.rooms[Math.floor(Math.random() * game.rooms.length)];

                      /* TODO: Move this stuff to a function, like getValidRandomLoc */
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
                      _.each(Room.layouts[room.name].objects, function(o) {
                        var x = o.gridX;
                        var y = o.gridY;

                        for (i = o.gridX; i < o.gridX + Game.sprites[o.id].gridW; i++) {
                          for (j = o.gridY; j < o.gridY + Game.sprites[o.id].gridH; j++) {
                            excludePts.push([i, j]);
                          }
                        }
                      });

                      var loc = RandomService.randomGridLoc(Room.dimensions.gridW,
                                                            Room.dimensions.gridH,
                                                            excludePts);
                      
                      Item.create({type: 'key',
                                   stat: 'keys',
                                   amount: 1,
                                   gridX: loc.x,
                                   gridY: loc.y,
                                   room: room})
                        .then(function(item) {
                          Room.message(item.room, {verb: 'itemCreated', item: item});
                        })
                        .catch(function(err) {
                          console.log(err);
                          res.json(err);
                        });
                    }
                  });
                }
                Game.update(game.id, {relicsRemaining: (game.relicsRemaining - 1)}, function(err, game) {});
              })
              .catch(function (err) {
                console.log(err);
                res.json(err);
              });
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

