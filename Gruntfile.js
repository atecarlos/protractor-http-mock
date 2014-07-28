'use strict';

module.exports = function(grunt) {
    grunt.initConfig({
        jshint: {
            options: {
                jshintrc: '.jshintrc',
            },
            files: ['lib/**/*.js']    
        },
        jasmine_node: {
            options: {
                forceExit: true,
                specNameMatcher: '.specs',
            },
            all: ['specs/']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jasmine-node');

    grunt.registerTask('test', ['jasmine_node']);
};