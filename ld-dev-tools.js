// ==UserScript==
// @name         LD Dev Tools
// @version      0.28
// @description  try to take over the world!
// @author       Isaiah Schultz
// @run-at       document-idle
// @match        https://lawyers.findlaw.com/*
// @match        https://lawyers-a.findlaw.com/*
// @match        https://lawyers-b.findlaw.com/*
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
// @match        https://www.superlawyers.com/*
// @match        https://attorneys.superlawyers.com/*
// @match        https://profiles.superlawyers.com/*
// @match        https://www.abogado-stage.com/*
// @match        https://www.abogado-qa.com/*
// @match        https://www.superlawyers-qa.com/*
// @match        https://www.superlawyers-stage.com/*
// @match        https://attorneys.superlawyers-qa.com/*
// @match        https://profiles.superlawyers-qa.com/*
// @match        https://profiles.superlawyers-stage.com/*
// @match        https://attorneys.superlawyers-stage.com/*
// @match        http://localhost:8080/*
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
        if (typeof FLDataLayer.workers_data === 'undefined') {
            if (typeof document.getElementById('workers_data') !== 'undefined') {
                var workersDataValue = 'NOT ON PAGE';
                try {
                    var workersData = document.getElementById('workers_data').textContent.replace(/\n/g, '').replace(/\"/g, '"').replace("flan:", "\"flan\":").trim();
                    workersDataValue = JSON.stringify(JSON.parse(workersData),null,1) + ';'
                } catch(err) {
                    workersDataValue = 'ERROR: ' + err;
                }
                dataLayerText += '\nworkers_data = ' + workersDataValue;
            }
        } else {
            dataLayerText += '\nworkers_data = (in FLDataLayer)';
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

        // Shortcut to searchAPI=true /////////////////////////////////////////////////////////////////////////
        if (String(document.location).includes('/search/') || String(document.location).includes('/lawyer/firm/') || String(document.location).includes('/profile/')) {
            var textVal = '';
            var hrefVal = '';
            var style = '';
            var newParam = '';
            if (FLDataLayer.searchAPI) {
                hrefVal = String(document.location).replace('searchAPI=true', '');
                if (String(document.location).includes('?')) {
                    newParam = "&searchAPI=false";
                } else {
                    newParam = "?searchAPI=false";
                }
                textVal = '[-] Remove searchAPI=true';
                style = "background-color: lightgreen;"
            } else {
                if (String(document.location).includes('?')) {
                    newParam = "&searchAPI=true";
                } else {
                    newParam = "?searchAPI=true";
                }
                hrefVal = String(document.location).replace('searchAPI=false', '');
                textVal = '[+] Add searchAPI=true';
                style = "background-color: lightblue;"
            }
            hrefVal = hrefVal.replace('lawyers.findlaw.com', 'lawyers-a.findlaw.com');
            hrefVal = hrefVal + newParam;
            var newLink = document.createElement('a');

            newLink.style.cssText = 'position: fixed;left: 47%;top: 1%;padding: 3px;color: black;font-weight: bolder;' + style;

            var newContent = document.createTextNode(textVal);
            newLink.appendChild(newContent);
            newLink.href = hrefVal;
            newLink.target = '_blank';
            document.body.appendChild(newLink);
        }
        ///////////////////////////////////////////////////////////////////////////////////////////////////////

        // Shortcut to searchAPI=true /////////////////////////////////////////////////////////////////////////
        document.getElementById('acs-commons-env-indicator').style.visibility = 'hidden';
        ///////////////////////////////////////////////////////////////////////////////////////////////////////
    }
    catch(err) {
        var errorDiv = document.createElement('pre');
        errorDiv.style.cssText = 'position: fixed;left: 1%;bottom: 1%;padding: 3px;color: black;background-color: indianred;width: 98%;font-size: x-small;opacity: 75%;font-weight: bolder;';
        errorDiv.appendChild(document.createTextNode('LD DEV TOOLS ERROR:\n' + err));
        document.body.appendChild(errorDiv);
    }
})();
