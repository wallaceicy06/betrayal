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
    'bootstrap': '//maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min',
    'jquery': '//code.jquery.com/jquery-2.1.3.min',
    'crafty': 'dependencies/crafty-min',
    'underscore': '//underscorejs.org/underscore-min',
    'easel': '//code.createjs.com/easeljs-0.8.0.min'
  }
});

require(['controller/GameController', 'jquery', 'bootstrap'], function(GameController, $, Bootstrap) {
  $(document).ready(function() {
    (new GameController()).start();
  });
});

