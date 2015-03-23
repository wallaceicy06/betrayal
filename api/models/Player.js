/**
* Player.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  autoWatch: false,

  autosubscribe: [],

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
    direction: {type: 'string',
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

  ATTACK_RADIUS: 64,

  getAttackRegion: function(direction, locX, locY) {
    /* Base attack region on direction you are facing */
    var region = {}
    switch(direction) {
      case 'east':
        region['minX'] = locX;
        region['maxX'] = locX + Player.ATTACK_RADIUS;
        region['minY'] = locY - Player.ATTACK_RADIUS;
        region['maxY'] = locY + Player.ATTACK_RADIUS;
        break;
      case 'west':
        region['minX'] = locX - Player.ATTACK_RADIUS;
        region['maxX'] = locX;
        region['minY'] = locY - Player.ATTACK_RADIUS;
        region['maxY'] = locY + Player.ATTACK_RADIUS;
        break;
      case 'north':
        region['minX'] = locX - Player.ATTACK_RADIUS;
        region['maxX'] = locX + Player.ATTACK_RADIUS;
        region['minY'] = locY - Player.ATTACK_RADIUS;
        region['maxY'] = locY;
        break;
      case 'south':
        region['minX'] = locX - Player.ATTACK_RADIUS;
        region['maxX'] = locX + Player.ATTACK_RADIUS;
        region['minY'] = locY;
        region['maxY'] = locY + Player.ATTACK_RADIUS;
        break;
    }
    return region;
  }
};

