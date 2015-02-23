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
      objects: [
        {
          id: 'armchair',
          solid: true,
          rotation: 270,
          gridX: 5,
          gridY: 9
        },
        {
          id: 'armchair',
          solid: true,
          rotation: 90,
          gridX: 13,
          gridY: 7
        },
        {
          id: 'couch',
          solid: true,
          rotation: 0,
          gridX: 7,
          gridY: 4
        }
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
          gridY: 13
        },
        {
          id: 'chair',
          solid: true,
          rotation: 0,
          gridX: 12,
          gridY: 12
        }
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
          gridX: 14,
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
      floor: '#FFFFFF',
      gateways: {
        north: true,
        east: true,
        south: true,
        west: true
      },
      objects: [
        {
          id: 'woodTable',
          solid: true,
          rotation: 0,
          gridX: 7,
          gridY: 4
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
          gridX: 7,
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
          gridX: 11,
          gridY: 6
        },
        {
          id: 'chair',
          solid: true,
          rotation: 180,
          gridX: 7,
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
          gridX: 11,
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
          gridY: 9
        },
      ]
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
