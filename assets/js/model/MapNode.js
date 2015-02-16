define([], function() {

  'use strict';

  function getGateway(direction) {
    return this._gateways[direction];
  }

  function setGateway(direction, node) {
    this._gateways[direction] = node;
  }

  function hasGateway(direction) {
    return (this._gateways[direction] !== undefined);
  }

  return function MapNode(roomID, name) {
    this._gateways = {};

    Object.defineProperty(this, 'id', {
      value: roomID,
      writable: false
    });

    Object.defineProperty(this, 'name', {
      value: name,
      writable: false
    });

    this.getGateway = getGateway.bind(this);
    this.setGateway = setGateway.bind(this);
    this.hasGateway = hasGateway.bind(this);
  }
});
