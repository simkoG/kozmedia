// ==UserScript==
// @name         simple-kozmedia
// @namespace    http://tampermonkey.net/
// @version      2.0.2
// @description  Modify the Hungarian National Television's live stream page to load only the video.
// @author       simko.me
// @match        https://*mediaklikk.hu/*elo*
// @match        https://*mediaklikk.hu/*video*
// @match        https://*m4sport.hu/*elo*
// @icon         https://raw.githubusercontent.com/simkoG/kozmedia/main/icon.png
// @resource     css-reset https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @updateURL    https://github.com/simkoG/kozmedia/raw/main/kozmedia.user.js
// @downloadURL  https://github.com/simkoG/kozmedia/raw/main/kozmedia.user.js
// ==/UserScript==

(function() {
    'use strict';
    console.clear();

    const name = 'simple-kozmedia';
    const version = '2.0.2';

    const html = document.querySelector( 'html' );
    const head = document.querySelector( 'head' );
    const body = document.body;

    const originalIframeSrc = document.querySelector( '.mtva-player-video-iframe' ).getAttribute( 'src' );

    // run app after pageload
    body.onload = () => {
        init();
    };

    // resize the iframe when the browser size changes
    window.onresize = () => {
        resizeIframe();
    }


    /**
     * Starts the app
     *
     * @return void
     */
    let init = () => {
        console.group( 'simpe-kozmedia, v' );
        console.log( 'version: ' + version );
        console.log( 'more info: https://github.com/simkoG/kozmedia' );
        console.groupEnd();

        resetPage();
        body.appendChild( getVideoIframe() );
        resizeIframe();
    }


    /**
     * Remove all elements from page
     *
     * @return void
     */
    let resetPage = () => {
        removeChilds( head );
        removeChilds( body );
        body.className = '';

        GM_addStyle( GM_getResourceText( 'css-reset' ) );

        html.style.cssText = `
            min-height: 100vh;
            background-color: #000;
        `;

        body.style.cssText = `
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        document.title = "Közmédia ÉLŐ";
    }


    /**
     * Remove all child elements of an element
     *
     * @param elem DOM object
     * @return void
     */
    let removeChilds = ( el ) => {
        while( el.firstChild ) {
            el.removeChild( el.firstChild );
        }
    }


    /**
     * Create the original video iframe
     *
     * @return DOM object
     */
    let getVideoIframe = () => {
        let iframe = document.createElement( 'iframe' );
        iframe.classList.add( 'mtva-player-video-iframe' );
        iframe.setAttribute( 'src', originalIframeSrc );
        iframe.setAttribute( 'allowFullScreen', '' );
        iframe.setAttribute( 'scrolling', 'no' );
        iframe.setAttribute( 'frameborder', '0' );
        iframe.setAttribute( 'marginwidth', '0' );
        iframe.setAttribute( 'marginheight', '0' );
        iframe.setAttribute( 'allow', 'encrypted-media' );
        iframe.style.display = 'block';
        return iframe;
    }


    /**
     * Resize iframe to 16:9 ratio
     *
     * @return void
     */
    let resizeIframe = () => {
        let iframe = document.querySelector( '.mtva-player-video-iframe' );
        let w = window.innerWidth;
        let h = window.innerHeight;

        if( w >= h * ( 16 / 9 ) ) {
            iframe.style.width = Math.round( ( h / 9 ) * 16 ) + "px";
            iframe.style.height = h + "px";
        } else {
            iframe.style.width = w + "px";
            iframe.style.height = Math.round( ( w / 16 ) * 9 ) + "px";
        }
    }
})();
