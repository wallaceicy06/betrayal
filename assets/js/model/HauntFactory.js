define([
], function() {

  'use strict';

  /*
   * Creates and returns a haunt adapter for the given haunt name
   */
  function makeHauntAdapter(hauntName) {
    var that = this;
    //var hauntAdpt;

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
        return "Not a valid haunt";
    }
  }

  return function HauntFactory(gameModelAdpt) {
    this._gameModelAdpt = gameModelAdpt;

    this.makeHauntAdapter = makeHauntAdapter.bind(this);
  }

});
