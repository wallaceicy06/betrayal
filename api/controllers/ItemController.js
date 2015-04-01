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

        if (item.stat === 'keys') {
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

