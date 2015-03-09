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
        game.events = sails.config.gameconfig.events;
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
                                 playerID: req.body.playerID});
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
  }
};

