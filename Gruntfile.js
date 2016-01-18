'use strict';

module.exports = function(grunt) {
    require('time-grunt')(grunt);
    require('jit-grunt')(grunt, {
        buildcontrol: 'grunt-build-control'
        });

    grunt.initConfig({
        app: {
            source: 'app',
            dist: 'build',
            baseurl: 'littleplanet-vr.github.io',
            git_repo: 'https://github.com/littleplanet-vr/littleplanet-vr.github.io',
            branch: 'master'
        },
        watch: {
            scripts: {
                files: ['<%= app.source %>/**/*.jade'],
                tasks: ['jade:server']
            }
        },
        copy: {
          server: {
              expand: true,
              dot: true,
              cwd: '<%= app.source %>',
              src: ['**', '!**/*.jade', '!**/views', '!**/index.html'],
              dest: '<%= app.dist %>/.tmp/<%= app.baseurl %>'
          },
          dist: {
              expand: true,
              dot: true,
              cwd: '<%= app.source %>',
              src: ['**', '!**/*.jade', '!**/views'],
              dest: '<%= app.dist %>/<%= app.baseurl %>'
          }
        },
        clean: {
          server: [
            '<%= app.dist %>/.tmp'
          ],
          dist: [
            '<%= app.dist %>/<%= app.baseurl %>'
          ]
        },
        jade: {
          server: {
            options: {
              client: false,
              pretty: true,
              data: {}
            },
            files: [{
              expand: true,
              cwd: '<%= app.source %>',
              src: '**/*.jade',
              dest: '<%= app.dist %>/.tmp/<%= app.baseurl %>',
              ext: '.html'
            }]
          },
          dist: {
            options: {
              client: false,
              pretty: true,
              data: {}
            },
            files: [{
              expand: true,
              cwd: '<%= app.source %>',
              src: '**/*.jade',
              dest: '<%= app.dist %>/<%= app.baseurl %>',
              ext: '.html'
            }]
          }
        },
        browserSync: {
            options: {
                notify: false,
                port: 9000,
                open: true,
                startPath: '/'
            },
            server: {
                options: {
                    watchTask: true,
                    injectChanges: true,
                    server: {
                        baseDir: ['<%= app.dist %>/.tmp/<%= app.baseurl %>/']
                    }
                },
                src: [
                    '**/*.{css,html,js,json,xml}'
                ]
            },
            dist: {
                options: {
                    server: {
                        baseDir: '<%= app.dist %>'
                    }
                },
                src: [
                    '<%= app.dist %>/**/*.{css,html,js,json,xml}',
                    '.tmp/**/*.{css,html,js,json,xml}'
                ]
            }
        },
        buildcontrol: {
            dist: {
                options: {
                    dir: '<%= app.dist %>/<%= app.baseurl %>',
                    remote: '<%= app.git_repo %>',
                    branch: '<%= app.branch %>',
                    commit: true,
                    push: true,
                    connectCommits: false
                }
            }
        }
    });

    grunt.registerTask('build', [
      'clean:dist',
      'copy:dist',
      'jade:dist'
    ]);

    grunt.registerTask('serve', function(target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'browserSync:dist']);
        }

        grunt.task.run([
            'clean:server',
            'copy:server',
            'jade:server',
            'browserSync:server',
            'watch'
        ]);
    });

    grunt.registerTask('deploy', [
        'build',
        'buildcontrol'
    ]);
};
