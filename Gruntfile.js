// jscs:disable jsDoc
/*jshint node:true */
module.exports = function ( grunt ) {
	var QUNIT_URL_BASE = 'http://localhost:8080/wiki/Special:JavaScriptTest/qunit/plain?module=';

	grunt.loadNpmTasks( 'grunt-banana-checker' );
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-qunit' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-jscs' );
	grunt.loadNpmTasks( 'grunt-jsonlint' );
	grunt.loadNpmTasks( 'grunt-stylelint' );

	grunt.initConfig( {
		banana: {
			all: 'i18n/'
		},
		jscs: {
			options: {
				config: '.jscsrc'
			},
			main: '<%= jshint.all %>',
			test: {
				options: {
					config: 'tests/.jscsrc.js'
				},
				files: {
					src: [
						'tests/qunit/**/*.js',
						'!tests/qunit/ext.popups.core.test.js'
					]
				}
			}
		},
		jshint: {
			options: {
				jshintrc: true
			},
			all: [
				'*.js',
				'**/*.js',
				'!node_modules/**',
				'!resources/ext.popups.lib/**',
				// FIXME: Remove ignores for legacy code upon removal/refactor
				'!resources/ext.popups.core/**',
				'!resources/ext.popups.desktop/**',
				'!resources/ext.popups.images/**',
				'!resources/ext.popups.renderer.desktopRenderer/**',
				'!resources/ext.popups.schemaPopups/**',
				'!resources/ext.popups.schemaPopups.utils/**',
				'!resources/ext.popups.targets.desktopTarget/**',
				// End legacy code
				'!tests/qunit/**'
			],
			test: {
				files: {
					src: 'tests/qunit/**/*.js'
				}
			}
		},
		jsonlint: {
			all: [
				'*.json',
				'**/*.json',
				'!node_modules/**'
			]
		},
		qunit: {
			all: {
				options: {
					summaryOnly: true,
					urls: [
						// Add QUnit modules below using the format:
						// QUNIT_URL_BASE + 'ext.popups.testModule'
						QUNIT_URL_BASE + 'ext.popups'
					]
				}
			}
		},
		stylelint: {
			options: {
				syntax: 'less'
			},
			all: [
				'resources/**/*.less'
			]
		},
		watch: {
			lint: {
				files: [ 'resources/**/*.js', 'tests/qunit/**/*.js' ],
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

	grunt.registerTask( 'lint', [ 'jshint', 'jscs', 'jsonlint', 'banana' ] );
	grunt.registerTask( 'test', [ 'qunit' ] );
	grunt.registerTask( 'default', [ 'test', 'lint' ] );
};
