define([
], function() {

  'use strict';

  var _playerViewAdpt;

  var _id;
  var _name;
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

  function getID() {
    return _id;
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

  return function Player(id, name) {
    _id = id;
    _name = name;
    _speed = 5;
    _health = 5;
    _maxHealth = 5;
    _might = 2;
    _x = 64;
    _y = 64;

    this.installViewAdpt = installViewAdpt;
    this.getID = getID;
    this.getSpeed = getSpeed;
    this.getX = getX;
    this.getY = getY;
    this.setSpeed = setSpeed;
    this.setX = setX;
    this.setY = setY;
  }

});
