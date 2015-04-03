/**
* Item.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  autoWatch: false,

  autosubscribe: ['destroy'],

  attributes: {
    type: {type: 'string',
           required: true},
    stat: {type: 'string',
           required: true},
    amount: {type: 'integer',
             required: true},
    gridX: {type: 'integer',
            required: true},
    gridY: {type: 'integer',
            required: true},
    room: {model: 'room',
           required: true},
    game: {model: 'game',
           required: true}
  }
};

