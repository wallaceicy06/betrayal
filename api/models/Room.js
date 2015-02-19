/**
* Room.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  autoWatch: false,

  attributes: {
    name: {type: 'string',
           required: true},
    gatewaysOut: {collection: 'gateway',
                  via: 'roomFrom'},
    gatewaysIn: {collection: 'gateway',
                 via: 'roomTo'},
    players: {collection: 'player',
              via: 'room'},
    game: {model: 'game',
           required: true},
    background: {type: 'string',
                 required: true},
    items: {collection: 'item',
            via: 'room'},
    furniture: {collection: 'furniture',
                via: 'room'}
  },

  layouts: sails.config.gameconfig.rooms

};
