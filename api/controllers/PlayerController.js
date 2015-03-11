/**
 * PlayerController
 *
 * @description :: Server-side logic for managing players
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	create: function(req, res) {
    var newPlayer;

    Player.create({name: req.body.name,
                   game: req.body.game,
                   room: req.body.room,
                   locX: 64,
                   locY: 64,
                   socket: req.socket.id,
                   color: req.body.color,
                   maxHealth: 3,
                   curHealth: 3,
                   speed: 5,
                   weapon: 1,
                   relics: 0})
      .then(function(player) {
        newPlayer = player;

        Room.subscribe(req, newPlayer.room, ['message']);

        return Player.find({game: newPlayer.game});
      })
      .then(function(players) {
        Player.subscribe(req, players, ['update', 'destroy']);

        /* Publish player creation */
        Player.publishCreate(newPlayer);

        res.json(newPlayer);
      })
      .catch(function(err) {
        console.log(err);
        res.json(err);
      });
  },

  update: function(req, res) {

    Player.update(req.param('id'), req.body)
      .then(function(players) {
        var updatedPlayer = players[0];

        if (req.body.locX !== undefined && req.body.locY !== undefined) {
          Room.message(updatedPlayer.room, {id: updatedPlayer.id,
                                            verb: 'playerUpdated',
                                            data: req.body});
        } else if (req.body.color !== undefined) {
          Player.publishUpdate(updatedPlayer.id, {color: req.body.color});
        }

        res.json(updatedPlayer.toJSON());
      })
      .catch(function(err) {
        console.log(err);
        res.json(err);
      });
  },

  changeRoom: function(req, res) {
    var oldRoom;
    var player;

    Player.findOne(req.params.id).populate('room')
      .then(function(player) {
        oldRoom = player.room;

        return Player.update(player.id, {room: req.body.room});
      })
      .then(function(players) {
        player = players[0];

        return Room.findOne(player.room).populate('players');
      })
      .then(function(room) {
        /*
         * Unsubscribe player from the room they used to be in on the 'message'
         * context. It is super important to pass the 'message' context
         * otherwise the player will never be able to subscribe to a room
         * again. Subscribe them to their new room under the message context.
         */
        Room.unsubscribe(req, oldRoom, ['message']);
        Room.subscribe(req, room.id, ['message']);

        Player.publishUpdate(player.id, {room: player.room});

        res.json(room.players);
      })
      .catch(function(err) {
        console.log(err);
        res.json(err);
      });
  },

  adjustStat: function(req, res) {
    var updateObj = {};
    updateObj[req.body.stat] = req.body.newValue;

    Player.update(req.params.id, updateObj, function (err, updatedPlayers) {
      if (err) {
        console.log(err);
        res.json(err);
        return;
      }

      Player.publishUpdate(updatedPlayers[0].id, updateObj);
    });
  },

  subscribe: function(req, res) {
    Player.findOne(req.params.id)
      .then(function(player) {
        Player.subscribe(req, player, ['update', 'destroy']);
      })
      .catch(function(err) {
        console.log(err);
        res.json(err);
      });
  }
};

