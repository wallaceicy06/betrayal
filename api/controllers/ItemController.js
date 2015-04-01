/**
 * ItemController
 *
 * @description :: Server-side logic for managing items
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	destroy: function(req, res) {
    Item.destroy(req.params.id)
      .then(function(items) {
        res.json();
      })
      .catch(function(err) {
        sails.log.error(err);
        res.json(err);
      });

    return;

    Item.findOne(req.params.id).populate('room')
      .then(function(item) {

        if (item === undefined) {
          throw new Error('The item could not be found.');
        }

        return Item.destroy({id: req.param('id')});
      })
      .then(function(items) {

        _.each(items, function(item) {
          Item.publishDestroy(items, req, {previous: item});
        });

        res.json(items);
      })
      .catch(function(err) {
        sails.log.error(err);
        res.json(err);
      });;
  }
};

