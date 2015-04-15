/**
 * ItemController
 *
 * @description :: Server-side logic for managing items
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  create: function(req, res) {
    var attrs = req.body;

    attrs.stat = Item.kinds[attrs.type].stat;
    attrs.amount = Item.kinds[attrs.type].amount;

    Item.create(attrs)
      .then(function(item) {
        Item.subscribe(req, item.id);
        Item.publishCreate(item);
        res.json(item);
      })
      .catch(function(err) {
        sails.log.error(err);
        res.json({ error: err });
      });
  },

  subscribe: function(req, res) {
    Item.findOne(req.params.id)
      .then(function(item) {
        Item.subscribe(req, item.id);
        res.json(item);
      })
      .catch(function(err) {
        sails.log.error(err);
        res.json(err);
      });
  },

	destroy: function(req, res) {
    Item.destroy(req.params.id)
      .then(function(items) {
        _.each(items, function(item) {
          Item.publishDestroy(item.id, req, {previous: item});
        });

        res.json(items);
      })
      .catch(function(err) {
        sails.log.error(err);
        res.json(err);
      });
  }
};
