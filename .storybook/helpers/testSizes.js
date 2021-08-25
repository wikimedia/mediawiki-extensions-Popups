/**
 * This script evaluates the width and height of stories
 * and annotates them if they are not to the design spec
 * as specified in https://www.mediawiki.org/wiki/Page_Previews/Design_specifications
 */
// Delay to allow CSS adjustment
setTimeout( function () {
    Array.from( document.querySelectorAll( '.mwe-popups' ) ).forEach((popup) => {
        const isLandscape = popup.classList.contains( 'mwe-popups-is-tall' );
        const thumbnail = popup.querySelector( '.mwe-popups-thumbnail' );
        const isTextOnly = thumbnail === null;
        const bbox = popup.getBoundingClientRect();
        const h = Math.floor( bbox.height );
        const w = Math.floor( bbox.width );
        const extract = popup.querySelector( '.mwe-popups-extract' );

        // Per https://www.mediawiki.org/wiki/Page_Previews/Design_specifications
        //
        // Horizontal (landscape) (isLandscape)
        //
        // width: 450px
        // height: 242px
        // image height: 242px
        // text area height: 242px
        //
        // Vertical (portrait) (!isLandscape)
        //
        // width: 320px
        // total max-height: 394px
        // image height: 192px
        // text area max-height: 202px
        //
        // Text
        // width: 320px;
        // max-height: 200px
        const expectedWidth = isLandscape ? 450 : 320;
        const maxHeight = isLandscape ?
            // https://www.mediawiki.org/wiki/Page_Previews/Design_specifications#Size_&_general_styling_2
            242 :
            ( isTextOnly ?
                // https://www.mediawiki.org/wiki/Page_Previews/Design_specifications#Size_&_general_styling
                200 :
                // https://www.mediawiki.org/wiki/Page_Previews/Design_specifications#Inner_styling_3
                // max height of text area is 202px.
                // height of image is always 192px.
                // 192 + 202 = 394
                394
            );
        const minHeight = isLandscape ? 242 : 0;

        const wClass = `class="${w !== expectedWidth ? 'error' : ''}"`;
        // Due to rounding errors we check within 1px of the limit.
        const hClass = `class="${h > maxHeight + 1 || h < minHeight - 1 ? 'error' : ''}"`;

        let thumbnailReport = '';
        let thumbH = 0;
        if ( thumbnail ) {
            const bboxThumb = thumbnail.getBoundingClientRect();
            thumbH = Math.round( bboxThumb.height );
            if ( isLandscape ) {
                const thumbW = Math.round( bboxThumb.width );
                // See https://www.mediawiki.org/wiki/Page_Previews/Design_specifications#Inner_styling_2
                const expectedThumbWidth = 203;
                const thumbWClass = `class="${thumbW !== expectedThumbWidth ? 'error' : ''}"`;
                thumbnailReport = `Thumbnail width = <span ${thumbWClass}>${thumbW} <span> (expected ${expectedThumbWidth})</span>
                </span>`;
            } else {
                // See https://www.mediawiki.org/wiki/Page_Previews/Design_specifications#Inner_styling_3
                const expectedThumbHeight = 192;
                const thumbHClass = `class="${thumbH !== expectedThumbHeight ? 'error' : ''}"`;
                thumbnailReport = `ThumbH = <span ${thumbHClass}>${thumbH} <span> (expected ${expectedThumbHeight})</span>
                </span>`;
            }
        }

        let extractReport = '';
        const extractBBox = extract.getBoundingClientRect();
        // https://www.mediawiki.org/wiki/Page_Previews/Design_specifications#Inner_styling
        // Footer contains 34x34 icon and 16px padding.
        // Top padding of the preview extract is always 20px;
        const PREVIEW_FOOTER_HEIGHT = 34 + 16;
        const maxHeightExtract = isLandscape ?
            // https://www.mediawiki.org/wiki/Page_Previews/Design_specifications#Inner_styling_2
            242:
            // https://www.mediawiki.org/wiki/Page_Previews/Design_specifications#Inner_styling_3
            202;

        const extractHeight = extractBBox.height + PREVIEW_FOOTER_HEIGHT;

        const errorClass = ( extractHeight > maxHeightExtract + 1 ) ?
            'error' : '';
        extractReport = `ExH = <span class="${errorClass}">${extractHeight}
            <span>(expected < ${maxHeightExtract})</span>
        </span>`;

        const report = document.createElement( 'div' );
        report.setAttribute( 'class', 'storybook-report' );
        report.innerHTML = `W=<span ${wClass}>${w}<span>(expected ${expectedWidth})</span></span>,
H=<span ${hClass}>${h}<span> (expected range ${minHeight} - ${maxHeight})</span></span>
${thumbnailReport}
${extractReport}`;
        popup.parentNode.appendChild( report );
    })
}, 50 );