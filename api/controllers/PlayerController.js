/**
 * PlayerController
 *
 * @description :: Server-side logic for managing players
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	create: function(req, res) {
    Player.create({name: req.body.name, room: 1, locX: 64, locY: 64}, function(err, player) {
      if (err) {
        console.log(err);
        res.json(err);
        return;
      }
      res.json(player.toJSON());
    });
  }
};

