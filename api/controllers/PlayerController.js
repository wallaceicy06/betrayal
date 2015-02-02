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
  },

  update: function(req, res) {
    console.log(req.body);

    // Player.update(req.param('id'), {room: req.body.room}, function (err, players) {
    Player.findOne(req.param('id'), function (err, player) {
      if (err) {
        console.log(err);
        res.json(err);
        return;
      }

      var oldRoom = player.room;

      player.room = req.body.room;
      player.save(function(err, updatedPlayer) {
        Room.unsubscribe(req.socket, oldRoom);
        Room.subscribe(req.socket, updatedPlayer.room, ['add:players', 'remove:players']);

        Room.publishAdd(updatedPlayer.room.id, 'players', updatedPlayer.id);
        Room.publishRemove(oldRoom, 'players', updatedPlayer.id);
        
        console.log("Old Room: " + oldRoom);
        console.log("Updated Room: " + updatedPlayer.room.id);

        res.json(updatedPlayer.toJSON());
      });
    });
  },

  destroyAll: function(req, res) {
    Player.find({}, function(err, found) {
      found.forEach(function(v, i, a) {
        v.destroy();
      });

      res.json([]);
    });
  }
};

