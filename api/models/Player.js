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
           required: true,
           defaultsTo: sails.config.gameconfig.playerDefaults.locX},
    locY: {type: 'integer',
           required: true,
           defaultsTo: sails.config.gameconfig.playerDefaults.locY},
    socket: {type: 'string',
             required: true},
    color: {type: 'string',
            required: true,
            defaultsTo: sails.config.gameconfig.playerDefaults.color},
    sprite: {type: 'string',
             required: true,
             defaultsTo: sails.config.gameconfig.playerDefaults.sprite},
    maxHealth: {type: 'integer',
                required: true,
                defaultsTo: sails.config.gameconfig.playerDefaults.maxHealth},
    curHealth: {type: 'integer',
                required: true,
                defaultsTo: sails.config.gameconfig.playerDefaults.curHealth},
    weapon: {type: 'integer',
             required: true,
             defaultsTo: sails.config.gameconfig.playerDefaults.weapon},
    relics: {type: 'integer',
             required: true,
             defaultsTo: sails.config.gameconfig.playerDefaults.relics},
    keys: {type: 'integer',
           required: true,
           defaultsTo: sails.config.gameconfig.playerDefaults.keys},
    speed: {type: 'integer',
            required: true,
            defaultsTo: sails.config.gameconfig.playerDefaults.speed},
    isTraitor: {type: 'boolean',
                required: true,
                defaultsTo: sails.config.gameconfig.playerDefaults.isTraitor}
  },

  ATTACK_RADIUS: 42,

  defaults: sails.config.gameconfig.playerDefaults,

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

      Game.findOne(player.game)
        .then(function(game) {
          if (game.haunt !== undefined && !player.isTraitor) {
            Game.message(player.game, {verb: 'traitorWon'});
          }

          return [game, Player.count({game: player.game})];
        })
        .spread(function(game, count) {
          if (game.haunt === undefined && count < Game.minPlayers) {
            return Game.destroy(player.game);
          } else if (game.haunt !== undefined && count === 0) {
            return Game.destroy(player.game);
          } else {
            return [];
          }
        })
        .then(function(destroyed) {
          _.each(destroyed, function(game) {
            Game.publishDestroy(game.id);
          });
        })
        .catch(function(err) {
          sails.log.error(err);
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

