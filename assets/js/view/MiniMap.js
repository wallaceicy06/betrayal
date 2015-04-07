define([
    'underscore',
    'easel'
], function(_, Easel) {

  'use strict';

  var TILE_WIDTH = 32;
  var CANVAS_WIDTH = 253;
  var CANVAS_HEIGHT = 253;

  function initCanvas() {
    this._stage = new Easel.Stage(this._viewAdpt.getMiniMapID());
    this._stage.canvas.width = CANVAS_WIDTH;
    this._stage.canvas.height = CANVAS_HEIGHT;
  }

  function reset() {
    this._stage.removeAllChildren();
    this._stage.update();
  }

  function drawMap(allRooms, startingRoomID) {
    var that = this;

    this._stage.removeAllChildren();
    this._stage.update();

    var toVisit = [{ room: allRooms[startingRoomID],
                     x: CANVAS_WIDTH / 2 - (TILE_WIDTH / 2),
                     y: CANVAS_HEIGHT / 2 - (TILE_WIDTH / 2) }];
    var visited = {};

    console.log('BEGIN DRAW');
    while (toVisit.length > 0) {
      var curNode;

      curNode = toVisit.shift();
      visited[curNode.room.id] = true;

      /* Draw the room. */
      var rect = new Easel.Shape();
      rect.graphics.beginFill(curNode.room.background).drawRect(curNode.x, curNode.y, TILE_WIDTH, TILE_WIDTH);
      rect.graphics.beginStroke('black').drawRect(curNode.x, curNode.y, TILE_WIDTH, TILE_WIDTH);
      this._stage.addChild(rect);

      console.log('drawing at ' + curNode.x + ', ' + curNode.y);

      /* If other players in room, draw them. */
      _.each(this._viewAdpt.getOtherPlayerAdpts(), function(playerAdpt) {
        if (curNode.room.id === playerAdpt.getRoom()) {
          var dot = new Easel.Shape();
          dot.graphics.beginFill(playerAdpt.getColor()).drawCircle(curNode.x + TILE_WIDTH / 2,
                                                                   curNode.y + TILE_WIDTH / 2,
                                                                   TILE_WIDTH / 2);
          that._stage.addChild(dot);
        }
      });

      /* Draw ourselves after other players so we are on top. */
      var playerAdpt = this._viewAdpt.getPlayerAdpt();
      if (curNode.room.id === playerAdpt.getRoom()) {
        var dot = new Easel.Shape();
        dot.graphics.beginFill(playerAdpt.getColor()).drawCircle(curNode.x + TILE_WIDTH / 2,
                                                                 curNode.y + TILE_WIDTH / 2,
                                                                 TILE_WIDTH / 2);
        this._stage.addChild(dot);
      }

      _.each(curNode.room.gatewaysOut, function(gateway) {
        if (visited[gateway.roomTo] === undefined && gateway.roomTo in allRooms) {
          var newX = curNode.x;
          var newY = curNode.y;

          switch (gateway.direction) {
            case 'north':
              newY -= TILE_WIDTH;
              break;
            case 'east':
              newX += TILE_WIDTH;
              break;
            case 'south':
              newY += TILE_WIDTH;
              break;
            case 'west':
              newX -= TILE_WIDTH;
              break;
            default:
              break;
          }

          toVisit.push({ room: allRooms[gateway.roomTo],
                         x: newX,
                         y: newY });
        }

      });

      this._stage.update(); // TODO remove later

      // _.each(curNode.room.gatewaysOut, function(roomID) {
        // toVisit.push({room: allRooms[roomID]});
      // });

      // if (curNode.room.hasGateway('north')) {
        // toVisit.push({room: curNode.room.getGateway('north'),
                      // x: curNode.x, y: curNode.y - TILE_WIDTH});
      // }

      // if (curNode.room.hasGateway('east')) {
        // toVisit.push({room: curNode.room.getGateway('east'),
                      // x: curNode.x + TILE_WIDTH, y: curNode.y});
      // }

      // if (curNode.room.hasGateway('south')) {
        // toVisit.push({room: curNode.room.getGateway('south'),
                      // x: curNode.x, y: curNode.y + TILE_WIDTH});
      // }

      // if (curNode.room.hasGateway('west')) {
        // toVisit.push({room: curNode.room.getGateway('west'),
                      // x: curNode.x - TILE_WIDTH, y: curNode.y});
      // }
    }
    console.log('END DRAW');


    this._stage.update();
  }

  return function MiniMap(viewAdpt) {
    this._viewAdpt = viewAdpt;
    this._stage = null;

    initCanvas.call(this);

    this.drawMap = drawMap.bind(this);
    this.reset = reset.bind(this);
  }
});
