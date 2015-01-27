define([
], function() {

  'use strict';

  var _playerViewAdpt;

  var _speed;
  var _health;
  var _maxHealth;
  var _might;
  var _x;
  var _y;

  function getSpeed() {
    return _speed;
  }

  function setSpeed(speed) {
    _speed = speed;
    _playerViewAdpt.onSpeedChange(_speed);
  }

  function getX() {
    return _x;
  }

  function setX(x) {
    _x = x;
  }

  function getY() {
    return _y;
  }

  function setY(y) {
    _y = y;
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

    this.installViewAdpt = installViewAdpt;
    this.getSpeed = getSpeed;
    this.getX = getX;
    this.getY = getY;
    this.setSpeed = setSpeed;
    this.setX = setX;
    this.setY = setY;
  }

});
