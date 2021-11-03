// ==UserScript==
// @name         LD Dev Tools
// @version      0.17
// @description  try to take over the world!
// @author       Isaiah Schultz
// @run-at       document-idle
// @match        https://lawyers.findlaw.com/*
// @match        https://lawyers.findlaw-stage.com/*
// @match        https://lawyers-stage.findlaw.com/*
// @match        https://lawyers-qa.findlaw.com/*
// @match        https://lawyers-dev.findlaw.com/*
// @match        https://www.lawinfo.com/*
// @match        https://www.lawinfo-stage.com/*
// @match        https://www.lawinfo-qa.com/*
// @match        https://www.lawinfo-dev.com/*
// @match        https://www.flportaldev.int.thomsonreuters.com/*
// @match        https://www.flportalqa.int.thomsonreuters.com/*
// @match        https://www.flportalstage.int.thomsonreuters.com/*
// @match        https://www.findlaw-stage.com/*
// @match        https://findlaw.com/*
// @match        https://www.findlaw.com/*
// @match        https://public.flportaldev.int.thomsonreuters.com/*
// @match        https://public.flportalqa.int.thomsonreuters.com/*
// @match        https://public.flportalstage.int.thomsonreuters.com/*
// @match        https://public.findlaw.com/*
// @grant        GM_xmlhttpRequest
// @noframes
// ==/UserScript==

(function() {
    'use strict';
    try {
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
        var dataLayerText = 'FLDataLayer = ' + JSON.stringify(FLDataLayer,null,1) + ';'
        if (typeof FL !== 'undefined') {
            dataLayerText += '\nFL = ' + JSON.stringify(FL,null,1) + ';';
        }
        if (typeof document.getElementById('workers_data') !== 'undefined') {
            var workersDataValue = 'NOT ON PAGE';
            try {
                var workersData = document.getElementById('workers_data').textContent.replace(/\n/g, '').replace(/\"/g, '"').replace("flan:", "\"flan\":").trim();
                workersDataValue = JSON.stringify(JSON.parse(workersData),null,1) + ';'
            } catch(err) {
                if (typeof FLDataLayer.workers_data !== 'undefined') {
                    // then it's already being shown
                } else {
                    workersDataValue = 'ERROR: ' + err;
                }
            }
            dataLayerText += '\nworkers_data = ' + workersDataValue;
        }
        if (typeof FlagsFLFE !== 'undefined') {
            dataLayerText += '\nFlagsFLFE = ' + JSON.stringify(FlagsFLFE,null,1) + ';';
        }
        var dataLayerDiv = document.createElement('pre');
        dataLayerDiv.style.cssText = 'position: fixed;left: 86%;top: .6%;padding: 3px;color: black;background-color: lightgreen;width: 10%;font-size: x-small;opacity: 75%; max-height: 97%; z-index: 9999';
        dataLayerDiv.appendChild(document.createTextNode(dataLayerText));
        document.body.appendChild(dataLayerDiv);
        ///////////////////////////////////////////////////////////////////////////////////////////////////////

        // SRP CACHE WOKER? ///////////////////////////////////////////////////////////////////////////////////
        var srpDiv = document.getElementById('serp_results');
        if (srpDiv !== 'undefined' && srpDiv !== null && srpDiv.innerHTML !== null && String(srpDiv.innerHTML).includes('small-order-')) {
            var cfCacheWorkerTag = document.createElement('div');
            cfCacheWorkerTag.style.cssText = 'position: fixed;left: 5%;top: 6%;padding: 3px;color: black;font-size: x-small;background-color: orange;opacity: 75%;';
            cfCacheWorkerTag.appendChild(document.createTextNode('CF SRP cache worker ran!'));
            document.body.appendChild(cfCacheWorkerTag);
        }
        ///////////////////////////////////////////////////////////////////////////////////////////////////////

        // LD or PVIEW?////////////////////////////////////////////////////////////////////////////////////////
        if (String(document.location).includes('/profile/')) {
            var newDiv = document.createElement('div');
            var style = 'background-color: red;';
            var textVal = 'error';
            if (FLDataLayer.pageVersion === 'ldprofile') {
                textVal = '- LD -';
                style = "background-color: lightgreen;"
            } else {
                textVal = '- PVIEW -';
                style = "background-color: lightblue;"
            }

            newDiv.style.cssText = 'position: fixed;left: 47%;top: 1%;padding: 3px;color: black;font-weight: bolder;' + style;

            var newContent = document.createTextNode(textVal);
            newDiv.appendChild(newContent);
            document.body.appendChild(newDiv);
        }
        ///////////////////////////////////////////////////////////////////////////////////////////////////////
    }
    catch(err) {
        var errorDiv = document.createElement('pre');
        errorDiv.style.cssText = 'position: fixed;left: 1%;bottom: 1%;padding: 3px;color: black;background-color: indianred;width: 98%;font-size: x-small;opacity: 75%;font-weight: bolder;';
        errorDiv.appendChild(document.createTextNode('LD DEV TOOLS ERROR:\n' + err));
        document.body.appendChild(errorDiv);
    }
})();
