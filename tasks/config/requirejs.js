module.exports = function(grunt) {
  grunt.config.set('requirejs', {
    dev: {
      options: {
        baseUrl: 'assets/js',
        name: 'main',
        mainConfigFile: 'assets/js/main.js',
        out: 'assets/js/main_compiled.js'
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-requirejs');
};
