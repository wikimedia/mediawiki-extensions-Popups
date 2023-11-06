import setUserConfigFlags from '../../src/setUserConfigFlags';

QUnit.module( 'ext.popups#setUserConfigFlags' );

QUnit.test( 'config settings are successfully set from bitmask', ( assert ) => {
	const config = new Map();

	config.set( 'wgPopupsFlags', '7' );
	setUserConfigFlags( config );

	assert.deepEqual(
		[
			config.get( 'wgPopupsConflictsWithNavPopupGadget' ),
			config.get( 'wgPopupsConflictsWithRefTooltipsGadget' ),
			config.get( 'wgPopupsReferencePreviews' )
		],
		[ true, true, true ]
	);

	config.set( 'wgPopupsFlags', '2' );
	setUserConfigFlags( config );

	assert.deepEqual(
		[
			config.get( 'wgPopupsConflictsWithNavPopupGadget' ),
			config.get( 'wgPopupsConflictsWithRefTooltipsGadget' ),
			config.get( 'wgPopupsReferencePreviews' )
		],
		[ false, true, false ]
	);

	config.set( 'wgPopupsFlags', '5' );
	setUserConfigFlags( config );

	assert.deepEqual(
		[
			config.get( 'wgPopupsConflictsWithNavPopupGadget' ),
			config.get( 'wgPopupsConflictsWithRefTooltipsGadget' ),
			config.get( 'wgPopupsReferencePreviews' )
		],
		[ true, false, true ]
	);

	config.set( 'wgPopupsFlags', '0' );
	setUserConfigFlags( config );

	assert.deepEqual(
		[
			config.get( 'wgPopupsConflictsWithNavPopupGadget' ),
			config.get( 'wgPopupsConflictsWithRefTooltipsGadget' ),
			config.get( 'wgPopupsReferencePreviews' )
		],
		[ false, false, false ]
	);
} );
