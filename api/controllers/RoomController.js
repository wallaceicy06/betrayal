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
  }
};

