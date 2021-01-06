/**
 * Grid helper for absolutely positioning popups on page.
 */
const grid = {
	landscape: {
		row: ( x ) => 50 + ( ( x - 1 ) * 460 ),
		col: ( x ) => 50 + ( ( x - 1 ) * 500 ),
		flipOffset: 400
	},
	portrait: {
		row: ( x ) => 50 + ( ( x - 1 ) * 450 ),
		col: ( x ) => 50 + ( ( x - 1 ) * 400 ),
		flipOffset: 400
	},
}

export default grid;
