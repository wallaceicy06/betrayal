/**
 * RoomController
 *
 * @description :: Server-side logic for managing rooms
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  findOne: function(req, res) {
    Room.findOne(req.params.id).populate('gatewaysOut').populate('items')
      .then(function(room) {
        var roomMod = room;

        roomMod.objects = Room.layouts[room.name].objects

        res.json(roomMod);
      })
      .catch(function(err) {
        console.log(err);
        res.json(err);
      })
  },

  removeEvent: function(req, res) {
    Room.update(req.param('id'), {event: -1}, function(err, rooms) {});
  },

  subs: function(req, res) {
    var idToPlayer = {};

    Player.find({})
      .then(function(found) {

        _.each(found, function(i) {
          idToPlayer[i.socket] = i.name;
        });

        console.log(idToPlayer);

        return Room.find({});
      })
      .then(function(rooms) {
        var subs = {};

        _.each(rooms, function(i) {
          var s = [];

          _.each(Room.subscribers(i), function(r) {
            s.push(idToPlayer[r.id]);
          });

          subs[i.name] = s;
        });

        console.log(subs);
        res.json(subs);
      })
      .catch(function(err) {
        console.log(err);
        res.json(err);
      });
  },
}
