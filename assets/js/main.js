require.config({
  shim: {
    'bootstrap': {
      deps: ['jquery']
    },
    'crafty': {},
    'underscore': {}
  },
  baseUrl: '/js/',
  paths: {
    'bootstrap': 'dependencies/bootstrap',
    'jquery': 'dependencies/jquery',
    'crafty': 'dependencies/crafty',
    'underscore': 'dependencies/underscore'
  }
});

require(['controller/GameController', 'bootstrap'], function(GameController, Bootstrap) {
  (new GameController()).start();
});

