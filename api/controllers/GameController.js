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
        Player.subscribe(req, game.players, ['update', 'destroy']);
        res.json(game);
      })
      .catch(function(err) {
        sails.log.error(err);
        res.json(err);
      });
  },

  sendChatMessage: function(req, res) {
    Game.message(req.params.id, {message: _.escape(req.body.message),
                                 verb: 'chat',
                                 playerID: req.body.playerID});
    res.json();
  },

  randomItemLoc: function(req, res) {
    Game.findOne(req.params.id).populate('rooms')
      .then(function(game) {
        var allRooms = game.rooms;
        var chosenRoom;
        var possibleLocs = [];

        while (possibleLocs.length == 0) {
          chosenRoom = allRooms[Math.floor(Math.random() * allRooms.length)];
          possibleLocs = Room.layouts[chosenRoom.name].itemLocs;
        }

        var loc = possibleLocs[Math.floor(Math.random() * possibleLocs.length)];

        res.json({room: chosenRoom.id, locX: loc.x, locY: loc.y});
      })
      .catch(function(err) {
        sails.log.error(err);
        res.json(err);
      });
  },

	create: function(req, res) {
    Game.create({name: _.escape(req.body.name)},
                 function(err, game) {

      if (err) {
        sails.log.error(err);
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
            sails.log.error(err);
            res.json(err);
          });
      });
    });
  },

  update: function(req, res) {
    Game.update(req.param('id'), req.body)
      .then(function(games) {
        Game.publishUpdate(games[0].id, req.body);
        res.json(games[0].toJSON());
      })
      .catch(function(err) {
        console.log(err);
        res.json(err);
      });
  },

  destroy: function(req, res) {
    Game.destroy(req.params.id)
      .then(function(games) {

        _.each(games, function(g) {
          Game.publishDestroy(g.id, req);
        })

        res.json(games);
      })
      .catch(function(err) {
        sails.log.error(err);
        res.json(err);
      });
  }
};

