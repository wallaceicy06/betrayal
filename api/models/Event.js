/**
* Event.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  autoWatch: false,

  autosubscribe: [],

  attributes: {
    room: {model: 'room',
           required: true},
    container: {type: 'string',
                required: true},
    card: {type: 'string',
           required: true},
    game: {model: 'game',
           required: true}
  },

  afterDestroy: function (events, cb) {
    _.each(events, function(event) {
      for (var stat in Event.cards[event.card].effect) {
        if (stat === 'relics') {

          Event.count({card: {'contains': 'relic'}, game: event.game})
            .then(function(numRelics) {

              sails.log.info('relics remaining: ' + numRelics);
              if (numRelics == 0 && event.game.haunt == undefined) {
                Game.startHaunt(event.game);
              }

            })
            .catch(function(err) {
              sails.log.error(err);
            });

        }
      }
    });

    cb();
  },

  cards: sails.config.gameconfig.cards
};

