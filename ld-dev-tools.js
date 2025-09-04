// ==UserScript==
// @name         LD Dev Tools
// @version      0.41
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
// @match        https://lawyers.findlaw-dev.com/*
// @match        https://lawyers.findlaw-qa.com/*
// @match        https://lawyersorigin.findlaw-qa.com/*
// @match        https://www.lawinfo.com/*
// @match        https://www.lawinfo-stage.com/*
// @match        https://www.lawinfo-qa.com/*
// @match        https://www.lawinfo-qa.com/*
// @match        https://www.lawinfo-dev.com/*
// @match        https://www.flportaldev.int.thomsonreuters.com/*
// @match        https://www.flportalqa.int.thomsonreuters.com/*
// @match        https://www.flportalstage.int.thomsonreuters.com/*
// @match        https://www.findlaw-stage.com/*
// @match        https://findlaw.com/*
// @match        https://www.findlaw.com/*
// @match        https://www.findlaw-dev.com/*
// @match        https://www.findlaw-qa.com/*
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
    if (typeof dataLayer !== 'undefined' && dataLayer.ldDevTools === 'disable') {
        return;
    }
    try {
        // Build Number:///////////////////////////////////////////////////////////////////////////////////////
        var buildNumTxt = 'Build: unknown';
        if (typeof BuildNumber !== 'undefined') {
            buildNumTxt = BuildNumber;
        }
        var buildNumDiv = document.createElement('pre');
        buildNumDiv.style.cssText = 'position: fixed; left: 5%; top: 1%; padding: 8px 12px; color: black; font-size: x-small; background-color: rgba(255, 255, 255, 0.9); z-index: 9999; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);';
        buildNumDiv.appendChild(document.createTextNode(buildNumTxt));
        document.body.appendChild(buildNumDiv);
        ///////////////////////////////////////////////////////////////////////////////////////////////////////

        // DATA LAYER DISPLAY://///////////////////////////////////////////////////////////////////////////////
        var headerColor = "#22c55e"; // default green
        var backgroundColor = "#f0fdf4";
        try {
            var hostVal = FL.local.hosts.lawyers
            if (hostVal.includes("localhost")) {
                headerColor = "#eab308"; // yellow
                backgroundColor = "#fffbeb";
            }
        } catch (err) {
            // oh well
        }

        var dataLayerText = 'FLDataLayer = ' + JSON.stringify(FLDataLayer, null, 1) + ';';
        if (typeof FL !== 'undefined') {
            dataLayerText += '\nFL = ' + JSON.stringify(FL, null, 1) + ';';
        }
        if (typeof FLDataLayer.workers_data === 'undefined') {
            if (typeof document.getElementById('workers_data') !== 'undefined') {
                var workersDataValue = 'NOT ON PAGE';
                try {
                    var workersData = document.getElementById('workers_data').textContent.replace(/\n/g, '').replace(/\"/g, '"').replace("flan:", "\"flan\":").trim();
                    workersDataValue = JSON.stringify(JSON.parse(workersData), null, 1) + ';';
                } catch (err) {
                    workersDataValue = 'ERROR: ' + err;
                }
                dataLayerText += '\nworkers_data = ' + workersDataValue;
            }
        } else {
            dataLayerText += '\nworkers_data = (in FLDataLayer)';
        }
        if (typeof FlagsFLFE !== 'undefined') {
            dataLayerText += '\nFlagsFLFE = ' + JSON.stringify(FlagsFLFE, null, 1) + ';';
        }

        // Main container for the data layer display
        var dataLayerContainer = document.createElement('div');
        dataLayerContainer.id = 'draggable-data-layer';
        dataLayerContainer.style.cssText = 'position: fixed; left: 86%; top: 0.6%; z-index: 10000; display: flex; flex-direction: column; width: 10%; max-height: 97%; opacity: 1; font-family: monospace; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);';

        // Header for the drag handle and minimize button
        var header = document.createElement('div');
        header.style.cssText = 'background-color: ' + headerColor + '; padding: 8px 12px; cursor: move; display: flex; justify-content: space-between; align-items: center; border-radius: 8px 8px 0 0; font-size: 1.2rem; font-weight: bold; color: black;';
        header.innerHTML = 'Data Layer';

        // Minimize button
        var minimizeBtn = document.createElement('button');
        minimizeBtn.textContent = '–';
        minimizeBtn.style.cssText = 'background: none; border: none; color: black; font-size: 1.5rem; line-height: 1; cursor: pointer; padding: 4px; transition: transform 0.2s ease-in-out;';
        header.appendChild(minimizeBtn);
        dataLayerContainer.appendChild(header);

        // Content area for the data layer text
        var dataLayerContent = document.createElement('pre');
        dataLayerContent.style.cssText = 'flex-grow: 1; margin: 0; padding: 12px; background-color: ' + backgroundColor + '; font-size: x-small; overflow: auto; line-height: normal; user-select: text; word-wrap: normal; white-space: pre; color: black; border-radius: 0 0 8px 8px;';
        dataLayerContent.textContent = dataLayerText;
        dataLayerContainer.appendChild(dataLayerContent);
        document.body.appendChild(dataLayerContainer);

        // Add drag and drop functionality
        let isDragging = false;
        let offset = {
            x: 0,
            y: 0
        };

        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            offset = {
                x: e.clientX - dataLayerContainer.offsetLeft,
                y: e.clientY - dataLayerContainer.offsetTop
            };
            document.body.style.userSelect = 'none'; // Prevents text selection during drag
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                let newX = e.clientX - offset.x;
                let newY = e.clientY - offset.y;

                // Restrict movement to within the viewport
                const maxX = window.innerWidth - dataLayerContainer.offsetWidth;
                const maxY = window.innerHeight - header.offsetHeight; // Keep the header on-screen vertically

                newX = Math.max(0, Math.min(newX, maxX));
                newY = Math.max(0, Math.min(newY, maxY));

                dataLayerContainer.style.left = newX + 'px';
                dataLayerContainer.style.top = newY + 'px';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            document.body.style.userSelect = 'auto'; // Re-enable text selection
        });

        // Add minimize/maximize functionality
        let isMinimized = false;
        minimizeBtn.addEventListener('click', () => {
            if (isMinimized) {
                // Maximize
                minimizeBtn.textContent = '–';
                dataLayerContent.style.display = 'block';
                dataLayerContainer.style.height = 'auto'; // Let height be determined by content again
            } else {
                // Minimize
                minimizeBtn.textContent = '☐';
                dataLayerContent.style.display = 'none';
                dataLayerContainer.style.height = '48px'; // A fixed height for the header
            }
            isMinimized = !isMinimized;
        });

        ///////////////////////////////////////////////////////////////////////////////////////////////////////

        // SRP CACHE WOKER? ///////////////////////////////////////////////////////////////////////////////////
        var srpDiv = document.getElementById('serp_results');
        if (srpDiv !== 'undefined' && srpDiv !== null && srpDiv.innerHTML !== null && String(srpDiv.innerHTML).includes('small-order-')) {
            var cfCacheWorkerTag = document.createElement('div');
            cfCacheWorkerTag.style.cssText = 'position: fixed; left: 5%; top: 6%; padding: 8px 12px; color: black; font-size: x-small; background-color: #fdba74; z-index: 9999; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);';
            cfCacheWorkerTag.appendChild(document.createTextNode('CF SRP cache worker ran!'));
            document.body.appendChild(cfCacheWorkerTag);
        }
        ///////////////////////////////////////////////////////////////////////////////////////////////////////

        // Shortcut to disable env indicator //////////////////////////////////////////////////////////////////
        var envInd = document.getElementById('acs-commons-env-indicator');
        if (envInd !== 'undefined' && envInd !== null) {
            envInd.style.visibility = 'hidden';
        }
        ///////////////////////////////////////////////////////////////////////////////////////////////////////
    } catch (err) {
        var errorDiv = document.createElement('pre');
        errorDiv.style.cssText = 'position: fixed; left: 1%; bottom: 1%; padding: 12px; color: black; background-color: #fca5a5; width: 98%; font-size: small; font-weight: bolder; z-index: 10001; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);';
        errorDiv.appendChild(document.createTextNode('LD DEV TOOLS ERROR:\n' + err));
        document.body.appendChild(errorDiv);
    }
})();
