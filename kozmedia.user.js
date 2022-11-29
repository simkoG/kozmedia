// ==UserScript==
// @name         simple-kozmedia
// @namespace    http://tampermonkey.net/
// @version      2.1.1
// @description  Modify the Hungarian National Television's live stream page to load only the video.
// @author       simko.me
// @match        https://*hirado.hu/*elo*
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
    const version = '2.1.1';

    const html = document.querySelector( 'html' );
    const head = document.querySelector( 'head' );
    const body = document.body;


    // Hide all elements before loading the new player.
    (() => {
        html.style.background = "black";
        body.style.display = "none";
    })();


    // run app after pageload
    window.addEventListener( 'load', () => {
        init();
    }, false );


    // resize the iframe when the browser size changes
    window.addEventListener( 'resize', () => {
        resizeIframe();
    });


    /**
     * Starts the app
     *
     * @return void
     */
    let init = () => {
        console.clear();
        console.group( 'simpe-kozmedia, v' );
        console.log( 'version: ' + version );
        console.log( 'more info: https://github.com/simkoG/kozmedia' );
        console.groupEnd();

        let originalSrc = document.querySelector( '.mtva-player-video-iframe' ).getAttribute( 'src' );

        resetPage();
        body.appendChild( getVideoIframe( originalSrc ) );
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
    let getVideoIframe = ( src ) => {
        let iframe = document.createElement( 'iframe' );
        iframe.classList.add( 'mtva-player-video-iframe' );
        iframe.setAttribute( 'src', src );
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
