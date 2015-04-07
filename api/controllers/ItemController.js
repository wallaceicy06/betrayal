/**
 * ItemController
 *
 * @description :: Server-side logic for managing items
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

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
