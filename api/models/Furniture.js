/**
* Furniture.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    type: {type: 'string',
           required: true},
    room: {model: 'room',
           required: true},
    item: {model: 'item',
           required: false},
    x: {type: 'integer',
        required: true},
    y: {type: 'integer',
        required: true}
  }
};
