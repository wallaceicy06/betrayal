define([
    'underscore'
], function(_) {

  'use strict';

  function addItem(item) {
    this._items[item.id] = item;
    this._gameModelAdpt.onAddItem(item);
  }

  function removeItem(itemID) {
    delete this._items[itemID];
    this._gameModelAdpt.onRemoveItem(itemID);
  }

  function setLocked(direction, locked) {
    this.gatewaysOut[direction].locked = locked;

    this._gameModelAdpt.onGatewayChange(direction, locked);
  }

  return function Room(id, gatewaysOut, background, items, objects,
                       gameModelAdpt) {
    var that = this;

    this._items = {};
    this._gameModelAdpt = gameModelAdpt;

    var shortenedGateways = {};

    _.each(gatewaysOut, function(gateway) {
      shortenedGateways[gateway.direction] = { id: gateway.id,
                                               roomTo: gateway.roomTo,
                                               locked: gateway.locked };
    });

    Object.defineProperty(this, 'id', {
      value: id,
      writable: false
    })

    Object.defineProperty(this, 'gatewaysOut', {
      value: shortenedGateways,
      writable: false
    });

    Object.defineProperty(this, 'background', {
      value: background,
      writable: false
    });

    Object.defineProperty(this, 'items', {
      get: function() {
        return _.values(this._items);
      }
    });

    Object.defineProperty(this, 'objects', {
      value: objects,
      writable: false
    });

    this.addItem = addItem.bind(this);
    this.removeItem = removeItem.bind(this);
    this.setLocked = setLocked.bind(this);

    _.each(items, function(i) {
      that.addItem(i);
    });
  }
});
