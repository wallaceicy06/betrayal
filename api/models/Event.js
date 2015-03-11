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
           required: true}
  },

  cards: sails.config.gameconfig.cards
};

