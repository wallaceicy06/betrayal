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
        return {
          itemList: ['poisonLightning', 'poisonFirstAid', 'poisonHeart', 'poisonFlame'],
          nextItem: 0,

          usePower: function() {
            that._gameModelAdpt.dropItem(this.itemList[this.nextItem]);
            this.nextItem = (this.nextItem + 1) % this.itemList.length;
          }
        };
        break;
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
