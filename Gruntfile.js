'use strict';

module.exports = function(grunt) {
    grunt.initConfig({
        jshint: {
            options: {
                jshintrc: '.jshintrc',
            },
            files: ['lib/**/*.js']
        },
        jasmine_nodejs: {
            all: {
                specs: ['specs/*.js']
            }
        },
        connect: {
            example: {
                options: {
                    base: 'example'
                }
            },
            'client-test': {
                options: {
                    base: '.'
                }
            }
        },
        protractor: {
            options: {
                configFile: 'example/protractor-conf.js',
                //debug: true
            },
            example: {}
        },
        browserify: {
            test: {
                files: {
                    'tests/bundle/httpMock.js': ['lib/httpMock.js']
                },
                options: {
                    browserifyOptions: {
                        standalone: 'httpMock'
                    }
                }
            }
        },
        jasmine: {
            test: {
                src: 'tests/bundle/httpMock.js',
                options: {
                    specs: 'tests/*.test.js',
                    vendor: [
                        'http://cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.20/angular.js'
                    ],
                    helpers: [
                        'tests/setup.js'
                    ],
                    template: 'tests/template.tmpl'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jasmine-nodejs');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-protractor-runner');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-jasmine');

    grunt.registerTask('host-example', ['connect:example:keepalive']);
    grunt.registerTask('example', ['connect:example', 'protractor:example']);
    grunt.registerTask('test', ['jasmine_nodejs']);
    grunt.registerTask('lint', ['jshint']);
    grunt.registerTask('client-test', ['browserify:test', 'jasmine:test']);

    grunt.registerTask('verify', ['lint', 'test', 'client-test', 'example']);
};
