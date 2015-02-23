module.exports.gameconfig = {
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
    0: {
        title: 'Image in the Mirror',
        text: 'Your reflection in the mirror moves on its own. You realize \
              it is you from another time. It scratches into the mirror \
              "This will help" and hands you an item. Gain one weapon \
              strength!',
        effect: {weapon: 1}
       },
    1: {
        title: 'Smoke',
        text: 'A strange smoke fills the room. You can feel if weakening you \
              with each breath. Lose one speed.',
        effect: {speed: -1}
      },
    2: {
        title: 'Creepy Puppet',
        text: 'There is a strange doll sitting on a shelf nearby. It jumps \
              out and attacks you. Lose one health.',
        effect: {curHealth: -1}
    },
    3: {
        title: 'Image in the Mirror',
        text: 'Your reflection in the mirror moves on its own. You realize it \
               is you from another time. You scratch into the mirror "This \
               will help" and hand it an item. Lose one weapon strength.',
        effect: {weapon: -1}
    },
    4: {
        title: 'Spiders',
        text: 'You feel something crawling on your arm. You brush the spider \
              away. Suddenly spiders are pouring out of the walls, \
              surrounding you. As you start to scream, they vanish. Lose one \
              health.',
        effect: {curHealth: -1}
    }
  }

}
