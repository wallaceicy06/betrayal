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
            Game.findOne(room.game, function (err, game) {
              if (err) {
                console.log(err);
                res.json(err);
              }

              if (game.relicsRemaining - 1 == 0) {
                Game.publishUpdate(game.id, {relicsRemaining: (game.relicsRemaining - 1)});
              }
              Game.update(game.id, {relicsRemaining: (game.relicsRemaining - 1)}, function(err, game) {});
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

