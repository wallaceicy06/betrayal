module.exports.gameconfig = {
  minPlayers: 2,
  interactable: {
    rug: {
      prefix: 'You pull back a corner of the rug.'
    },
    couch: {
      prefix: 'You lift a couch cushion.'
    },
    armchair: {
      prefix: 'You look behind the armchair.'
    },
    woodTable: {
      prefix: 'You peek under the table.'
    },
    kitchenSink: {
      prefix: 'You open the cupboard under the sink.'
    },
    plant: {
      prefix: 'You open the plant leaves.'
    },
    chair: {
      prefix: 'You sit down in the chair.'
    },
    loveseat: {
      prefix: 'You look behind the loveseat.'
    },
    toilet: {
      prefix: 'You peer into the toilet bowl.'
    },
    endTable: {
      prefix: 'You open the drawer of the nightstand.'
    },
    bookshelf: {
      prefix: 'You pull back a book from the shelf.'
    },
    sink: {
      prefix: 'You turn on the faucet.'
    },
    squareTable: {
      prefix: 'You bend over and look under the coffee table.'
    },
    piano: {
      prefix: 'You begin playing chopsticks on the piano.'
    },
    pianoBench: {
      prefix: 'You look under the piano bench.'
    },
    bathtub: {
      prefix: 'You slip in the tub.'
    },
    poolTable: {
      prefix: 'You meet a ghost and take it up on game of pool.'
    },
    blueBed : {
      prefix: 'You look under the bed.'
    },
    redBed : {
      prefix: 'You look under the bed.'
    },
    stove : {
      prefix: 'You open the oven.'
    },
  },
  sprites: {
    'couch': {gridX: 0, gridY: 0, gridW: 4, gridH: 2},
    'armchair': {gridX: 4, gridY: 0, gridW: 2, gridH: 2},
    'woodTable': {gridX: 6, gridY: 0, gridW: 4, gridH: 2},
    'graniteCounter': {gridX: 10, gridY: 0, gridW: 4, gridH: 2},
    'kitchenSink': {gridX: 14, gridY: 0, gridW: 2, gridH: 2},
    'plant': {gridX: 0, gridY: 2, gridW: 1, gridH: 1},
    'chair': {gridX: 1, gridY: 2, gridW: 1, gridH: 1},
    'loveseat': {gridX: 2, gridY: 2, gridW: 2, gridH: 1},
    'toilet': {gridX: 4, gridY: 2, gridW: 1, gridH: 1},
    'endTable': {gridX: 5, gridY: 2, gridW: 1, gridH: 1},
    'bookshelf': {gridX: 6, gridY: 2, gridW: 4, gridH: 1},
    'sink': {gridX: 10, gridY: 2, gridW: 3, gridH: 1},
    'rug': {gridX: 0, gridY: 3, gridW: 5, gridH: 3},
    'squareTable': {gridX: 5, gridY: 3, gridW: 3, gridH: 3},
    'piano': {gridX: 8, gridY: 3, gridW: 4, gridH: 2},
    'pianoBench': {gridX: 8, gridY: 5, gridW: 2, gridH: 1},
    'stove': {gridX: 12, gridY: 3, gridW: 2, gridH: 2},
    'blueBed': {gridX: 0, gridY: 6, gridW: 3, gridH: 4},
    'redBed': {gridX: 3, gridY: 6, gridW: 3, gridH: 4},
    'diningTable': {gridX: 0, gridY: 10, gridW: 8, gridH: 3},
    'poolTable': {gridX: 8, gridY: 10, gridW: 5, gridH: 3},
    'bathtub': {gridX: 13, gridY: 10, gridW: 2, gridH: 3},
    'yellowCarpet': {gridX: 0, gridY: 13, gridW: 1, gridH: 1},
    'redCarpet': {gridX: 1, gridY: 13, gridW: 1, gridH: 1},
    'blueCarpet': {gridX: 2, gridY: 13, gridW: 1, gridH: 1},
    'creamTile': {gridX: 3, gridY: 13, gridW: 1, gridH: 1},
    'blueTile': {gridX: 4, gridY: 13, gridW: 1, gridH: 1},
    'woodFloor': {gridX: 5, gridY: 13, gridW: 1, gridH: 1},
    'wall': {gridX: 7, gridY: 13, gridW: 1, gridH: 1},
    'lightning': {gridX: 0, gridY: 14, gridW: 1, gridH: 1},
    'poisonLightning': {gridX: 0, gridY: 14, gridW: 1, gridH: 1},
    'heart': {gridX: 1, gridY: 14, gridW: 1, gridH: 1},
    'poisonHeart': {gridX: 1, gridY: 14, gridW: 1, gridH: 1},
    'firstAid': {gridX: 2, gridY: 14, gridW: 1, gridH: 1},
    'poisonFirstAid': {gridX: 2, gridY: 14, gridW: 1, gridH: 1},
    'sword': {gridX: 3, gridY: 14, gridW: 1, gridH: 1},
    'stone': {gridX: 4, gridY: 14, gridW: 1, gridH: 1},
    'key': {gridX: 5, gridY: 14, gridW: 1, gridH: 1},
    'flame': {gridX: 6, gridY: 14, gridW: 1, gridH: 1},
    'poisonFlame': {gridX: 6, gridY: 14, gridW: 1, gridH: 1},
    'exitRug': {gridX: 11, gridY: 13, gridW: 4, gridH: 10},
    'grass': {gridX: 4, gridY: 15, gridW: 1, gridH: 1}
  },
  playerDefaults: {
    locX: 272,
    locY: 416,
    color: 'blue',
    sprite: 'blue',
    maxHealth: 3,
    curHealth: 2,
    weapon: 1,
    relics: 0,
    keys: 0,
    speed: 4,
    isTraitor: false
  },
  dimensions: {
    tileW: 32,
    gridW: 18,
    gridH: 16
  },
  items: {
    'lightning': {
      stat: 'speed',
      amount: 1,
      abundance: 0.3,
    },
    'heart': {
      stat: 'maxHealth',
      amount: 1,
      abundance: 0.2,
    },
    'firstAid': {
      stat: 'curHealth',
      amount: 1,
      abundance: 0.3
    },
    'flame': {
      stat: 'weapon',
      amount: 1,
      abundance: 0.2
    },
    'stone': {
      stat: 'relics',
      amount: 1,
      abundance: 0
    },
    'poisonLightning': {
      stat: 'speed',
      amount: -1,
      abundance: 0
    },
    'poisonHeart': {
      stat: 'maxHealth',
      amount: -1,
      abundance: 0
    },
    'poisonFirstAid': {
      stat: 'curHealth',
      amount: -1,
      abundance: 0
    },
    'poisonFlame': {
      stat: 'weapon',
      amount: -1,
      abundance: 0
    },
    'key': {
      stat: 'keys',
      amount: 1,
      abundance: 0
    }
  },
  rooms: {
    'entryway': {
      floor: '#AD3B2A',
      wallSprite: 'SpriteGrayWall',
      gateways: {
        north: true,
        east: true,
        south: false,
        west: true
      },
      itemLocs: [],
      objects: {
        plant1: {
          type: 'plant',
          solid: true,
          rotation: 0,
          gridX: 1,
          gridY: 1
        },
        plant2: {
          type: 'plant',
          solid: true,
          rotation: 0,
          gridX: 16,
          gridY: 1
        },
        rug1: {
          type: 'rug',
          solid: false,
          rotation: 0,
          gridX: 7,
          gridY: 7
        }
      }
    },
    'exithallway': {
      floor: '#F0D7BD',
      wallSprite: 'SpriteGrayWall',
      gateways: {
        north: true,
        east: false,
        south: true,
        west: false
      },
      itemLocs: [],
      objects: {
        exitRug1: {
          type: 'exitRug',
          solid: false,
          rotation: 0,
          gridX: 7,
          gridY: 3
        }
      }
    },
    'dummy': {
      floor: '',
      wallSprite: '',
      gateways: {
        north: false,
        east: false,
        south: false,
        west: false
      },
      itemLocs: [],
      objects: {}
    },
    'exit': {
      floor: '#4AB54A',
      wallSprite: 'SpriteGreenWall',
      gateways: {
        north: true,
        east: false,
        south: false,
        west: false
      },
      itemLocs: [],
      objects: {
        grass1: {
          type: 'grass',
          solid: false,
          rotation: 0,
          gridX: 4,
          gridY: 5
        },
        grass2: {
          type: 'grass',
          solid: false,
          rotation: 0,
          gridX: 13,
          gridY: 12,
        }
      }
    },
    'livingRoom': {
      floor: '#EBACA4',
      wallSprite: 'SpriteGrayWall',
      gateways: {
        north: true,
        east: true,
        south: true,
        west: true
      },
      itemLocs: [
        {x: 15, y: 13},
        {x: 10, y: 8},
        {x: 3, y: 11},
        {x: 1, y: 14}
      ],
      objects: {
        armchair1: {
          type: 'armchair',
          solid: true,
          rotation: 270,
          gridX: 3,
          gridY: 10
        },
        armchair2: {
          type: 'armchair',
          solid: true,
          rotation: 90,
          gridX: 14,
          gridY: 8
        },
        couch1: {
          type: 'couch',
          solid: true,
          rotation: 0,
          gridX: 7,
          gridY: 4
        },
        squareTable1: {
          type: 'squareTable',
          solid: true,
          rotation: 0,
          gridX: 7,
          gridY: 8
        }
      }
    },
    'gameRoom': {
      floor: '#A3CBCC',
      wallSprite: 'SpriteGrayWall',
      gateways: {
        north: true,
        east: true,
        south: true,
        west: true
      },
      itemLocs: [
        {x: 4, y: 13},
        {x: 15, y: 2},
        {x: 5, y: 6},
        {x: 14, y: 14}
      ],
      objects: {
        poolTable1: {
          type: 'poolTable',
          solid: true,
          rotation: 0,
          gridX: 6,
          gridY: 7
        },
      couch1: {
          type: 'couch',
          solid: true,
          rotation: 0,
          gridX: 11,
          gridY: 1
        }
      }
    },
    'pianoRoom': {
      floor: '#A3CBCC',
      wallSprite: 'SpriteGrayWall',
      gateways: {
        north: true,
        east: true,
        south: true,
        west: true
      },
      itemLocs: [
        {x: 6, y: 6},
        {x: 14, y: 2},
        {x: 12, y: 12}
      ],
      objects: {
        piano1: {
          type: 'piano',
          solid: true,
          rotation: 180,
          gridX: 7,
          gridY: 15
        },
        pianobench1: {
          type: 'pianoBench',
          solid: true,
          rotation: 0,
          gridX: 4,
          gridY: 10
        },
        loveseat1: {
          type: 'loveseat',
          solid: true,
          rotation: 0,
          gridX: 12,
          gridY: 4
        },
        endTable1: {
          type: 'endTable',
          solid: true,
          rotation: 0,
          gridX: 14,
          gridY: 4
        },
      }
    },
    'office': {
      floor: '#EBACA4',
      wallSprite: 'SpriteGrayWall',
      gateways: {
        north: false,
        east: true,
        south: true,
        west: true
      },
      itemLocs: [
        {x: 2, y: 6},
        {x: 14, y: 2},
        {x: 3, y: 12},
        {x: 12, y: 12}
      ],
      objects: {
        woodTable1: {
          type: 'woodTable',
          solid: true,
          rotation: 0,
          gridX: 7,
          gridY: 6
        },
        armchair1: {
          type: 'armchair',
          solid: true,
          rotation: 0,
          gridX: 8,
          gridY: 4
        },
        bookshelf1: {
          type: 'bookshelf',
          solid: true,
          rotation: 0,
          gridX: 3,
          gridY: 1
        },
        bookshelf2: {
          type: 'bookshelf',
          solid: true,
          rotation: 0,
          gridX: 11,
          gridY: 1
        },
      }
    },
    'bathroom': {
      floor: '#A3CBCC',
      wallSprite: 'SpriteGrayWall',
      gateways: {
        north: true,
        east: true,
        south: true,
        west: true
      },
      itemLocs: [
        {x: 4, y: 13},
        {x: 15, y: 2},
        {x: 5, y: 5},
        {x: 14, y: 14}
      ],
      objects: {
        bathtub1: {
          type: 'bathtub',
          solid: true,
          rotation: 0,
          gridX: 13,
          gridY: 1
        },
        sink1: {
            type: 'sink',
            solid: true,
            rotation: -90,
            gridX: 11,
            gridY: 13
        },
        toilet1: {
            type: 'toilet',
            solid: true,
            rotation: 90,
            gridX: 17,
            gridY: 11
        },
        couch1: {
            type: 'couch',
            solid: true,
            rotation: -90,
            gridX: 1,
            gridY: 5
        },
        wall1: {
            type: 'wall',
            solid: true,
            rotation: 0,
            gridX: 10,
            gridY: 1
        },
        wall2: {
            type: 'wall',
            solid: true,
            rotation: 0,
            gridX: 10,
            gridY: 2
        },
        wall3: {
            type: 'wall',
            solid: true,
            rotation: 0,
            gridX: 10,
            gridY: 3
        },
        wall4: {
            type: 'wall',
            solid: true,
            rotation: 0,
            gridX: 10,
            gridY: 4
        },
        wall5: {
            type: 'wall',
            solid: true,
            rotation: 0,
            gridX: 10,
            gridY: 5
        },
        wall6: {
            type: 'wall',
            solid: true,
            rotation: 0,
            gridX: 10,
            gridY: 10
        },
        wall7: {
            type: 'wall',
            solid: true,
            rotation: 0,
            gridX: 10,
            gridY: 11
        },
        wall8: {
            type: 'wall',
            solid: true,
            rotation: 0,
            gridX: 10,
            gridY: 12
        },
        wall9: {
            type: 'wall',
            solid: true,
            rotation: 0,
            gridX: 10,
            gridY: 13
        },
        wall10: {
            type: 'wall',
            solid: true,
            rotation: 0,
            gridX: 10,
            gridY: 14
        },
      }
    },
    'arborium': {
      floor: '#F0DEC7',
      wallSprite: 'SpriteGrayWall',
      gateways: {
        north: true,
        east: true,
        south: true,
        west: true
      },
      itemLocs: [
        {x: 2, y: 2},
        {x: 14, y: 5},
        {x: 4, y: 13},
        {x: 12, y: 12}
      ],
      objects: {
        graniteCounter1: {
          type: 'graniteCounter',
          solid: true,
          rotation: 0,
          gridX: 7,
          gridY: 6
        },
        chair1: {
          type: 'chair',
          solid: true,
          rotation: 180,
          gridX: 9,
          gridY: 9
        },
        plant1: {
          type: 'plant',
          solid: true,
          rotation: 0,
          gridX: 3,
          gridY: 4
        },
        plant2: {
          type: 'plant',
          solid: true,
          rotation: 0,
          gridX: 4,
          gridY: 3
        },
        plant3: {
          type: 'plant',
          solid: true,
          rotation: 0,
          gridX: 13,
          gridY: 3
        },
        plant4: {
          type: 'plant',
          solid: true,
          rotation: 0,
          gridX: 14,
          gridY: 4
        },
        plant5: {
          type: 'plant',
          solid: true,
          rotation: 0,
          gridX: 3,
          gridY: 11
        },
        plant6: {
          type: 'plant',
          solid: true,
          rotation: 0,
          gridX: 4,
          gridY: 12
        },
        plant7: {
          type: 'plant',
          solid: true,
          rotation: 0,
          gridX: 13,
          gridY: 12
        },
        plant8: {
          type: 'plant',
          solid: true,
          rotation: 0,
          gridX: 14,
          gridY: 11
        },
      }
    },
    'kitchen': {
      floor: '#F0DEC7',
      wallSprite: 'SpriteGrayWall',
      gateways: {
        north: true,
        east: true,
        south: true,
        west: true
      },
      itemLocs: [
        {x: 2, y: 14},
        {x: 4, y: 7},
        {x: 9, y: 3},
        {x: 16, y: 10}
      ],
      objects: {
        woodTable1: {
          type: 'woodTable',
          solid: true,
          rotation: 0,
          gridX: 7,
          gridY: 4
        },
        chair1: {
          type: 'chair',
          solid: true,
          rotation: 0,
          gridX: 7,
          gridY: 3
        },
        chair2: {
          type: 'chair',
          solid: true,
          rotation: 0,
          gridX: 10,
          gridY: 3
        },
        chair3: {
          type: 'chair',
          solid: true,
          rotation: 180,
          gridX: 8,
          gridY: 7
        },
        chair4: {
          type: 'chair',
          solid: true,
          rotation: 180,
          gridX: 11,
          gridY: 7
        },
        graniteCounter1: {
          type: 'graniteCounter',
          solid: true,
          rotation: 0,
          gridX: 1,
          gridY: 9
        },
        kitchenSink1: {
          type: 'kitchenSink',
          solid: true,
          rotation: 0,
          gridX: 5,
          gridY: 9
        },
        graniteCounter2: {
          type: 'graniteCounter',
          solid: true,
          rotation: 0,
          gridX: 7,
          gridY: 9
        },
        stove1: {
          type: 'stove',
          solid: true,
          rotation: 270,
          gridX: 1,
          gridY: 13
        },
      }
    },
    'dining room': {
      floor: '#E3CD86',
      wallSprite: 'SpriteGrayWall',
      gateways: {
        north: true,
        east: true,
        south: true,
        west: true
      },
      itemLocs: [
        {x: 3, y: 9},
        {x: 5, y: 1},
        {x: 15, y: 5},
        {x: 12, y: 13}
      ],
      objects: {
        diningTable1: {
          type: 'diningTable',
          solid: true,
          rotation: 0,
          gridX: 5,
          gridY: 7
        },
        chair1: {
          type: 'chair',
          solid: true,
          rotation: 0,
          gridX: 6,
          gridY: 6
        },
        chair2: {
          type: 'chair',
          solid: true,
          rotation: 0,
          gridX: 9,
          gridY: 6
        },
        chair3: {
          type: 'chair',
          solid: true,
          rotation: 0,
          gridX: 12,
          gridY: 6
        },
        chair4: {
          type: 'chair',
          solid: true,
          rotation: 180,
          gridX: 6,
          gridY: 11
        },
        chair5: {
          type: 'chair',
          solid: true,
          rotation: 180,
          gridX: 9,
          gridY: 11
        },
        chair6: {
          type: 'chair',
          solid: true,
          rotation: 180,
          gridX: 12,
          gridY: 11
        },
        chair7: {
          type: 'chair',
          solid: true,
          rotation: 270,
          gridX: 4,
          gridY: 9
        },
        chair8: {
          type: 'chair',
          solid: true,
          rotation: 90,
          gridX: 14,
          gridY: 8
        },
      }
    },
    'bedroom': {
      floor: '#A3CBCC',
      wallSprite: 'SpriteGrayWall',
      gateways: {
        north: true,
        east: true,
        south: true,
        west: true
      },
      itemLocs: [
        {x: 1, y: 10},
        {x: 2, y: 3},
        {x: 10, y: 6},
        {x: 15, y: 12}
      ],
      objects: {
        blueBed1: {
          type: 'blueBed',
          solid: true,
          rotation: 0,
          gridX: 3,
          gridY: 1
        },
        woodTable1: {
          type: 'woodTable',
          solid: true,
          rotation: 0,
          gridX: 11,
          gridY: 1
        },
        chair1: {
          type: 'chair',
          solid: true,
          rotation: 180,
          gridX: 14,
          gridY: 4
        },
        wall1: {
          type: 'wall',
          solid: true,
          rotation: 0,
          gridX: 7,
          gridY: 14
        },
        wall2: {
          type: 'wall',
          solid: true,
          rotation: 0,
          gridX: 7,
          gridY: 13
        },
        wall3: {
          type: 'wall',
          solid: true,
          rotation: 0,
          gridX: 7,
          gridY: 12
        },
        wall4: {
          type: 'wall',
          solid: true,
          rotation: 0,
          gridX: 7,
          gridY: 11
        },
        wall5: {
          type: 'wall',
          solid: true,
          rotation: 0,
          gridX: 7,
          gridY: 10
        },
        wall6: {
          type: 'wall',
          solid: true,
          rotation: 0,
          gridX: 7,
          gridY: 9
        },
        wall7: {
          type: 'wall',
          solid: true,
          rotation: 0,
          gridX: 1,
          gridY: 9
        },
        wall8: {
          type: 'wall',
          solid: true,
          rotation: 0,
          gridX: 2,
          gridY: 9
        },
        wall9: {
          type: 'wall',
          solid: true,
          rotation: 0,
          gridX: 3,
          gridY: 9
        },
        wall10: {
          type: 'wall',
          solid: true,
          rotation: 0,
          gridX: 4,
          gridY: 9
        },
        toilet: {
          type: 'toilet',
          solid: true,
          rotation: 0,
          gridX: 3,
          gridY: 10
        },
        sink1: {
          type: 'sink',
          solid: true,
          rotation: 180,
          gridX: 4,
          gridY: 15
        },
        sink2: {
          type: 'bookshelf',
          solid: true,
          rotation: 0,
          gridX: 13,
          gridY: 14
        },
      }
    },
    'bedroom2': {
      floor: '#E3CD86',
      wallSprite: 'SpriteGrayWall',
      gateways: {
        north: true,
        east: true,
        south: true,
        west: true
      },
      itemLocs: [
        {x: 10, y: 10},
        {x: 15, y: 2},
        {x: 6, y: 6},
        {x: 3, y: 11}
      ],
      objects: {
        redBed1: {
          type: 'redBed',
          solid: true,
          rotation: 0,
          gridX: 3,
          gridY: 1
        },
        plant1: {
          type: 'plant',
          solid: true,
          rotation: 0,
          gridX: 12,
          gridY: 1
        },
        woodTable1: {
          type: 'woodTable',
          solid: true,
          rotation: 0,
          gridX: 11,
          gridY: 13
        },
        chair1: {
          type: 'chair',
          solid: true,
          rotation: 0,
          gridX: 12,
          gridY: 12
        },
        wall1: {
          type: 'wall',
          solid: true,
          rotation: 0,
          gridX: 7,
          gridY: 14
        },
        wall2: {
          type: 'wall',
          solid: true,
          rotation: 0,
          gridX: 7,
          gridY: 13
        },
        wall3: {
          type: 'wall',
          solid: true,
          rotation: 0,
          gridX: 7,
          gridY: 12
        },
        wall4: {
          type: 'wall',
          solid: true,
          rotation: 0,
          gridX: 7,
          gridY: 11
        },
        wall5: {
          type: 'wall',
          solid: true,
          rotation: 0,
          gridX: 7,
          gridY: 10
        },
        wall6: {
          type: 'wall',
          solid: true,
          rotation: 0,
          gridX: 7,
          gridY: 9
        },
        wall7: {
          type: 'wall',
          solid: true,
          rotation: 0,
          gridX: 1,
          gridY: 9
        },
        wall8: {
          type: 'wall',
          solid: true,
          rotation: 0,
          gridX: 2,
          gridY: 9
        },
        wall9: {
          type: 'wall',
          solid: true,
          rotation: 0,
          gridX: 3,
          gridY: 9
        },
        wall10: {
          type: 'wall',
          solid: true,
          rotation: 0,
          gridX: 4,
          gridY: 9
        },
        toilet1: {
          type: 'toilet',
          solid: true,
          rotation: 0,
          gridX: 3,
          gridY: 10
        },
        sink1: {
          type: 'sink',
          solid: true,
          rotation: 180,
          gridX: 4,
          gridY: 15
        },
        bookshelf1: {
          type: 'bookshelf',
          solid: true,
          rotation: 0,
          gridX: 13,
          gridY: 1
        },
      }
    },
  },

  cards: {
    spiders: {
      title: 'Spiders',
      flavorText: 'You feel something crawling on your arm. You brush the '
                  + 'spider away. Suddenly spiders are pouring out of the '
                  + 'walls surrounding you. As you start to scream, they '
                  + 'vanish.',
      text: 'Lose one health.',
      effect: {curHealth: -1},
      sound: null
    },
    smoke: {
      title: 'Smoke',
      flavorText: 'A strange smoke fills the room. You can feel it weakening '
                  + 'you with each breath.',
      text: 'Lose one speed.',
      effect: {speed: -1},
      sound: null
    },
    puppet: {
      title: 'Creepy Puppet',
      flavorText: 'You see a strange doll. Suddenly, it jumps out and attacks '
                  + 'you.',
      text: 'Lose one health.',
      effect: {curHealth: -1},
      sound: null
    },
    mirrorPast: {
      title: 'Image in the Mirror',
      flavorText: 'Your reflection in the mirror moves on its own. You '
                  + 'realize it is you from another time. It scratches into '
                  + 'the mirror "This will help" and hands you an item.',
      text: 'Gain one attack power!',
      effect: {weapon: 1},
      sound: null
    },
    mirrorFuture: {
      title: 'Image in the Mirror',
      flavorText: 'Your reflection in the mirror moves on its own. You '
                  + 'realize it is you from another time. You scratch into '
                  + 'the mirror "This will help" and hand it an item.',
      text: 'Lose one attack power.',
      effect: {weapon: -1},
      sound: null
    },
    ghost: {
      title: 'Ghost',
      flavorText: 'A face appears before your eyes, slightly transparent. The '
                  + 'ghost rushes toward you! You jump back, but it passes '
                  + 'right through you, chilling you to the bone.',
      text: 'Max health decreased by one.',
      effect: {maxHealth: -1},
      sound: null
    },
    book: {
      title: 'Book',
      flavorText: 'You find an ancient book, the binding barely holding it '
                  + 'together. The title has worn off, but it seems to be '
                  + 'a book of powerful spells.',
      text: 'Gain one attack power!',
      effect: {weapon: 1},
      sound: null
    },
    youthPotion: {
      title: 'Youth Potion',
      flavorText: 'You see a small vile of colorless liquid. The label claims '
                  + 'it comes from the fountain of youth. You hesitate for a '
                  + 'moment, then pop off the cap and drink. You can\'t '
                  + 'explain it, but you feel somehow better . . . stronger.',
      text: 'Max Health increased by one!',
      effect: {maxHealth: 1},
      sound: null
    },
    shoes: {
      title: 'Running Shoes',
      flavorText: 'You find a pair of running shoes, and realize that the '
                  + 'uncomfortable shoes you\'ve been wearing are holding '
                  + 'you back. You quickly take off your own shoes and slip '
                  + 'these on.',
      text: 'Gain one speed!',
      effect: {speed: 1},
      sound: null
    },
    bandage: {
      title: 'Bandages',
      flavorText: 'Sitting there is a pack of bandaids. You put one on your '
                  + 'knee where you had scraped yourself earlier.',
      text: 'Gain one health!',
      effect: {curHealth: 1},
      sound: null
    },
    relic1: {
      title: 'Relic',
      flavorText: 'You find a strange and mysterious artifact. Curious, you '
                  + 'pick it up. As you hold it in your hands, it seems to '
                  + 'pulse with some kind of power.',
      text: 'Gain one relic! You are one step closer to the second phase.',
      effect: {relics: 1},
      sound: 'organ'
    },
    relic2: {
      title: 'Relic',
      flavorText: 'You see a strange amulet before you. As you pick it up, '
                  + 'you feel some sort of power coursing through your veins.',
      text: 'Gain one relic! You are one step closer to the second phase.',
      effect: {relics: 1},
      sound: 'organ'
    },
    relic3: {
      title: 'Relic',
      flavorText: 'There is a small box covered in runes. You open it and '
                  + 'feel a cold breeze wash over you, but the box is empty.',
      text: 'Gain one relic! You are one step closer to the second phase.',
      effect: {relics: 1},
      sound: 'organ'
    },
    relic4: {
      title: 'Relic',
      flavorText: 'You uncover a crystal ball. You look deep within its glass '
                  + 'and see your future life unfold before you.',
      text: 'Gain one relic! You are one step closer to the second phase.',
      effect: {relics: 1},
      sound: 'organ'
    },
    relic5: {
      title: 'Relic',
      flavorText: 'You discover a battered ring with an interesting inscription: '
                  + 'The bearer of the ring will possess incomprehensible power',
      text: 'Gain one relic! You are one step closer to the second phase.',
      effect: {relics: 1},
      sound: 'organ'
    }
    /*relic6: {
      title: 'Relic',
      flavorText: 'You find a spirit board that can call the dead. You hear the'
                  + 'sounds of the house\'s ghosts whispering all around you.',
      text: 'Gain one relic! You are one step closer to the second phase.',
      effect: {relics: 1},
      sound: 'organ'
    }*/
  },

  haunts: {
    'plant': {
      heroFlavor: 'One of your comrades has turned against you. Escape the '
                  + 'house before it\'s too late!',
      heroText: 'Collect keys to unlock the series of doors heading south '
                + 'from the entryway (red room). Get to the garden with all '
                + 'the other heroes to win.',
      traitorFlavor: 'You hear a voice speaking to you. It seems to be coming '
                   + 'from inside the walls. It promises you great power; '
                   + 'the power to transform into any shape you wish. All '
                   + 'you must do is destroy those fools who came here with '
                   + 'you.',
      traitorText: 'Press \'e\' to alter your appearance. Press space '
                   + 'to attack. Kill one of the heroes to win.'
    },
    'lockedDoors': {
      heroFlavor: 'One of your comrades has turned against you. Escape the '
                  + 'house before it\'s too late!',
      heroText: 'Collect keys to unlock the series of doors heading south '
                + 'from the entryway (red room). Get to the garden with all '
                + 'the other heroes to win.',
      traitorFlavor: 'A strange coldness washes over you. You are suddenly '
                     + 'terrified of being alone, and certain that the others '
                     + 'are trying to escape without you. You look down and '
                     + 'see that you are holding a key. . .',
      traitorText: 'Press \'e\' to lock a door you are standing next to. '
                   + 'You can move through locked doors, but the heroes need '
                   + 'a key to do so. You can only lock up to three doors. '
                   + 'Press space to attack. Kill one of the heroes to win.'
    },
    'poisonItems': {
      heroFlavor: 'One of your comrades has turned against you. Escape the '
                  + 'house before it\'s too late!',
      heroText: 'Collect keys to unlock the series of doors heading south '
                + 'from the entryway (red room). Get to the garden with all '
                + 'the other heroes to win.',
      traitorFlavor: 'You hear a voice speaking to you. It seems to be coming '
                     + 'from inside the walls. It promises you great power; '
                     + 'the power to drop poisonous items throughout the '
                     + 'house. All you must do is destroy those fools who came '
                     + 'here with you.',
      traitorText: 'Press \'e\' to drop poisonous items. Press space '
                   + 'to attack. Kill one of the heroes to win.'
    }
  }
}
