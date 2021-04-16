import setUserConfigFlags from '../../src/setUserConfigFlags';

QUnit.module( 'ext.popups#setUserConfigFlags' );

QUnit.test( 'config settings are successfully set from bitmask', ( assert ) => {
	const config = new Map();

	config.set( 'wgPopupsFlags', '15' );
	setUserConfigFlags( config );

	assert.deepEqual(
		[
			config.get( 'wgPopupsConflictsWithNavPopupGadget' ),
			config.get( 'wgPopupsConflictsWithRefTooltipsGadget' ),
			config.get( 'wgPopupsReferencePreviews' ),
			config.get( 'wgPopupsReferencePreviewsBeta' )
		],
		[ true, true, true, true ]
	);

	config.set( 'wgPopupsFlags', '10' );
	setUserConfigFlags( config );

	assert.deepEqual(
		[
			config.get( 'wgPopupsConflictsWithNavPopupGadget' ),
			config.get( 'wgPopupsConflictsWithRefTooltipsGadget' ),
			config.get( 'wgPopupsReferencePreviews' ),
			config.get( 'wgPopupsReferencePreviewsBeta' )
		],
		[ false, true, false, true ]
	);

	config.set( 'wgPopupsFlags', '5' );
	setUserConfigFlags( config );

	assert.deepEqual(
		[
			config.get( 'wgPopupsConflictsWithNavPopupGadget' ),
			config.get( 'wgPopupsConflictsWithRefTooltipsGadget' ),
			config.get( 'wgPopupsReferencePreviews' ),
			config.get( 'wgPopupsReferencePreviewsBeta' )
		],
		[ true, false, true, false ]
	);

	config.set( 'wgPopupsFlags', '0' );
	setUserConfigFlags( config );

	assert.deepEqual(
		[
			config.get( 'wgPopupsConflictsWithNavPopupGadget' ),
			config.get( 'wgPopupsConflictsWithRefTooltipsGadget' ),
			config.get( 'wgPopupsReferencePreviews' ),
			config.get( 'wgPopupsReferencePreviewsBeta' )
		],
		[ false, false, false, false ]
	);
} );
