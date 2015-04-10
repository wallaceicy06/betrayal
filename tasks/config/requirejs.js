module.exports = function(grunt) {
  grunt.config.set('requirejs', {
    prod: {
      options: {
        baseUrl: 'assets/js',
        name: 'main',
        mainConfigFile: 'assets/js/main.js',
        out: '.tmp/public/js/main.js',
        optimize: 'uglify2',
        removeCombined: true,
        useStrict: true,
        mangle: true
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-requirejs');
};
