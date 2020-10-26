// ==UserScript==
// @name         LD Dev Tools
// @version      0.6
// @description  try to take over the world!
// @author       Isaiah Schultz
// @run-at       document-idle
// @match        https://lawyers.findlaw.com/*
// @match        https://lawyers.findlaw-stage.com/*
// @match        https://lawyers-stage.findlaw.com/*
// @match        https://lawyers-qa.findlaw.com/*
// @match        https://lawyers-dev.findlaw.com/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    // Build Number:///////////////////////////////////////////////////////////////////////////////////////
    var buildNumTxt = 'Build: unknown';
    if (typeof BuildNumber !== 'undefined') {
        buildNumTxt = BuildNumber;
    }
    var buildNumDiv = document.createElement('pre');
    buildNumDiv.style.cssText = 'position: fixed;left: 5%;top: 1%;padding: 3px;color: black;font-size: x-small;background-color: white;opacity: 75%;';
    buildNumDiv.appendChild(document.createTextNode(buildNumTxt));
    document.body.appendChild(buildNumDiv);
    ///////////////////////////////////////////////////////////////////////////////////////////////////////

    // DATA LAYER DISPLAY://///////////////////////////////////////////////////////////////////////////////
    var dataLayerText = 'FLDataLayer = ' + JSON.stringify(FLDataLayer,null,1)
    if (typeof FlagsFLFE !== 'undefined') {
        dataLayerText += ';\nFlagsFLFE = ' + JSON.stringify(FlagsFLFE,null,1) + ';';
    }
    var dataLayerDiv = document.createElement('pre');
    dataLayerDiv.style.cssText = 'position: fixed;left: 86%;top: 5%;padding: 3px;color: black;background-color: lightgreen;width: 10%;font-size: x-small;opacity: 75%;';
    dataLayerDiv.appendChild(document.createTextNode(dataLayerText));
    document.body.appendChild(dataLayerDiv);
    ///////////////////////////////////////////////////////////////////////////////////////////////////////

    // LD or PVIEW?////////////////////////////////////////////////////////////////////////////////////////
    if (String(document.location).includes('/profile/')) {
        GM_xmlhttpRequest({
            method: "GET",
            url: document.location,
            onload: function(response) {
                var newDiv = document.createElement('div');
                var style = 'background-color: red;';
                var textVal = 'error';

                if (response.responseHeaders.includes('ldprofile: true')) {
                    textVal = 'LD';
                    style = "background-color: lightgreen;"
                } else {
                    textVal = 'PVIEW';
                    style = "background-color: lightblue;"
                }

                newDiv.style.cssText = 'position: fixed;left: 47%;top: 1%;padding: 3px;color: black;font-weight: bolder;' + style;

                var newContent = document.createTextNode(textVal);
                newDiv.appendChild(newContent);

                document.body.appendChild(newDiv);
            }
        });
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////
})();
