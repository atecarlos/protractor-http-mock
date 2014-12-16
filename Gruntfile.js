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
        },
        connect: {
            example: {
                options: {
                    base: 'example'   
                }
            }
        },
        protractor: {
            options: {
                configFile: 'example/protractor.conf',
                //debug: true
            },
            example: {}
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jasmine-node');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-protractor-runner');

    grunt.registerTask('example', ['connect:example', 'protractor:example']);
    grunt.registerTask('test', ['jasmine_node']);
};