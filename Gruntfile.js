/* eslint-evn node */

module.exports = function ( grunt ) {
	const conf = grunt.file.readJSON( 'extension.json' );

	grunt.loadNpmTasks( 'grunt-banana-checker' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-eslint' );
	grunt.loadNpmTasks( 'grunt-stylelint' );
	grunt.loadNpmTasks( 'grunt-svgmin' );

	grunt.initConfig( {
		banana: conf.MessagesDirs,
		eslint: {
			options: {
				cache: true,
				maxWarnings: 0,
				fix: grunt.option( 'fix' )
			},
			all: {
				src: [
					'*.{js,json}',
					'src/**/*.{js,json}',
					'tests/**/*.{js,json}',
					// Lint the built artifacts with ES5 so that no ES6 slips to production
					'resources/dist/*.js'
				]
			}
		},
		stylelint: {
			options: {
				syntax: 'less',
				fix: grunt.option( 'fix' )
			},
			all: [
				'src/**/*.less'
			]
		},
		// SVG Optimization
		svgmin: {
			options: grunt.file.readJSON( '.svgo.json' ),
			all: {
				files: [ {
					expand: true,
					cwd: 'resources/ext.popups.images',
					src: [
						'**/*.svg'
					],
					dest: 'resources/ext.popups.images/',
					ext: '.svg'
				} ]
			}
		},
		watch: {
			options: {
				interrupt: true,
				debounceDelay: 1000
			},
			lint: {
				files: [ 'resources/ext.popups.main/**/*.less', 'resources/**/*.js' ],
				tasks: [ 'lint' ]
			},
			configFiles: {
				files: [ 'Gruntfile.js' ],
				options: {
					reload: true
				}
			}
		}
	} );

	grunt.registerTask( 'lint', [ 'eslint', 'stylelint', 'banana', 'svgmin' ] );
	grunt.registerTask( 'default', [ 'lint' ] );
};
