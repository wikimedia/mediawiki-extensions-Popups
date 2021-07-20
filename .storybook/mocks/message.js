export default function message( key ) {
	return {
		exists: () => true,
		text: () => {
			if ( key.indexOf( 'popups-refpreview-' ) > -1 ) {
				const type = key.split( 'popups-refpreview-' )[ 1 ];
				return type === 'generic' ? 'Reference'
					: type[0].toUpperCase() + type.slice( 1 ) + ' reference';
			} else {
				return `<${key}>`;
			}
		}
	}
};
