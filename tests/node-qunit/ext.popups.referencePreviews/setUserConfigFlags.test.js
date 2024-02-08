import setUserConfigFlags from '../../../resources/ext.popups.referencePreviews/setUserConfigFlags';

QUnit.module( 'ext.popups.referencePreviews#setUserConfigFlags' );

QUnit.test( 'reference preview config settings are successfully set from bitmask', ( assert ) => {
	const config = new Map();

	config.set( 'wgPopupsFlags', '7' );
	setUserConfigFlags( config );

	assert.deepEqual(
		[
			config.get( 'wgPopupsConflictsWithRefTooltipsGadget' ),
			config.get( 'wgPopupsReferencePreviews' )
		],
		[ true, true ]
	);

	config.set( 'wgPopupsFlags', '2' );
	setUserConfigFlags( config );

	assert.deepEqual(
		[
			config.get( 'wgPopupsConflictsWithRefTooltipsGadget' ),
			config.get( 'wgPopupsReferencePreviews' )
		],
		[ true, false ]
	);

	config.set( 'wgPopupsFlags', '5' );
	setUserConfigFlags( config );

	assert.deepEqual(
		[
			config.get( 'wgPopupsConflictsWithRefTooltipsGadget' ),
			config.get( 'wgPopupsReferencePreviews' )
		],
		[ false, true ]
	);

	config.set( 'wgPopupsFlags', '0' );
	setUserConfigFlags( config );

	assert.deepEqual(
		[
			config.get( 'wgPopupsConflictsWithRefTooltipsGadget' ),
			config.get( 'wgPopupsReferencePreviews' )
		],
		[ false, false ]
	);
} );
