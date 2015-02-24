function itemIn(arr, item) {
  var i;
  for (i = 0; i < arr.length; i++) {
    if (_.isEqual(arr[i], item)) {
      return true;
    }
  }

  return false;
}

module.exports = {
  randomGridLoc: function(width, height, exclude) {
    if (exclude === undefined) {
      exclude = [];
    }

    var randX, randY;

    do {
      randX = Math.floor(Math.random() * width);
      randY = Math.floor(Math.random() * height);
    } while (itemIn(exclude, [randX, randY]));

    return {x: randX, y: randY};
  }
}
