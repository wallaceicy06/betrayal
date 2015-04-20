define([
], function() {

  'use strict';

  /*
   * Creates and returns a haunt adapter for the given haunt name
   */
  function makeHauntAdapter(hauntName) {
    var that = this;

    switch(hauntName) {
      case 'plant':
        return {
          spriteList: ['blue', 'red', 'green', 'purple', 'key'],
          nextSprite: 0,

          usePower: function() {
            that._gameModelAdpt.changeSprite(this.spriteList[this.nextSprite]);
            this.nextSprite = (this.nextSprite + 1) % this.spriteList.length;
          }
        };
        break;
      case 'poisonItems':
        var MIN_POISON_DROP = 8000;

        return {
          itemList: ['poisonLightning', 'poisonFirstAid', 'poisonHeart', 'poisonFlame'],
          nextItem: 0,
          lastPlace: new Date().getTime(),

          usePower: function() {
            var curTime = new Date().getTime();
            if (curTime - this.lastPlace > MIN_POISON_DROP) {
              that._gameModelAdpt.dropItem(this.itemList[this.nextItem]);
              this.nextItem = (this.nextItem + 1) % this.itemList.length;
              this.lastPlace = curTime;
            }
          }
        };
        break;
      case 'lockedDoors':
        return {
          locksRemaining: 3,

          usePower: function() {
            if (this.locksRemaining < 1) {
              console.log("Out of locks");
              return;
            }
            if (that._gameModelAdpt.lockDoor()) {
              this.locksRemaining--;
            }
          }
        }
      default:
        return {
          /* Null adpater. */
          usePower: function() {

          }
        }
    }
  }

  return function HauntFactory(gameModelAdpt) {
    this._gameModelAdpt = gameModelAdpt;

    this.makeHauntAdapter = makeHauntAdapter.bind(this);
  }

});
