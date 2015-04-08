require.config({
  shim: {
    'bootstrap': {
      deps: ['jquery']
    },
    'crafty': {},
    'easel': {
      exports: 'createjs'
    },
    'underscore': {}
  },
  baseUrl: '/js/',
  paths: {
    'bootstrap': 'dependencies/bootstrap',
    'jquery': 'dependencies/jquery',
    'crafty': 'dependencies/crafty',
    'underscore': 'dependencies/underscore',
    'easel': '//code.createjs.com/easeljs-0.8.0.min'
  }
});

require(['controller/GameController', 'jquery', 'bootstrap'], function(GameController, $, Bootstrap) {
  $(document).ready(function() {
    console.log('start');
    (new GameController()).start();
  });
});

