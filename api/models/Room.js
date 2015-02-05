/**
* Room.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

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
    roomNum: {type: 'integer',
              required: true},
    background: {type: 'string',
                 required: true}
  }
};

