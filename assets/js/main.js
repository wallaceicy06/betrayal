require.config({
  shim: {
    'bootstrap': {
      deps: ['jquery']
    },
    'crafty': {}
  },
  baseUrl: '/js/',
  paths: {
    'bootstrap': 'dependencies/bootstrap',
    'jquery': 'dependencies/jquery',
    'crafty': 'dependencies/crafty'
  }
});

require(['controller/GameController', 'bootstrap'], function(GameController, Bootstrap) {
  (new GameController()).start();
});

