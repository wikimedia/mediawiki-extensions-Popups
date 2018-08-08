/* eslint-evn node */

module.exports = function ( grunt ) {
	const conf = grunt.file.readJSON( 'extension.json' );

	grunt.loadNpmTasks( 'grunt-banana-checker' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-eslint' );
	grunt.loadNpmTasks( 'grunt-jsonlint' );
	grunt.loadNpmTasks( 'grunt-stylelint' );
	grunt.loadNpmTasks( 'grunt-svgmin' );

	grunt.initConfig( {
		banana: conf.MessagesDirs,
		eslint: {
			options: {
				maxWarnings: 0,
				reportUnusedDisableDirectives: true
			},
			// Lint the built artifacts with ES5 so that no ES6 slips to production
			build: {
				options: {
					configFile: '.eslintrc.es5.json'
				},
				src: [
					'resources/dist/*.js'
				]
			},
			sources: {
				src: [
					'*.js',
					'src/**/*.js',
					'tests/**/*.js'
				]
			},
			sourcesfix: {
				options: {
					fix: true
				},
				src: [
					'*.js',
					'src/**/*.js',
					'tests/**/*.js'
				]
			}
		},
		jsonlint: {
			all: [
				'*.json',
				'**/*.json',
				'!docs/**',
				'!node_modules/**',
				'!vendor/**'
			]
		},
		stylelint: {
			options: {
				syntax: 'less'
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

	grunt.registerTask( 'fix', [ 'eslint:sourcesfix' ] );
	grunt.registerTask( 'lint', [ 'eslint', 'stylelint', 'jsonlint', 'banana', 'eslint:build', 'svgmin' ] );
	grunt.registerTask( 'default', [ 'lint' ] );
};
