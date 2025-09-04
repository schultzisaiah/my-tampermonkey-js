// ==UserScript==
// @name         LD Dev Tools
// @version      1.0
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

        var buildNumBgColor = 'rgba(255, 255, 255, 0.6)';
        var textColor = 'black';
        var environment = 'unknown';

        const envMatch = buildNumTxt.match(/(local|dev|ci|qa|stage|prod)/i);
        if (envMatch) {
            environment = envMatch[1];
        }

        switch(environment) {
            case 'prod':
                buildNumBgColor = 'rgba(200, 0, 0, 0.65)'; // Red
                textColor = 'white';
                break;
            case 'stage':
                buildNumBgColor = 'rgba(252, 211, 77, 0.6)'; // Amber
                textColor = 'black';
                break;
            case 'qa':
            case 'ci':
            case 'dev':
            case 'local':
                buildNumBgColor = 'rgba(209, 213, 219, 0.6)'; // Gray
                textColor = 'black';
                break;
            default:
                // Keep default styling
                break;
        }

        const styledBuildTxt = buildNumTxt.replace(environment, `<b>${environment}</b>`);

        // Build Number Container
        var buildNumContainer = document.createElement('div');
        buildNumContainer.id = 'draggable-build-num';
        const initialBuildNumLeft = '5%';
        const initialBuildNumTop = '1%';
        buildNumContainer.style.cssText = `
            position: fixed;
            left: ${initialBuildNumLeft};
            top: ${initialBuildNumTop};
            z-index: 9999;
            display: flex;
            align-items: center;
            background-color: ${buildNumBgColor};
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-family: monospace;
            backdrop-filter: blur(8px);
        `;

        // Build Number Drag Handle
        var buildNumDragHandle = document.createElement('div');
        buildNumDragHandle.style.cssText = `
            cursor: grab;
            padding: 8px;
            color: ${textColor};
            font-size: 1.2em;
            transform: translateY(-2px); /* Correct the vertical alignment */
        `;
        buildNumDragHandle.innerHTML = `☰`;
        buildNumContainer.appendChild(buildNumDragHandle);

        // Build Number Text
        var buildNumDiv = document.createElement('pre');
        buildNumDiv.style.cssText = `
            padding: 8px 12px;
            color: ${textColor};
            font-size: x-small;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
            margin: 0;
            user-select: text;
        `;
        buildNumDiv.innerHTML = styledBuildTxt;
        buildNumContainer.appendChild(buildNumDiv);
        document.body.appendChild(buildNumContainer);

        // Add drag and drop functionality for Build Number
        let isDraggingBuildNum = false;
        let offsetBuildNum = { x: 0, y: 0 };

        buildNumDragHandle.addEventListener('mousedown', (e) => {
            isDraggingBuildNum = true;
            offsetBuildNum = {
                x: e.clientX - buildNumContainer.offsetLeft,
                y: e.clientY - buildNumContainer.offsetTop
            };
            document.body.style.userSelect = 'none';
            buildNumDragHandle.style.cursor = 'grabbing';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (isDraggingBuildNum) {
                let newX = e.clientX - offsetBuildNum.x;
                let newY = e.clientY - offsetBuildNum.y;

                const maxX = window.innerWidth - buildNumContainer.offsetWidth;
                const maxY = window.innerHeight - buildNumContainer.offsetHeight;

                newX = Math.max(0, Math.min(newX, maxX));
                newY = Math.max(0, Math.min(newY, maxY));

                buildNumContainer.style.left = newX + 'px';
                buildNumContainer.style.top = newY + 'px';
            }
        });

        document.addEventListener('mouseup', () => {
            isDraggingBuildNum = false;
            document.body.style.userSelect = 'auto';
            buildNumDragHandle.style.cursor = 'grab';
        });

        // Add double-click to reset position for Build Number
        buildNumContainer.addEventListener('dblclick', () => {
            buildNumContainer.style.left = initialBuildNumLeft;
            buildNumContainer.style.top = initialBuildNumTop;
        });

        ///////////////////////////////////////////////////////////////////////////////////////////////////////

        // DATA LAYER DISPLAY://///////////////////////////////////////////////////////////////////////////////
        var headerColor = "#22c55e"; // default green
        var dataLayerBgColor = "#f0fdf4";
        try {
            var hostVal = FL.local.hosts.lawyers
            if (hostVal.includes("localhost")) {
                headerColor = "#eab308"; // yellow
                dataLayerBgColor = "#fffbeb";
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
        
        // Define transparent colors
        var transparentHeaderColor = 'rgba(34, 197, 94, 0.6)';
        var transparentDataLayerBgColor = 'rgba(240, 253, 244, 0.6)';
        if (hostVal && hostVal.includes("localhost")) {
            transparentHeaderColor = 'rgba(234, 179, 8, 0.6)';
            transparentDataLayerBgColor = 'rgba(255, 251, 235, 0.6)';
        }

        // Main container for the data layer display
        var dataLayerContainer = document.createElement('div');
        dataLayerContainer.id = 'draggable-data-layer';
        dataLayerContainer.style.cssText = `
            position: fixed;
            left: 86%;
            top: 0.6%;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            width: 10%;
            max-height: 97%;
            font-family: monospace;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(8px);
        `;

        // Header for the drag handle and minimize button
        var header = document.createElement('div');
        header.style.cssText = `
            background-color: ${transparentHeaderColor};
            padding: 8px 12px;
            cursor: grab;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-radius: 8px 8px 0 0;
            font-size: 1.2rem;
            font-weight: bold;
            color: black;
        `;
        header.innerHTML = 'Data Layer';

        // Minimize button
        var minimizeBtn = document.createElement('button');
        minimizeBtn.textContent = '–';
        minimizeBtn.style.cssText = `
            background: none;
            border: none;
            color: black;
            font-size: 1.5rem;
            line-height: 1;
            cursor: pointer;
            padding: 4px;
            transition: transform 0.2s ease-in-out;
        `;
        header.appendChild(minimizeBtn);
        dataLayerContainer.appendChild(header);

        // Content area for the data layer text
        var dataLayerContent = document.createElement('pre');
        dataLayerContent.style.cssText = `
            flex-grow: 1;
            margin: 0;
            padding: 12px;
            background-color: ${transparentDataLayerBgColor};
            font-size: x-small;
            overflow: auto;
            line-height: normal;
            user-select: text;
            word-wrap: normal;
            white-space: pre;
            color: black;
            border-radius: 0 0 8px 8px;
        `;
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

        // Add double-click to reset position functionality
        header.addEventListener('dblclick', () => {
            dataLayerContainer.style.left = '86%';
            dataLayerContainer.style.top = '0.6%';
        });

        ///////////////////////////////////////////////////////////////////////////////////////////////////////

        // SRP CACHE WOKER? ///////////////////////////////////////////////////////////////////////////////////
        var srpDiv = document.getElementById('serp_results');
        if (srpDiv !== 'undefined' && srpDiv !== null && srpDiv.innerHTML !== null && String(srpDiv.innerHTML).includes('small-order-')) {
            var cfCacheWorkerTag = document.createElement('div');
            cfCacheWorkerTag.style.cssText = `
                position: fixed;
                left: 5%;
                top: 6%;
                padding: 8px 12px;
                color: black;
                font-size: x-small;
                background-color: rgba(253, 186, 116, 0.6);
                z-index: 9999;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                backdrop-filter: blur(8px);
            `;
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
        errorDiv.style.cssText = `
            position: fixed;
            left: 1%;
            bottom: 1%;
            padding: 12px;
            color: black;
            background-color: rgba(252, 165, 165, 0.6);
            width: 98%;
            font-size: small;
            font-weight: bolder;
            z-index: 10001;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            backdrop-filter: blur(8px);
        `;
        errorDiv.appendChild(document.createTextNode('LD DEV TOOLS ERROR:\n' + err));
        document.body.appendChild(errorDiv);
    }
})();
