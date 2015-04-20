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

        roomMod.objects = Room.layouts[room.name].objects;

        _.each(roomMod.objects, function(o) {
          if (Room.interactable[o.type] !== undefined) {
            o.interactable = true;
          } else {
            o.interactable = false;
          }
        });

        /* Subscribe the requester to items that they see in this room. */
        Item.subscribe(req, room.items);

        /* Subscribe the requester to the gateways in this room. */
        Gateway.subscribe(req, room.gatewaysOut, ['update']);

        /* Make sure the requester watches for new items created. */
        Item.watch(req);

        res.json(roomMod);
      })
      .catch(function(err) {
        sails.log.error(err);
        res.json(err);
      })
  },

  interact: function(req, res) {
    var furnitureType;

    Room.findOne(req.params.id)
      .then(function(room) {
        furnitureType = Room.layouts[room.name]
                            .objects[req.body.furnitureID]
                            .type;

        /* If the object is not interactable, don't do anything. */
        if (Room.interactable[furnitureType] === undefined) {
          //throw new Error(furnitureType + " is not interactable.");
          sails.log.error(furnitureType + " is not interactable.");
          res.json(err);
          return;
        }

        return Event.destroy({room: req.params.id, container: req.body.furnitureID})
      })
      .then(function(events) {

        var prefix = Room.interactable[furnitureType].prefix;

        if (events.length == 0) {
          return res.json({ title: '',
                            flavorText: prefix,
                            text: 'Nothing happened.',
                            effect: null,
                            sound: null });
        }

        /* There only should be one destroyed event at maximum. */
        var e = events[0];
        var card = Event.cards[e.card];

        res.json({
          title: card.title,
          flavorText: prefix + ' ' + card.flavorText,
          text: card.text,
          effect: card.effect,
          sound: card.sound
        });
      })
      .catch(function(err) {
        sails.log.error(err);
        res.json(err);
      })
  },

  removeEvent: function(req, res) {
    Room.update(req.param('id'), {event: -1})
      .catch(function(err) {
        sails.log.error(err);
        res.json(err);
      })
      .done(function() {
        res.json();
      });
  },
}
