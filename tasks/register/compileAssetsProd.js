module.exports = function (grunt) {
	grunt.registerTask('compileAssetsProd', [
    'compileAssets',
    'requirejs:prod'
	]);
}
