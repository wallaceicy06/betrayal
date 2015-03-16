module.exports.gameconfig = {
  interactable: {
    rug: {
      prefix: 'You pulled back a corner of the rug.'
    },
    couch: {
      prefix: 'You lifted a couch cushion.'
    },
    armchair: {
      prefix: 'You looked behind the armchair.'
    },
    woodTable: {
      prefix: 'You peeked under the table.'
    },
    kitchenSink: {
      prefix: 'There is a cupboard underneath the sink. You opened it.'
    },
    plant: {
      prefix: 'You open the plant leaves.'
    },
    chair: {
      prefix: 'You sit down in the chair. You feel something underneath the '
              + 'cushion.'
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
      prefix: 'You pull back a book from the shelf. Behind it is something '
              + 'strange.'
    },
    sink: {
      prefix: 'You turn on the faucet. '
    },
    squareTable: {
      prefix: 'You bend over and look under the coffee table.'
    },
    piano: {
      prefix: 'You begin playing chopsticks on the piano. '
    }
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
    'heart': {gridX: 1, gridY: 14, gridW: 1, gridH: 1},
    'firstAid': {gridX: 2, gridY: 14, gridW: 1, gridH: 1},
    'sword': {gridX: 3, gridY: 14, gridW: 1, gridH: 1},
    'stone': {gridX: 4, gridY: 14, gridW: 1, gridH: 1},
    'key': {gridX: 5, gridY: 14, gridW: 1, gridH: 1}
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
    'sword': {
      stat: 'weapon',
      amount: 1,
      abundance: 0.2
    },
    'stone': {
      stat: 'relics',
      amount: 1,
      abundance: 0.2
    }
  },
  rooms: {
    'entryway': {
      floor: '#F0DEC7',
      gateways: {
        north: true,
        east: true,
        south: false,
        west: true
      },
      itemLocs: [],
      objects: [
        {
          id: 'plant',
          solid: true,
          rotation: 0,
          gridX: 1,
          gridY: 1
        },
        {
          id: 'plant',
          solid: true,
          rotation: 0,
          gridX: 16,
          gridY: 1
        },
        {
          id: 'rug',
          solid: false,
          rotation: 0,
          gridX: 7,
          gridY: 7
        }
      ]
    },
    'livingRoom': {
      floor: '#EBACA4',
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
      objects: [
        {
          id: 'armchair',
          solid: true,
          rotation: 270,
          gridX: 3,
          gridY: 10
        },
        {
          id: 'armchair',
          solid: true,
          rotation: 90,
          gridX: 14,
          gridY: 8
        },
        {
          id: 'couch',
          solid: true,
          rotation: 0,
          gridX: 7,
          gridY: 4
        },
        {
          id: 'squareTable',
          solid: true,
          rotation: 0,
          gridX: 7,
          gridY: 8
        }
      ]
    },
    'gameRoom': {
      floor: '#A3CBCC',
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
      objects: [
        {
          id: 'poolTable',
          solid: true,
          rotation: 0,
          gridX: 6,
          gridY: 7
        },
        {
          id: 'couch',
          solid: true,
          rotation: 0,
          gridX: 11,
          gridY: 1
        }
      ]
    },
    'pianoRoom': {
      floor: '#A3CBCC',
      gateways: {
        north: true,
        east: true,
        south: true,
        west: true
      },
      itemLocs: [
        {x: 6, y: 6},
        {x: 14, y: 2},
        {x: 3, y: 12},
        {x: 12, y: 12}
      ],
      objects: [
        {
          id: 'piano',
          solid: true,
          rotation: 0,
          gridX: 3,
          gridY: 10
        },
        {
          id: 'loveseat',
          solid: true,
          rotation: 0,
          gridX: 12,
          gridY: 4
        },
        {
          id: 'plant',
          solid: true,
          rotation: 0,
          gridX: 14,
          gridY: 4
        },
      ]
    },
    'kitchen': {
      floor: '#F0DEC7',
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
      objects: [
        {
          id: 'woodTable',
          solid: true,
          rotation: 0,
          gridX: 7,
          gridY: 4
        },
        {
          id: 'chair',
          solid: true,
          rotation: 0,
          gridX: 7,
          gridY: 3
        },
        {
          id: 'chair',
          solid: true,
          rotation: 0,
          gridX: 10,
          gridY: 3
        },
        {
          id: 'chair',
          solid: true,
          rotation: 180,
          gridX: 8,
          gridY: 7
        },
        {
          id: 'chair',
          solid: true,
          rotation: 180,
          gridX: 11,
          gridY: 7
        },
        {
          id: 'graniteCounter',
          solid: true,
          rotation: 0,
          gridX: 1,
          gridY: 9
        },
        {
          id: 'kitchenSink',
          solid: true,
          rotation: 0,
          gridX: 5,
          gridY: 9
        },
        {
          id: 'graniteCounter',
          solid: true,
          rotation: 0,
          gridX: 7,
          gridY: 9
        },
        {
          id: 'stove',
          solid: true,
          rotation: 270,
          gridX: 1,
          gridY: 13
        },
      ]
    },
    'dining room': {
      floor: '#E3CD86',
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
      objects: [
        {
          id: 'diningTable',
          solid: true,
          rotation: 0,
          gridX: 5,
          gridY: 7
        },
        {
          id: 'chair',
          solid: true,
          rotation: 0,
          gridX: 6,
          gridY: 6
        },
        {
          id: 'chair',
          solid: true,
          rotation: 0,
          gridX: 9,
          gridY: 6
        },
        {
          id: 'chair',
          solid: true,
          rotation: 0,
          gridX: 12,
          gridY: 6
        },
        {
          id: 'chair',
          solid: true,
          rotation: 180,
          gridX: 6,
          gridY: 11
        },
        {
          id: 'chair',
          solid: true,
          rotation: 180,
          gridX: 9,
          gridY: 11
        },
        {
          id: 'chair',
          solid: true,
          rotation: 180,
          gridX: 12,
          gridY: 11
        },
        {
          id: 'chair',
          solid: true,
          rotation: 270,
          gridX: 4,
          gridY: 9
        },
        {
          id: 'chair',
          solid: true,
          rotation: 90,
          gridX: 14,
          gridY: 8
        },
      ]
    },
    'bedroom': {
      floor: '#A3CBCC',
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
      objects: [
        {
          id: 'blueBed',
          solid: true,
          rotation: 0,
          gridX: 3,
          gridY: 1
        },
        {
          id: 'woodTable',
          solid: true,
          rotation: 0,
          gridX: 11,
          gridY: 1
        },
        {
          id: 'chair',
          solid: true,
          rotation: 180,
          gridX: 14,
          gridY: 4
        },
        {
          id: 'wall',
          solid: true,
          rotation: 0,
          gridX: 7,
          gridY: 14
        },
        {
          id: 'wall',
          solid: true,
          rotation: 0,
          gridX: 7,
          gridY: 13
        },
        {
          id: 'wall',
          solid: true,
          rotation: 0,
          gridX: 7,
          gridY: 12
        },
        {
          id: 'wall',
          solid: true,
          rotation: 0,
          gridX: 7,
          gridY: 11
        },
        {
          id: 'wall',
          solid: true,
          rotation: 0,
          gridX: 7,
          gridY: 10
        },
        {
          id: 'wall',
          solid: true,
          rotation: 0,
          gridX: 7,
          gridY: 9
        },
        {
          id: 'wall',
          solid: true,
          rotation: 0,
          gridX: 1,
          gridY: 9
        },
        {
          id: 'wall',
          solid: true,
          rotation: 0,
          gridX: 2,
          gridY: 9
        },
        {
          id: 'wall',
          solid: true,
          rotation: 0,
          gridX: 3,
          gridY: 9
        },
        {
          id: 'wall',
          solid: true,
          rotation: 0,
          gridX: 4,
          gridY: 9
        },
        {
          id: 'toilet',
          solid: true,
          rotation: 0,
          gridX: 3,
          gridY: 10
        },
        {
          id: 'sink',
          solid: true,
          rotation: 180,
          gridX: 4,
          gridY: 15
        },
        {
          id: 'bookshelf',
          solid: true,
          rotation: 0,
          gridX: 13,
          gridY: 14
        },
      ]
    },
    'bedroom2': {
      floor: '#E3CD86',
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
      objects: [
        {
          id: 'redBed',
          solid: true,
          rotation: 0,
          gridX: 3,
          gridY: 1
        },
        {
          id: 'plant',
          solid: true,
          rotation: 0,
          gridX: 12,
          gridY: 1
        },
        {
          id: 'woodTable',
          solid: true,
          rotation: 0,
          gridX: 11,
          gridY: 13
        },
        {
          id: 'chair',
          solid: true,
          rotation: 0,
          gridX: 12,
          gridY: 12
        },
        {
          id: 'wall',
          solid: true,
          rotation: 0,
          gridX: 7,
          gridY: 14
        },
        {
          id: 'wall',
          solid: true,
          rotation: 0,
          gridX: 7,
          gridY: 13
        },
        {
          id: 'wall',
          solid: true,
          rotation: 0,
          gridX: 7,
          gridY: 12
        },
        {
          id: 'wall',
          solid: true,
          rotation: 0,
          gridX: 7,
          gridY: 11
        },
        {
          id: 'wall',
          solid: true,
          rotation: 0,
          gridX: 7,
          gridY: 10
        },
        {
          id: 'wall',
          solid: true,
          rotation: 0,
          gridX: 7,
          gridY: 9
        },
        {
          id: 'wall',
          solid: true,
          rotation: 0,
          gridX: 1,
          gridY: 9
        },
        {
          id: 'wall',
          solid: true,
          rotation: 0,
          gridX: 2,
          gridY: 9
        },
        {
          id: 'wall',
          solid: true,
          rotation: 0,
          gridX: 3,
          gridY: 9
        },
        {
          id: 'wall',
          solid: true,
          rotation: 0,
          gridX: 4,
          gridY: 9
        },
        {
          id: 'toilet',
          solid: true,
          rotation: 0,
          gridX: 3,
          gridY: 10
        },
        {
          id: 'sink',
          solid: true,
          rotation: 180,
          gridX: 4,
          gridY: 15
        },
        {
          id: 'bookshelf',
          solid: true,
          rotation: 0,
          gridX: 13,
          gridY: 1
        },
      ]
    },
  },

  cards: {
    spiders: {
      title: 'Spiders',
      text: 'You feel something crawling on your arm. You brush the spider '
            + 'away. Suddenly spiders are pouring out of the walls surrounding '
            + 'you. As you start to scream, they vanish. Lose one health.',
      effect: {curHealth: -1}
    },
    smoke: {
      title: 'Smoke',
      text: 'A strange smoke fills the room. You can feel it weakening you ' +
            'with each breath. Lose one speed.',
      effect: {speed: -1}
    },
    puppet: {
      title: 'Creepy Puppet',
      text: 'There is a strange doll sitting on a shelf nearby. It jumps ' +
            'out and attacks you. Lose one health.',
      effect: {curHealth: -1}
    },
    mirrorPast: {
      title: 'Image in the Mirror',
      text: 'Your reflection in the mirror moves on its own. You realize '
            + 'it is you from another time. It scratches into the mirror '
            + '"This will help" and hands you an item. Gain one weapon '
            + 'strength!',
      effect: {weapon: 1}
    },
    mirrorFuture: {
      title: 'Image in the Mirror',
      text: 'Your reflection in the mirror moves on its own. You realize it '
             + 'is you from another time. You scratch into the mirror "This '
             + 'will help" and hand it an item. Lose one weapon strength.',
      effect: {weapon: -1}
    }
  },

  haunts: {
    'plant': {
      title: 'Shapeshifter',
      heroText: 'One of your comrades has turned against you. Collect all '
                + 'the keys and get to the entryway before it\'s too late! And'
                + ' watch out - the traitor could be anyone. Or anything. . .',
      traitorText: 'You hear a voice speaking to you. It seems to be coming '
                   + 'from inside the walls. It promises you great power '
                   + 'The power to transform into any shape you wish. All '
                   + 'you must do is destroy those fools who came here with '
                   + 'you. Press \'t\' to alter your appearance. Press space '
                   + 'to attack.'
    }
  }
}
