module.exports.gameconfig = {
  rooms: [
    {
      id: 'entryway',
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
    {
      id: 'livingRoom',
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
    {
      id: 'bedroom',
      floor: '#FFFFFF',
      gateways: {
        north: true,
        east: true,
        south: true,
        west: true
      },
    },
    {
      id: 'kitchen',
      floor: '#FFFFFF',
      gateways: {
        north: true,
        east: true,
        south: true,
        west: true
      },
    },
    {
      id: 'dining room',
      floor: '#FFFFFF',
      gateways: {
        north: true,
        east: true,
        south: true,
        west: true
      },
    }
  ],
  
  events: [
    {   //Event 0
      title: "Image in the Mirror",
      text: 'Your reflection in the mirror moves on its own. You realize it is \
             you from another time. It scratches into the mirror "This will \
             help" and hands you an item. Gain one weapon strength!',
      effect: {weapon: 1}
    }
  ]
  
}
