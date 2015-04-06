/**
* Player.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  autoWatch: false,

  autosubscribe: ['update', 'destroy'],

  attributes: {
    name: {type: 'string',
           required: true},
    game: {model: 'game',
           required: true},
    room: {model: 'room',
           required: true},
    locX: {type: 'integer',
           required: true},
    locY: {type: 'integer',
           required: true},
    socket: {type: 'string',
             required: true},
    color: {type: 'string',
             required: true},
    maxHealth: {type: 'integer',
                required: true},
    curHealth: {type: 'integer',
                required: true},
    weapon: {type: 'integer',
             required: true},
    relics: {type: 'integer',
             required: true},
    keys: {type: 'integer',
           required: true},
    speed: {type: 'integer',
            required: true},
    isTraitor: {type: 'boolean',
                required: true}
  },

  ATTACK_RADIUS: 42,

  afterUpdate: function(player, cb) {
    if (player.curHealth < 1) {
      sails.log.info('destroying ' + player.name);
      Player.destroy(player.id);
      Player.publishDestroy(player.id, {});
    }
    cb();
  },

  afterDestroy: function(players, cb) {
    var tileW = Room.dimensions.tileW;

    _.each(players, function(player) {

      Player.count({game: player.game})
        .then(function(count) {
          Game.destroy(player.game)
            .then(function(destroyed) {
              _.each(destroyed, function(game) {
                Game.publishDestroy(game.id);
              });
            })
            .catch(function(err) {
              sails.log.error(err);
            });
        })
        .catch(function(err) {
          sails.log.error(err);
        });

      _.times(player.keys, function(i) {


        sails.log.info('creating spawned key death thing');
        Item.create({type: 'key',
                     stat: 'keys',
                     amount: 1,
                     room: player.room,
                     gridX: Math.round(player.locX/tileW),
                     gridY: Math.round(player.locY/tileW),
                     game: player.game})
          .then(function(item) {
            Item.publishCreate(item);
          })
          .catch(function(err) {
            sails.log.error(err);
          });

      });
    });

    cb();
  },

  attackRegion: function(locX, locY) {
    return {
      minX: locX - Player.ATTACK_RADIUS,
      maxX: locX + Player.ATTACK_RADIUS,
      minY: locY - Player.ATTACK_RADIUS,
      maxY: locY + Player.ATTACK_RADIUS
    };
  }
};

