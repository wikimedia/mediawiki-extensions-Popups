/* eslint-evn node */

module.exports = function ( grunt ) {
	var conf = grunt.file.readJSON( 'extension.json' );

	grunt.loadNpmTasks( 'grunt-banana-checker' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-eslint' );
	grunt.loadNpmTasks( 'grunt-jsonlint' );
	grunt.loadNpmTasks( 'grunt-stylelint' );

	grunt.initConfig( {
		banana: conf.MessagesDirs,
		eslint: {
			options: {
				maxWarnings: 0
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
					'src/**/*.js',
					'tests/node-qunit/**/*.js'
				]
			},
			sourcesfix: {
				options: {
					fix: true
				},
				src: [
					'src/**/*.js',
					'tests/node-qunit/**/*.js'
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
				'resources/ext.popups.main/**/*.less'
			]
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
	grunt.registerTask( 'lint', [ 'eslint', 'stylelint', 'jsonlint', 'banana', 'eslint:build' ] );
	grunt.registerTask( 'default', [ 'lint' ] );
};
