module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      dist: {
        src: ['public/client/*.js'],   // All JS in the libs folder
        dest: 'public/build/production.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      dist: {
        src: ['public/build/production.js'],
        dest: 'public/build/production.js'
      }
    },

    jshint: {
      files: [
        // Add filespec list here
        'public/client/*.js',
        'app/**/*.js',
        '*.js'
      ],
      options: {
        jshintrc: '.jshintrc',
        ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js'
        ]
      }
    },

    cssmin: {
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
      }
    },

    'azure-cdn-deploy': {
      app: {
        options: {
            containerName: 'containthis',
            serviceOptions : ['mplant', 'p+p32tptT84q6tpwlwbfCxQK9TYGNgpt9bgL0uMB3HB6b0e4lT2bOPBua27KZrqA/6Bf0hBG3jGu2d4hbHl77w=='],
            numberOfFoldersToStripFromSourcePath: 2,
            destinationFolderPath: 'dev/app/'
          },
        src: ['public/build/*.{html,js,png,css}']
      },

      deps: {
        options: {
          containerName: 'containthis',
          serviceOptions : ['mplant', 'p+p32tptT84q6tpwlwbfCxQK9TYGNgpt9bgL0uMB3HB6b0e4lT2bOPBua27KZrqA/6Bf0hBG3jGu2d4hbHl77w=='],
          numberOfFoldersToStripFromSourcePath: 2,
          destinationFolderPath: 'dev/lib/'
        },
        src: ['public/lib/*.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-azure-cdn-deploy');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', ['jshint', 'concat', 'uglify', 'azure-cdn-deploy']);

  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      // add your production server task here
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [
    // add your deploy tasks here
  ]);

};
