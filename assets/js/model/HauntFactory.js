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
      case 'poisonItems':
        return {
          usePower: function() {
            that._gameModelAdpt.dropItem('poisonLightning');
          }
        };
        break;
      default:
        return "Not a valid haunt";
    }
  }

  return function HauntFactory(gameModelAdpt) {
    this._gameModelAdpt = gameModelAdpt;

    this.makeHauntAdapter = makeHauntAdapter.bind(this);
  }

});
