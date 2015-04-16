/**
* Gateway.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  autoWatch: false,

  autosubscribe: ['update'],

  attributes: {
    roomFrom: {model: 'room',
               required: true},
    roomTo: {model: 'room',
             required: true},
    direction: {type: 'string',
			          required: true},
    locked: {type: 'boolean',
             required: true,
             defaultsTo: false}
  },

  afterUpdate: function(gateway, cb) {
    Gateway.findOne({roomFrom: gateway.roomTo, roomTo: gateway.roomFrom})
      .then(function(otherGateway) {
        if (otherGateway.locked == gateway.locked) {
          throw new sails.promise.CancellationError();
        }
        return Gateway.update(otherGateway.id, {locked: gateway.locked});
      }).then(function(updatedGateways) {
        _.each(updatedGateways, function(updatedGateway) {
          Gateway.publishUpdate(updatedGateway.id, updatedGateway);
        });
      })
      .catch(sails.promise.CancellationError, function(err) {
        /* Do nothing */
      })
      .catch(function(err) {
        sails.log.error(err);
      });
    cb();
  }
};

