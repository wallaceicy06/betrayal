module.exports.gameconfig = {
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
    'blueBed': {gridX: 0, gridY: 6, gridW: 3, gridH: 4},
    'redBed': {gridX: 3, gridY: 6, gridW: 3, gridH: 4},
    'diningTable': {gridX: 0, gridY: 10, gridW: 8, gridH: 3},
    'poolTable': {gridX: 8, gridY: 10, gridW: 5, gridH: 3},
    'yellowCarpet': {gridX: 0, gridY: 13, gridW: 1, gridH: 1},
    'redCarpet': {gridX: 1, gridY: 13, gridW: 1, gridH: 1},
    'blueCarpet': {gridX: 2, gridY: 13, gridW: 1, gridH: 1},
    'creamTile': {gridX: 3, gridY: 13, gridW: 1, gridH: 1},
    'blueTile': {gridX: 4, gridY: 13, gridW: 1, gridH: 1},
    'woodFloor': {gridX: 5, gridY: 13, gridW: 1, gridH: 1},
    'lightning': {gridX: 0, gridY: 14, gridW: 1, gridH: 1},
    'heart': {gridX: 1, gridY: 14, gridW: 1, gridH: 1},
    'firstAid': {gridX: 2, gridY: 14, gridW: 1, gridH: 1},
    'sword': {gridX: 3, gridY: 14, gridW: 1, gridH: 1},
    'stone': {gridX: 4, gridY: 14, gridW: 1, gridH: 1}
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
      floor: '#6699FF',
      gateways: {
        north: true,
        east: true,
        south: false,
        west: true
      },
      objects: [
        {
          id: 'plant',
          solid: true,
          rotation: 0,
          gridX: 1,
          gridY: 1
        },
        {
          id: 'rug',
          solid: false,
          rotation: 0,
          gridX: 6,
          gridY: 7
        }
      ]
    },
    'livingRoom': {
      floor: '#990033',
      gateways: {
        north: true,
        east: true,
        south: true,
        west: true
      },
      objects: [
        {
          id: 'armchair',
          solid: true,
          rotation: 0,
          gridX: 1,
          grixY: 4
        },
        {
          id: 'couch',
          solid: true,
          rotation: 180,
          gridX: 10,
          gridY: 8
        }
      ]
    },
    'bedroom': {
      floor: '#FFFFFF',
      gateways: {
        north: true,
        east: true,
        south: true,
        west: true
      },
      objects: []
    },
    'kitchen': {
      floor: '#FFFFFF',
      gateways: {
        north: true,
        east: true,
        south: true,
        west: true
      },
      objects: []
    },
    'dining room': {
      floor: '#FFFFFF',
      gateways: {
        north: true,
        east: true,
        south: true,
        west: true
      },
      objects: []
    }
  },

  events: {
    0: {   //Event 0
         title: 'Image in the Mirror',
         text: 'Your reflection in the mirror moves on its own. You realize it \
                is you from another time. It scratches into the mirror "This \
                will help" and hands you an item. Gain one weapon strength!',
         effect: {weapon: 1}
       },
    1: {   //Event 1
      title: 'Smoke',
      text: 'A strange smoke fills the room. You can feel if weakening you \
             with each breath. Lose one speed.',
      effect: {speed: -1}
      },
    2: {   //Event 2
      title: 'Creepy Puppet',
      text: 'There is a strange doll sitting on a shelf nearby. It jumps out \
             and attacks you. Lose one health.',
      effect: {curHealth: -1}
    },
    3: {   //Event 3
      title: 'Image in the Mirror',
      text: 'Your reflection in the mirror moves on its own. You realize it \
             is you from another time. You scratch into the mirror "This will \
             help" and hand it an item. Lose one weapon strength.',
      effect: {weapon: -1}
    },
    4: {   //Event 4
      title: 'Spiders',
      text: 'You feel something crawling on your arm. You brush the spider \
             away. Suddenly spiders are pouring out of the walls, surrounding \
             you. As you start to scream, they vanish. Lose one health.',
      effect: {curHealth: -1}
    }
  }

}
