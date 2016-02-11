module.exports = function(grunt) {
  // Automatically load required grunt tasks
  require('load-grunt-tasks')(grunt);

  // Set the path for aplication
  var config = {
    app: 'app',
    src: 'src'
  };

  grunt.initConfig({
  	// define config
    config: config,

    // clean app folder
    clean: {
      general: '<%= config.app %>',
      css: ['<%= config.app %>/styles/*.css', '!<%= config.app %>/styles/main.min.css'],
      images: '<%= config.app %>/images'
    },

    // validate js files without plugins folder
    jshint: {
      all: {
        src: [
          'Gruntfile.js', '<%= config.src %>/js/**/*.js', '!<%= config.src %>/js/plugins/**/*.js']
      }
    },

    // jade task - options to compile
    jade: {
	    compile: {
        options: {
          client: false,
          pretty: true
        },
        files: [{
          cwd: '<%= config.src %>/jade/pages',
          src: '**/*.jade',
          dest: '<%= config.app %>',
          expand: true,
          ext: '.html'
        }]
	    }
    },

    // compile and transform sass to css
    sass: {
      dist: {
        options: {
          compass: true        
        },
        files: {
          '<%= config.app %>/styles/main.min.css': '<%= config.src %>/scss/main.scss'
        }
      }
    },

    // add vendor prefixed styles (-webkit, -moz-, -o-, etc...)
    autoprefixer: {
      options: {
        browsers: ['Chrome >= 35', 'Firefox >= 31', 'Edge >= 12', 'Explorer >= 9', 'iOS >= 8', 'Safari >= 8', 'Android 2.3', 'Android >= 4', 'Opera >= 12']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/styles/',
          src: '{,*/}*.css',
          dest: '<%= config.app %>/styles/'
        }]
      }
    },

    // copy task
    copy: {
      // copy all js files from src to app
      jsFiles: {
        expand: true,
        cwd: '<%= config.src %>/js',
        src: ['**/*.js'],
        dest: '<%= config.app %>/js'
      },
      // copy fonts if exists
      fonts: {
      	expand: true,
        cwd: '<%= config.src %>/fonts',
        src: ['**/*.{eot,ttf,otf,cff,woff,svg,std}'],
        dest: '<%= config.app %>/fonts'
      }
    },

    // imagemin task - copy all images/folders from src in app
    imagemin: {
      dynamic: {
        options: {
          optimizationLevel: 1
        },
        files: [{
          expand: true,
          cwd: '<%= config.src %>',             // Src matches are relative to this path
          src: ['images/**/*.{png,jpg,gif,svg,ico}'],   // Select all images and folders from images folder
          dest: '<%= config.app %>'             // Destination path prefix
        }]
      }
    },

    // create sprites
    sprite: {
      all: {
      	// set path to icons
        src: '<%= config.src %>/images/icons/*.png',
        dest: '<%= config.src %>/images/sprites/spritesheet.png',
        destCss: '<%= config.src %>/images/sprites/sprites.css'
      }
    },

    // minify js
    uglify: {
      my_target: {
        files: {
          '<%= config.app %>/js/main.min.js':'<%= config.app %>/js/main.min.js'
        }
      }
    },

    // minify css
    cssmin: {
      target: {
        files: {
          '<%= config.app %>/styles/main.min.css':'<%= config.app %>/styles/main.min.css'
        }
      }
    },

    // remove livereload when build as production project
    dom_munger: {
    	update: {
				options: {
					remove: 'script[data-remove="true"]'
				},
				src: '<%= config.app %>/**/*.html'
			}
		},

		// create a zip with your project
		compress: {
		  main: {
		    options: {
		      archive: 'archive.zip'
		    },
		    expand: true,
		    cwd: '<%= config.app %>',
		    src: ['**/*'],
		    dest: '<%= config.app %>'
		  }
		},

    // connect task
    connect: {
      server: {
        options: {
          open: true,
          port: 8000,
          base: {
            path: '<%= config.app %>',
            options: {
              index: 'index.html',
              maxAge: 300000
            }
          }
        }
      }
    },

    // watch task
    watch: {
      grunt: { files: ['Gruntfile.js'] },
      jade: {
        files: '<%= config.src %>/jade/**/*.jade',
        tasks: ['jade'],
        options: {
          livereload: true
        }
      },

      sass: {
      	files: '<%= config.src %>/scss/**/*.scss',
        tasks: ['sass','autoprefixer'],
        options: {
          livereload: true
        }
      },

      scripts: {
        files: ['<%= config.src %>/js/{,*/}*.js','Gruntfile.js'],
        tasks: ['jshint','copy:jsFiles'],
        options: {
          livereload: true
        }
      },

      images: {
        files: '<%= config.src %>/images/{,*/}*.{png,jpg,gif,svg,ico}',
        tasks: ['clean:images','imagemin'],
        options: {
          livereload: true
        }
      },
    }
  });
  
  // grunt - run the project
  grunt.registerTask('default', ['clean:general','jade','sass','autoprefixer','copy:jsFiles','copy:fonts','imagemin','connect','watch']);

  // grunt build - generate a production form
  grunt.registerTask('build', ['clean:general','jade','sass','autoprefixer','copy:jsFiles','copy:fonts','imagemin','uglify','cssmin','dom_munger','compress']);

  // grunt sprites - create sprites (require src/images/icons - here all icons)
  grunt.registerTask('sprites', 'sprite');
};