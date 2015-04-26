/**
 * PlayerController
 *
 * @description :: Server-side logic for managing players
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	create: function(req, res) {
    var newPlayer;

    sails.promise.all([
      Player.count({game: req.body.game}),
      Room.findOne({game: req.body.game, name: 'entryway'})
    ]).spread(function(playerCount, entryway) {
        if (_.isEmpty(entryway)) {
          throw new Error('Entryway was not created for this house.');
        }

        var color = Player.assignColor(playerCount);

        return Player.create({name: _.escape(req.body.name),
                              game: req.body.game,
                              room: entryway,
                              socket: req.socket.id,
                              color: color,
                              sprite: color})
      })
      .then(function(player) {
        newPlayer = player;

        Room.subscribe(req, newPlayer.room, ['message']);

        return Player.find({game: newPlayer.game});
      })
      .then(function(players) {
        Player.watch(req);
        Player.subscribe(req, players, ['update', 'destroy']);

        /* Publish player creation */
        Player.publishCreate(newPlayer);

        res.json(newPlayer);
      })
      .catch(function(err) {
        sails.log.error(err);
        res.json(err);
      });
  },

  update: function(req, res) {
    Player.update(req.params.id, req.body)
      .then(function(players) {
        _.each(players, function(player) {
          if (req.body.locX !== undefined && req.body.locY !== undefined) {
            Room.message(player.room, { id: player.id,
                                        verb: 'playerUpdated',
                                        data: req.body },
                         req);
          } else {
            Player.publishUpdate(player.id, req.body, req);
          }
        });

        res.json(players);
      })
      .catch(function(err) {
        sails.log.error(err);
        res.json(err);
      });
  },

  destroy: function(req, res) {
    Player.destroy(req.params.id)
      .then(function(players) {
        _.each(players, function(player) {
          Player.publishDestroy(player.id, req);
        });

        res.json(players);
      })
      .catch(function(err) {
        sails.log.error(err);
        res.json(err);
      });
  },

  changeRoom: function(req, res) {
    var oldRoom;
    var player;

    sails.promise.all([
        Room.findOne(req.body.room).populate('players'),
        Player.findOne(req.params.id).populate('room')
      ])
      .spread(function(roomTo, player) {

        oldRoom = player.room;

        return [roomTo, Player.update(player.id, {room: req.body.room})];
      })
      .spread(function(room, players) {
        player = players[0];

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
        /* If we entered the entryway, see if the heroes have won */

        if (room.name === 'exit' && !player.isTraitor) {
          Game.checkWin(room.game, room.id);
        }
      })
      .catch(sails.promise.CancellationError, function(err) {
        sails.log.info('cancelled!');
      })
      .catch(function(err) {
        sails.log.error(err);
        res.json(err);
      });
  },

  adjustStat: function(req, res) {
    var updateObj = {};
    updateObj[req.body.stat] = req.body.newValue;

    Player.update(req.params.id, updateObj, function (err, updatedPlayers) {
      if (err) {
        sails.log.error(err);
        res.json(err);
        return;
      }
      if (updatedPlayers.length > 0) {
        Player.publishUpdate(updatedPlayers[0].id, updateObj);
      } else {
        sails.log.warn("Tried to update a player that doesn't exist");
      }
    });
  },

  attack: function(req, res) {
    var player;

    Player.findOne(req.params.id)
      .then(function(p) {
        player = p;

        return Room.findOne(player.room).populate('players');
      })
      .then(function(room) {
        /* Inform other players in roomthat we are attacking, so they can draw the attack animation */
        Room.message(room, { id: player.id,
                             verb: 'playerAttacked',
                             data: {id: player.id, locX: player.locX, locY: player.locY} });

        var attackRegion = Player.attackRegion(player.locX, player.locY);
        for (var i = 0; i < room.players.length; i++) {
          var otherPlayer = room.players[i];
          if (otherPlayer.id !== player.id
              && otherPlayer.locX < attackRegion.maxX
              && otherPlayer.locX > attackRegion.minX
              && otherPlayer.locY < attackRegion.maxY
              && otherPlayer.locY > attackRegion.minY) {
            /* Roll dice for combat based on weapon strength */
            var damage;
            var myRoll = 0;
            for (var j = 0; j < player.weapon; j++) {
              myRoll += Math.floor(Math.random() * 3); //0, 1, or 2
            }
            var otherRoll = 0;
            for (var j = 0; j < otherPlayer.weapon; j++) {
              otherRoll += Math.floor(Math.random() * 3);
            }
            damage = myRoll - otherRoll;

            /* No matter what, the traitor deals damage. */
            if (player.isTraitor && damage <= 0) {
              damage = 1;
            }

            if (damage <= 0) {
              Game.message(player.game,
                           {playerID: player.id,
                            message: player.name + " attacked "
                                     + otherPlayer.name
                                     + "! They were unharmed.",
                            verb: 'info'});
            }
            else {
              Game.message(player.game, {playerID: player.id,
                                         message: player.name + " attacked "
                                                  + otherPlayer.name + "! "
                                                  + otherPlayer.name + " took "
                                                  + damage + " damage.",
                                         verb: 'info'});
              var updateObj = {health: otherPlayer.health - damage};
              Player.update(otherPlayer.id, updateObj);
              Player.publishUpdate(otherPlayer.id, updateObj);
            }
          }
        }
        res.json();
      })
      .catch(function(err) {
        sails.log.error(err);
        res.json(err);
      });
  },

  subscribe: function(req, res) {
    Player.findOne(req.params.id)
      .then(function(player) {
        Player.subscribe(req, player, ['update', 'destroy']);
      })
      .catch(function(err) {
        sails.log.error(err);
        res.json(err);
      });
  }
};

