define([
], function() {

  'use strict';

  var _playerViewAdpt;

  var _speed;
  var _health;
  var _maxHealth;
  var _might;

  function getSpeed() {
    return _speed;
  }

  function setSpeed(speed) {
    _speed = speed;
    _playerViewAdpt.onSpeedChange(_speed);
  }

  function installViewAdpt(playerViewAdpt) {
    _playerViewAdpt = playerViewAdpt;
  }

  return function Player(playerViewAdpt) {
    _speed = 5;
    _health = 5;
    _maxHealth = 5;
    _might = 2;

    _playerViewAdpt = playerViewAdpt;

    this.getSpeed = getSpeed;
    this.setSpeed = setSpeed;
    this.installViewAdpt = installViewAdpt;
  }

});
