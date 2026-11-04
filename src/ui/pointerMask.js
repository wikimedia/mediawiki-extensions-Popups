/**
 * @module pointerMask
 * @private
 */

/**
 * SVG clip paths, put into the document body via renderer.createPointerMasks().
 * The IDs are referenced from renderer.getThumbnailClipPathID().
 *
 * - mwe-popups-mask: The pointer is left-aligned and points to the top.
 * - mwe-popups-mask-flip: The pointer is right-aligned (relative to a 320 wide
 *   rectangle) and points to the top. "flip" means horizontally flipped here!
 * - mwe-popups-landscape-mask: The pointer is right-aligned (relative to a 200 wide
 *   rectangle) and points to the top.
 * - mwe-popups-landscape-mask-flip: The pointer is right-aligned (relative to a
 *   200 x 250 rectangle) and points to the bottom. "flip" means vertically flipped here!
 *
 * @private
 */
module.exports = `<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0">
	<defs>
		<clipPath id="mwe-popups-mask">
			<path d="M0 8h10l8-8 8 8h974v992H0z"/>
		</clipPath>
		<clipPath id="mwe-popups-mask-flip">
			<path d="M0 8h294l8-8 8 8h690v992H0z"/>
		</clipPath>
		<clipPath id="mwe-popups-landscape-mask">
			<path d="M0 8h174l8-8 8 8h810v992H0z"/>
		</clipPath>
		<clipPath id="mwe-popups-landscape-mask-flip">
			<path d="M0 0h1000v242H190l-8 8-8-8H0z"/>
		</clipPath>
	</defs>
</svg>`;
