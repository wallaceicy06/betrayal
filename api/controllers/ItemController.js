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
            Game.findOne(room.game).populate('players')
              .then(function (game) {
                if (game.relicsRemaining - 1 == 0) {
                  var playerNum = Math.floor(Math.random() * game.players.length);
                  var traitor = game.players[playerNum];
                  Game.update(game.id, {traitor: traitor}, function(err, updatedGame) {
                    if (err) {
                      console.log(err);
                      res.json(err);
                    }

                    Game.publishUpdate(game.id, {traitor: traitor});
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

