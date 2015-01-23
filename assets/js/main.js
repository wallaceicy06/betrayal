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

require(['controller/game_controller'], function(GameController) {
  (new GameController()).start();
});

