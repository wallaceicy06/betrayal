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

  interact: function(req, res) {
    /* If the object is not interactable, don't do anything. */
    if (Room.interactable[req.body.furniture] === undefined) {
      return res.json();
    }

    Event.destroy({room: req.params.id, container: req.body.furniture})
      .then(function(events) {

        var prefix = Room.interactable[req.body.furniture].prefix;

        if (events.length == 0) {
          console.log('No event found in ' + req.body.furniture + '.');
          return res.json({title: '',
                           flavorText: prefix,
                           text: 'Nothing happened.',
                           effect: {}});
        }

        /* There only should be one destroyed event at maximum. */
        var e = events[0];
        var card = Event.cards[e.card];

        res.json({
          title: card.title,
          flavorText: prefix + ' ' + card.flavorText,
          text: card.text,
          effect: card.effect
        });
      })
      .catch(function(err) {
        console.log(err);
        res.json(err);
      })
  },

  removeEvent: function(req, res) {
    Room.update(req.param('id'), {event: -1})
      .catch(function(err) {
        console.log(err);
        res.json(err);
      })
      .done(function() {
        res.json();
      });
  },
}
