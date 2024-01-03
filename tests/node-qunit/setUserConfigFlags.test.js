import setUserConfigFlags from '../../src/setUserConfigFlags';

QUnit.module( 'ext.popups#setUserConfigFlags' );

QUnit.test( 'config settings are successfully set from bitmask', ( assert ) => {
	const config = new Map();

	config.set( 'wgPopupsFlags', '7' );
	setUserConfigFlags( config );

	assert.deepEqual(
		[
			config.get( 'wgPopupsConflictsWithNavPopupGadget' )
		],
		[ true ]
	);

	config.set( 'wgPopupsFlags', '2' );
	setUserConfigFlags( config );

	assert.deepEqual(
		[
			config.get( 'wgPopupsConflictsWithNavPopupGadget' )
		],
		[ false ]
	);

	config.set( 'wgPopupsFlags', '5' );
	setUserConfigFlags( config );

	assert.deepEqual(
		[
			config.get( 'wgPopupsConflictsWithNavPopupGadget' )
		],
		[ true ]
	);

	config.set( 'wgPopupsFlags', '0' );
	setUserConfigFlags( config );

	assert.deepEqual(
		[
			config.get( 'wgPopupsConflictsWithNavPopupGadget' )
		],
		[ false ]
	);
} );
