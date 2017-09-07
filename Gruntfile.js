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
					'src/**',
					'tests/node-qunit/**/*.js',
					'!resources/dist/index.js',
					'!docs/**',
					'!node_modules/**'
				]
			}
		},
		jsonlint: {
			all: [
				'*.json',
				'**/*.json',
				'!docs/**',
				'!node_modules/**'
			]
		},
		stylelint: {
			options: {
				syntax: 'less'
			},
			all: [
				'resources/ext.popups/**/*.less'
			]
		},
		watch: {
			options: {
				interrupt: true,
				debounceDelay: 1000
			},
			lint: {
				files: [ 'resources/ext.popups/**/*.less', 'resources/**/*.js' ],
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

	grunt.registerTask( 'lint', [ 'eslint', 'stylelint', 'jsonlint', 'banana', 'eslint:build' ] );
	grunt.registerTask( 'default', [ 'lint' ] );
};
