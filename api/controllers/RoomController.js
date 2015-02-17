/**
 * RoomController
 *
 * @description :: Server-side logic for managing rooms
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  removeEvent: function(req, res) {
    Room.update(req.param('id'), {event: -1}, function(err, rooms) {});
  }
};

