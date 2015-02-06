/**
 * PlayerController
 *
 * @description :: Server-side logic for managing players
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	create: function(req, res) {
    Player.create({name: req.body.name,
                   game: req.body.game,
                   room: req.body.room,
                   locX: 64,
                   locY: 64,
                   socket: req.socket.id},
                  function(err, player) {
      if (err) {
        console.log(err);
        res.json(err);
        return;
      }

      /* Subscribe this player to all other players in game */
      Player.find({game: player.game}, function(err, players) {
        if (err) {
          console.log(err);
        }

        /* Remove this player from players to prevent it from subscribing to itself? */
        Player.subscribe(req.socket, players);
        players.forEach(function(v, i, a) {
          Player.subscribe(v.socket, player);
        });

        /* Publish player creation */
        Player.publishCreate(player);
      });

      res.json(player.toJSON());
    });
  },

  update: function(req, res) {

    Player.update(req.param('id'), {locX: req.body.locX,
                                    locY: req.body.locY},
                  function (err, players) {
      var updatedPlayer = players[0];

      if (err) {
        console.log(err);
        res.json(err);
        return;
      }

      Player.publishUpdate(updatedPlayer.id, {locX: updatedPlayer.locX, locY : updatedPlayer.locY});

      res.json(updatedPlayer.toJSON());
    });
  },

  changeRoom: function(req, res) {
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
        Room.subscribe(req.socket, updatedPlayer.room,
                       ['add:players', 'remove:players']);

        Room.publishAdd(updatedPlayer.room.id, 'players', updatedPlayer.id);
        Room.publishRemove(oldRoom, 'players', updatedPlayer.id);

        Player.publishUpdate(updatedPlayer.id, {room: updatedPlayer.room.id});

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

