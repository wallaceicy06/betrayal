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

  return function MapNode(color) {
    this._gateways = {};

    Object.defineProperty(this, 'color', {
      value: color,
      writable: false
    });

    this.getGateway = getGateway.bind(this);
    this.setGateway = setGateway.bind(this);
    this.hasGateway = hasGateway.bind(this);
  }
});
