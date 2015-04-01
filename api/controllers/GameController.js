/**
 * GameController
 *
 * @description :: Server-side logic for managing games
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
module.exports = {

  findOne: function(req, res) {
    Game.findOne(req.params.id)
        .populate('rooms')
        .populate('players')
        .populate('startingRoom')
      .then(function(game) {
        game.sprites = sails.config.gameconfig.sprites;
        game.haunts = sails.config.gameconfig.haunts;
        res.json(game);
      })
      .catch(function(err) {
        console.log(err);
        res.json(err);
      });
  },

  sendChatMessage: function(req, res) {
    Game.message(req.params.id, {message: req.body.message,
                                 verb: 'chat',
                                 playerID: req.body.playerID});
    res.json();
  },

	create: function(req, res) {
    Game.create({name: req.body.name, relicsRemaining: 3},
                 function(err, game) {

      if (err) {
        console.log(err);
        res.json(err);
        return;
      }

      Game.generateHouse(game, function(startRoom) {
        Game.update(game.id, {startingRoom: startRoom})
          .then(function(updatedGames) {
            var updatedGame = updatedGames[0];
            Game.publishCreate(updatedGame);
            res.json(updatedGame);
          })
          .catch(function(err) {
            console.log(err);
            res.json(err);
          });
      });
    });
  },

  update: function(req, res) {
    /* If this update is saying that the last relic was found, start haunt */
    if (req.body.relicsRemaining == 0) {
      Game.findOne(req.param('id')).populate('players')
        .then(function(game) {
          var traitor = game.players[Math.floor(Math.random() * game.players.length)];
          var allHaunts = Object.keys(Game.haunts);
          var haunt = allHaunts[Math.floor(Math.random() * allHaunts.length)];
          Game.update(game.id, {traitor: traitor, haunt: haunt})
            .then(function(updatedGames) {
              var updatedGame = updatedGames[0];

              Game.publishUpdate(updatedGame.id, {traitor: traitor, haunt: haunt});

              /* Create keys for heroes to pick up */
              for (var x = 0; x < updatedGame.players.length - 1; x++) {
                var allRooms = updatedGame.rooms.slice(1); //Rooms, excluding entryway
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
              Game.update(updatedGame.id, {keysRemaining: updatedGame.players.length-1}, function(err, game) {});
            })
            .catch(function(err) {
              console.log(err);
              res.json(err);
            });
        })
        .catch(function(err) {
          console.log(err);
          res.json(err);
        });
    } else {  /* Some other update */
      Game.update(req.param('id'), req.body)
        .then(function(games) {
          Game.publishUpdate(games[0].id, req.body);
          res.json(games[0].toJSON());
        })
        .catch(function(err) {
          console.log(err);
          res.json(err);
        });
    }
  },

  destroy: function(req, res) {
    Game.destroy(req.params.id)
      .then(function(games) {

        console.log(games);
        _.each(games, function(g) {
          Game.publishDestroy(g.id, req);
        })

        res.json(games);
      })
      .catch(function(err) {
        console.log(err);
        res.json(err);
      });
  }
};

