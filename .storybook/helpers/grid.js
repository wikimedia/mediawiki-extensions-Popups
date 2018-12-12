/**
 * Grid helper for absolutely positioning popups on page.
 */
const grid = {
	landscape: {
		row: ( x ) => 50 + ( ( x - 1 ) * 300 ),
		col: ( x ) => 50 + ( ( x - 1 ) * 500 )
	},
	portrait: {
		row: ( x ) => 50 + ( ( x - 1 ) * 450 ),
		col: ( x ) => 50 + ( ( x - 1 ) * 400 )
	},
}

export default grid;
