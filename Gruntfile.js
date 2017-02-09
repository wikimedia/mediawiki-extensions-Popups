/* eslint-evn node */

module.exports = function ( grunt ) {
	var conf = grunt.file.readJSON( 'extension.json' ),
		QUNIT_URL_BASE = 'http://localhost:8080/wiki/Special:JavaScriptTest/qunit/plain';

	grunt.loadNpmTasks( 'grunt-banana-checker' );
	grunt.loadNpmTasks( 'grunt-contrib-qunit' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-eslint' );
	grunt.loadNpmTasks( 'grunt-jsonlint' );
	grunt.loadNpmTasks( 'grunt-stylelint' );

	grunt.initConfig( {
		banana: conf.MessagesDirs,
		eslint: {
			fix: {
				options: {
					fix: true
				},
				src: [
					'<%= eslint.all %>'
				]
			},
			all: [
				'build/**',
				'resources/ext.popups/*.js',
				'resources/ext.popups/**/*.js',
				'!resources/ext.popups/gateway/*.js',
				'!resources/ext.popups/reducers/*.js',
				'!resources/ext.popups/preview/*.js',
				'!resources/ext.popups/changeListeners/*.js',
				'!docs/**',
				'!node_modules/**'
			]
		},
		jsonlint: {
			all: [
				'*.json',
				'**/*.json',
				'!docs/**',
				'!node_modules/**'
			]
		},
		qunit: {
			all: {
				options: {
					timeout: 10000, // Using the filter query param takes longer
					summaryOnly: true,
					urls: [
						// Execute any QUnit test in those module whose names begin with
						// "ext.popups".
						QUNIT_URL_BASE + '?filter=ext.popups'
					]
				}
			}
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
				files: [ 'resources/ext.popups/**/*.less', 'resources/**/*.js', 'tests/qunit/**/*.js' ],
				tasks: [ 'lint' ]
			},
			scripts: {
				files: [ 'resources/**/*.js', 'tests/qunit/**/*.js' ],
				tasks: [ 'test' ]
			},
			configFiles: {
				files: [ 'Gruntfile.js' ],
				options: {
					reload: true
				}
			}
		}
	} );

	grunt.registerTask( 'lint', [ 'eslint:all', 'stylelint', 'jsonlint', 'banana' ] );
	grunt.registerTask( 'test', [ 'qunit' ] );
	grunt.registerTask( 'default', [ 'lint', 'test' ] );
};
