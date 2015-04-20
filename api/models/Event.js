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

          Player.find({ game: event.game })
            .then(function(players) {
              /*
               * This needs to be initialized to 1 since stat updates are
               * currently handled client side and won't be updated until after
               * this callback is over.
               */
              var relicsFound = 1;

              _.each(players, function(p) {
                relicsFound += p.relics;
              });

              var hauntCutoff = Game.hauntCutoff(relicsFound, players.length);
              sails.log.info("the haunt cutoff is " + hauntCutoff);

              var rand = Math.random();
              sails.log.info("rand: " + rand);
              if (rand < hauntCutoff) {
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

