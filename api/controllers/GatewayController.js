/**
 * GatewayController
 *
 * @description :: Server-side logic for managing gateways
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  update: function (req, res) {
    if (req.body.locked === undefined) {
      res.json();
    }

    Gateway.findOne(req.params.id)
      .then(function(gateway) {
        /* If no update would take place, then return nothing. */
        if (gateway.locked === req.body.locked) {
          throw new sails.promise.CancellationError();
        }

        return Gateway.update(req.params.id, { locked: req.body.locked })
      })
      .then(function(gateways) {
        _.each(gateways, function(gateway) {
          Gateway.publishUpdate(gateway.id, { locked: gateway.locked }, req);
        });

        res.json(gateways);
      })
      .catch(sails.promise.CancellationError, function(err) {
        res.json();
      })
      .catch(function(err) {
        sails.log.error(err);
        res.json({ error: err });
      });
  }

};

