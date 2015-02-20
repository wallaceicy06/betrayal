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
    },
    'kitchen': {
      floor: '#FFFFFF',
      gateways: {
        north: true,
        east: true,
        south: true,
        west: true
      },
    },
    'dining room': {
      floor: '#FFFFFF',
      gateways: {
        north: true,
        east: true,
        south: true,
        west: true
      },
    }
  }
}
