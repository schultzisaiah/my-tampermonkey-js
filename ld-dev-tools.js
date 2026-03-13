// ==UserScript==
// @name        LD Dev Tools
// @version      1.2.8
// @description  try to take over the world!
// @author       Isaiah Schultz & Gemini
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
// @match        https://answers-local.superlawyers-dev.com/*
// @match        https://answers.superlawyers-dev.com/*
// @match        https://answers.superlawyers-qa.com/*
// @match        https://answers.superlawyers-stage.com/*
// @match        https://answers.superlawyers.com/*
// @match        https://my-local.superlawyers-dev.com/*
// @match        https://my.superlawyers-dev.com/*
// @match        https://my.superlawyers-qa.com/*
// @match        https://my.superlawyers-stage.com/*
// @match        https://my.superlawyers.com/*
// @match        https://attorneys-local.superlawyers-dev.com/*
// @match        https://attorneys.superlawyers-dev.com/*
// @match        https://attorneys.superlawyers-qa.com/*
// @match        https://attorneys.superlawyers-stage.com/*
// @match        https://attorneys.superlawyers.com/*
// @match        https://profiles-local.superlawyers-dev.com/*
// @match        https://profiles.superlawyers-dev.com/*
// @match        https://profiles.superlawyers-qa.com/*
// @match        https://profiles.superlawyers-stage.com/*
// @match        https://profiles.superlawyers.com/*
// @match        https://www-local.superlawyers-dev.com/*
// @match        https://www.superlawyers-dev.com/*
// @match        https://www.superlawyers-qa.com/*
// @match        https://www.superlawyers-stage.com/*
// @match        https://www.superlawyers.com/*
// @match        https://attorneys-local.lawinfo-dev.com/*
// @match        https://profiles-local.lawinfo-dev.com/*
// @match        https://www-local.lawinfo-dev.com/*
// @match        https://www.lawinfo-dev.com/*
// @match        https://www.lawinfo-qa.com/*
// @match        https://www.lawinfo-stage.com/*
// @match        https://www.lawinfo.com/*
// @match        https://attorneys-local.abogado-dev.com/*
// @match        https://profiles-local.abogado-dev.com/*
// @match        https://www-local.abogado-dev.com/*
// @match        https://www.abogado-dev.com/*
// @match        https://www.abogado-qa.com/*
// @match        https://www.abogado-stage.com/*
// @match        https://www.abogado.com/*
// @match        http://localhost:8080/*
// @grant        GM_xmlhttpRequest
// @noframes
// ==/UserScript==

(function () {
  'use strict';
  if (typeof dataLayer !== 'undefined' && dataLayer.ldDevTools === 'disable') {
    return;
  }
  try {
    // Check for FLDataLayer existence before proceeding
    if (typeof FLDataLayer === 'undefined') {
      var msg = document.createElement('div');
      msg.textContent = 'No FLDataLayer found';
      msg.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(0, 0, 0, 0.6);
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        z-index: 10000;
        pointer-events: none;
        transition: opacity 1s ease-out;
        font-family: sans-serif;
        font-size: 12px;
        opacity: 1;
      `;
      document.body.appendChild(msg);

      // Fade out and remove
      setTimeout(function() {
        msg.style.opacity = '0';
        setTimeout(function() {
            if (msg.parentNode) msg.parentNode.removeChild(msg);
        }, 1000);
      }, 3000);

      return; // Stop script execution
    }

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

    switch (environment) {
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

    const styledBuildTxt = buildNumTxt.replace(environment,
        `<b>${environment}</b>`);

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
            padding: 8px 12px 8px 0px;
            color: ${textColor};
            font-size: x-small;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
            margin: 0;
            user-select: text;
        `;
    buildNumDiv.innerHTML = styledBuildTxt;
    buildNumContainer.appendChild(buildNumDiv);
    document.body.appendChild(buildNumContainer);

    // Shared button stack — sits directly below the build number container
    var buttonStack = document.createElement('div');
    buttonStack.id = 'ld-button-stack';
    buttonStack.style.cssText = `
            position: fixed;
            left: ${initialBuildNumLeft};
            top: ${initialBuildNumTop};
            z-index: 9998;
            display: flex;
            flex-direction: column;
            gap: 6px;
            align-items: flex-start;
        `;
    document.body.appendChild(buttonStack);

    // Keep the stack snapped below the build number container
    function syncButtonStack() {
      var rect = buildNumContainer.getBoundingClientRect();
      buttonStack.style.left = rect.left + 'px';
      buttonStack.style.top = (rect.bottom + 6) + 'px';
    }
    // Sync once after layout, then again on resize
    requestAnimationFrame(syncButtonStack);
    window.addEventListener('resize', syncButtonStack);

    // Add drag and drop functionality for Build Number
    let isDraggingBuildNum = false;
    let offsetBuildNum = {x: 0, y: 0};

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

        // Keep button stack snapped below the build number
        syncButtonStack();
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
      syncButtonStack();
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

    var dataLayerText = 'FLDataLayer = ' + JSON.stringify(FLDataLayer, null, 1)
        + ';';
    if (typeof FL !== 'undefined') {
      dataLayerText += '\nFL = ' + JSON.stringify(FL, null, 1) + ';';
    }
    if (typeof FLDataLayer.workers_data === 'undefined') {
      if (typeof document.getElementById('workers_data') !== 'undefined') {
        var workersDataValue = 'NOT ON PAGE';
        try {
          var workersData = document.getElementById(
              'workers_data').textContent.replace(/\n/g, '').replace(/\"/g,
              '"').replace("flan:", "\"flan\":").trim();
          workersDataValue = JSON.stringify(JSON.parse(workersData), null, 1)
              + ';';
        } catch (err) {
          workersDataValue = 'ERROR: ' + err;
        }
        dataLayerText += '\nworkers_data = ' + workersDataValue;
      }
    } else {
      dataLayerText += '\nworkers_data = (in FLDataLayer)';
    }
    if (typeof FlagsFLFE !== 'undefined') {
      dataLayerText += '\nFlagsFLFE = ' + JSON.stringify(FlagsFLFE, null, 1)
          + ';';
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
    const initialDataLayerRight = '1%';
    const initialDataLayerTop = '0.6%';
    dataLayerContainer.style.cssText = `
            position: fixed;
            right: ${initialDataLayerRight};
            top: ${initialDataLayerTop};
            z-index: 10000;
            display: flex;
            flex-direction: column;
            width: 225px;
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
            font-size: 0.8rem;
            font-weight: bold;
            color: black;
        `;

    var headerTitle = document.createElement('span');
    headerTitle.textContent = 'DataLayer';
    header.appendChild(headerTitle);

    // Container for buttons
    var buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'display: flex; align-items: center;';
    header.appendChild(buttonContainer);

    // NEW API Button
    var apiBtn = document.createElement('button');
    apiBtn.textContent = 'API';
    apiBtn.style.cssText = `
            background: rgba(0, 0, 0, 0.08); /* Light bg */
            border: 1px solid rgba(0, 0, 0, 0.15); /* Subtle border */
            border-radius: 4px; /* Rounded corners */
            color: black;
            font-size: 0.75rem; /* Slightly smaller */
            font-weight: bold;
            line-height: 1;
            cursor: pointer;
            padding: 3px 6px; /* Adjusted padding */
            margin-right: 6px; /* Space it from minimize btn */
            transition: background-color 0.2s;
        `;
    apiBtn.title = 'Open model/json endpoint'; // Add a tooltip

    // Add hover effect
    apiBtn.addEventListener('mouseenter', () => {
      apiBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.15)';
    });
    apiBtn.addEventListener('mouseleave', () => {
      apiBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.08)';
    });

    apiBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent drag from starting

      // Check for and remove existing widget
      const existingWidget = document.getElementById('api-model-widget');
      if (existingWidget) {
        existingWidget.remove();
      }

      const apiBtnRef = apiBtn;
      apiBtnRef.textContent = '...'; // Loading state

      const v2Url = window.location.origin + '/frontend/v2/model'
          + window.location.pathname;
      const v1Url = window.location.origin + '/frontend/v1/model'
          + window.location.pathname;

      // Define v1 fetch function (fallback)
      function fetchV1() {
        GM_xmlhttpRequest({
          method: "GET",
          url: v1Url,
          onload: function (response) {
            apiBtnRef.textContent = 'API'; // Restore button text
            let content = '';
            let title = 'API Model (v1)';

            if ((response.status >= 200 && response.status < 300) || response.status === 410) {
              try {
                const jsonData = JSON.parse(response.responseText);
                content = JSON.stringify(jsonData, null, 2); // Pretty print
              } catch (err) {
                title = 'API Model (v1 Parse Error)';
                content = 'Error parsing JSON:\n' + err + '\n\n'
                    + response.responseText;
              }
            } else {
              // Both v2 and v1 failed
              title = 'API Model (All Failed)';
              content = `v2 request failed (see console).\n\nv1 request failed with status: ${response.status}\n\n${response.responseText}`;
            }
            createDraggableWidget('api-model-widget', title, content, '25%',
                '5%', 350, v1Url);
          },
          onerror: function (error) {
            // Both v2 and v1 failed
            apiBtnRef.textContent = 'API'; // Restore button text
            const errorContent = 'v2 request failed (see console).\n\nv1 Fetch Error:\n'
                + JSON.stringify(error, null, 2);
            createDraggableWidget('api-model-widget', 'API Model (All Failed)',
                errorContent, '25%', '5%', 350);
          }
        });
      }

      // Try v2 first
      GM_xmlhttpRequest({
        method: "GET",
        url: v2Url,
        onload: function (response) {
          if ((response.status >= 200 && response.status < 300) || response.status === 410) {
            apiBtnRef.textContent = 'API'; // Restore button text
            let content = '';
            let title = 'API Model';
            try {
              const jsonData = JSON.parse(response.responseText);
              content = JSON.stringify(jsonData, null, 2); // Pretty print
            } catch (err) {
              title = 'API Model (v2 Parse Error)';
              content = 'Error parsing JSON:\n' + err + '\n\n'
                  + response.responseText;
            }
            createDraggableWidget('api-model-widget', title, content, '25%',
                '5%', 350, v2Url);
          } else {
            // v2 failed, try v1
            console.log(
                `LD Dev Tools: v2 model failed (status: ${response.status}), trying v1...`);
            fetchV1();
          }
        },
        onerror: function (error) {
          // v2 failed, try v1
          console.log(`LD Dev Tools: v2 model fetch error: ${JSON.stringify(
              error)}, trying v1...`);
          fetchV1();
        }
      });
    });
    buttonContainer.appendChild(apiBtn);

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
    buttonContainer.appendChild(minimizeBtn);
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
      header.style.cursor = 'grabbing';
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

        dataLayerContainer.style.right = ''; // Remove right positioning when dragging
        dataLayerContainer.style.left = newX + 'px';
        dataLayerContainer.style.top = newY + 'px';
      }
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
      document.body.style.userSelect = 'auto'; // Re-enable text selection
      header.style.cursor = 'grab';
    });

    // Add minimize/maximize functionality
    let isMinimized = false;
    minimizeBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent drag from starting
      if (isMinimized) {
        // Maximize
        minimizeBtn.textContent = '–';
        dataLayerContent.style.display = 'block';
        dataLayerContainer.style.height = 'auto'; // Let height be determined by content again
      } else {
        // Minimize
        minimizeBtn.textContent = '+';
        dataLayerContent.style.display = 'none';
        dataLayerContainer.style.height = '48px'; // A fixed height for the header
      }
      isMinimized = !isMinimized;
    });

    // Add double-click to reset position functionality
    header.addEventListener('dblclick', () => {
      dataLayerContainer.style.left = '';
      dataLayerContainer.style.right = initialDataLayerRight;
      dataLayerContainer.style.top = initialDataLayerTop;
    });

    ///////////////////////////////////////////////////////////////////////////////////////////////////////

    // Draggable Widget Creator ///////////////////////////////////////////////////////////////////////////
    function createDraggableWidget(id, title, content, initialLeft, initialTop,
        width = 300, urlToOpen = null) {
      // Main container
      var widgetContainer = document.createElement('div');
      widgetContainer.id = id;
      widgetContainer.style.cssText = `
                position: fixed;
                left: ${initialLeft};
                top: ${initialTop};
                z-index: 10001; /* On top of other widgets */
                display: flex;
                flex-direction: column;
                width: ${width}px;
                max-height: 90%;
                font-family: monospace;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                backdrop-filter: blur(8px);
                background-color: rgba(245, 245, 245, 0.6); /* Light bg */
            `;

      // Header
      var header = document.createElement('div');
      header.style.cssText = `
                background-color: rgba(120, 120, 120, 0.6); /* Neutral header */
                padding: 8px 12px;
                cursor: grab;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-radius: 8px 8px 0 0;
                font-size: 0.8rem;
                font-weight: bold;
                color: black;
            `;

      var headerTitle = document.createElement('span');
      headerTitle.textContent = title;
      header.appendChild(headerTitle);

      // Button container
      var buttonContainer = document.createElement('div');
      buttonContainer.style.cssText = 'display: flex; align-items: center;';
      header.appendChild(buttonContainer);

      // Open URL button
      if (urlToOpen) {
        var openUrlBtn = document.createElement('button');
        openUrlBtn.textContent = '⇱';
        openUrlBtn.title = 'Open URL in new tab';
        openUrlBtn.style.cssText = `
                    background: none;
                    border: none;
                    color: black;
                    font-size: 1.2rem;
                    line-height: 1;
                    cursor: pointer;
                    padding: 4px;
                    margin-right: 16px;
                `;
        openUrlBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          window.open(urlToOpen, '_blank');
        });
        buttonContainer.appendChild(openUrlBtn);
      }

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
      buttonContainer.appendChild(minimizeBtn);

      // Close button
      var closeBtn = document.createElement('button');
      closeBtn.textContent = '×';
      closeBtn.style.cssText = `
                background: none;
                border: none;
                color: black;
                font-size: 1.5rem; /* Match minimize */
                line-height: 1;
                cursor: pointer;
                padding: 4px;
                margin-left: 4px;
            `;
      buttonContainer.appendChild(closeBtn);
      widgetContainer.appendChild(header);

      // Content area
      var widgetContent = document.createElement('pre');
      widgetContent.style.cssText = `
                flex-grow: 1;
                margin: 0;
                padding: 12px;
                background-color: rgba(255, 255, 255, 0.6); /* Lighter content bg */
                font-size: x-small;
                overflow: auto;
                line-height: normal;
                user-select: text;
                word-wrap: normal;
                white-space: pre;
                color: black;
                border-radius: 0 0 8px 8px;
            `;
      widgetContent.textContent = content;
      widgetContainer.appendChild(widgetContent);
      document.body.appendChild(widgetContainer);

      // Drag and drop
      let isDragging = false;
      let offset = {x: 0, y: 0};

      header.addEventListener('mousedown', (e) => {
        isDragging = true;
        offset = {
          x: e.clientX - widgetContainer.offsetLeft,
          y: e.clientY - widgetContainer.offsetTop
        };
        document.body.style.userSelect = 'none';
        header.style.cursor = 'grabbing';
        e.preventDefault();
      });

      document.addEventListener('mousemove', (e) => {
        if (isDragging) {
          let newX = e.clientX - offset.x;
          let newY = e.clientY - offset.y;
          const maxX = window.innerWidth - widgetContainer.offsetWidth;
          const maxY = window.innerHeight - header.offsetHeight;
          newX = Math.max(0, Math.min(newX, maxX));
          newY = Math.max(0, Math.min(newY, maxY));
          widgetContainer.style.right = '';
          widgetContainer.style.left = newX + 'px';
          widgetContainer.style.top = newY + 'px';
        }
      });

      document.addEventListener('mouseup', () => {
        isDragging = false;
        document.body.style.userSelect = 'auto';
        header.style.cursor = 'grab';
      });

      // Minimize/maximize
      let isMinimized = false;
      minimizeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isMinimized) {
          minimizeBtn.textContent = '–';
          widgetContent.style.display = 'block';
          widgetContainer.style.height = 'auto';
        } else {
          minimizeBtn.textContent = '+';
          widgetContent.style.display = 'none';
          widgetContainer.style.height = '48px'; // Adjust to header height
        }
        isMinimized = !isMinimized;
      });

      // Close
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        widgetContainer.remove();
      });
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////

    // SRP CACHE WOKER? ///////////////////////////////////////////////////////////////////////////////////
    var srpDiv = document.getElementById('serp_results');
    if (srpDiv !== 'undefined' && srpDiv !== null && srpDiv.innerHTML !== null
        && String(srpDiv.innerHTML).includes('small-order-')) {
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
      cfCacheWorkerTag.appendChild(
          document.createTextNode('CF SRP cache worker ran!'));
      document.body.appendChild(cfCacheWorkerTag);
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////

    // LNA/FLAN Ad Revealer //////////////////////////////////////////////////////////////////////////////////
    function initLnaAdRevealer() {
      if (document.getElementById('reveal-lna-btn')) {
        return true; // Already initialized
      }

      const flanAds = document.querySelectorAll('[data-product-code="flan"]');

      if (flanAds.length > 0) {
        // 1. Create a style element for the highlight effect
        const style = document.createElement('style');
        style.textContent = `
                    .lna-ad-highlight {
                        box-shadow: 0 0 12px 4px rgba(255, 223, 0, 0.85) !important;
                        border: 2px solid #FFBF00 !important;
                        transition: box-shadow 0.3s ease-in-out, border 0.3s ease-in-out;
                    }
                `;
        document.head.appendChild(style);

        // 2. Create the reveal button
        const revealButton = document.createElement('button');
        revealButton.id = 'reveal-lna-btn';
        revealButton.textContent = '◻️　Reveal LNA';

        revealButton.style.cssText = `
                    padding: 6px 12px;
                    background-color: rgba(0, 93, 162, 0.7); /* Blue */
                    color: white;
                    border: 1px solid rgba(255, 255, 255, 0.5);
                    border-radius: 6px;
                    cursor: pointer;
                    font-family: sans-serif;
                    font-size: x-small;
                    font-weight: bold;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                    backdrop-filter: blur(8px);
                    transition: background-color 0.2s;
                `;

        var stackContainer = document.getElementById('ld-button-stack');
        if (stackContainer) {
          stackContainer.appendChild(revealButton);
        } else {
          revealButton.style.cssText += 'position:fixed;left:5%;top:1%;';
          document.body.appendChild(revealButton);
        }

        // 3. Add toggle functionality to the button
        let isRevealed = false;
        revealButton.addEventListener('click', () => {
          isRevealed = !isRevealed; // Toggle the state

          // Re-query ads on each click to handle dynamic content
          document.querySelectorAll('[data-product-code="flan"]').forEach(
              ad => {
                ad.classList.toggle('lna-ad-highlight', isRevealed);
              });

          if (isRevealed) {
            revealButton.textContent = '✅　Reveal LNA';
            revealButton.style.backgroundColor = 'rgba(217, 119, 6, 0.7)'; // Orange when active
          } else {
            revealButton.textContent = '◻️　Reveal LNA';
            revealButton.style.backgroundColor = 'rgba(0, 93, 162, 0.7)'; // Back to blue
          }
        });
        return true; // Success
      }
      return false; // Not found
    }

    // Try to initialize immediately. If it fails, observe for changes.
    if (!initLnaAdRevealer()) {
      const observer = new MutationObserver((mutations, obs) => {
        // On any DOM change, try to find the ads again.
        if (initLnaAdRevealer()) {
          obs.disconnect(); // Once found, stop observing.
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      // Fallback to stop observing after 5 seconds.
      setTimeout(() => {
        observer.disconnect();
      }, 5000);
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////

    // Sub ID Revealer /////////////////////////////////////////////////////////////////////////////////
    function initSubIdRevealer() {
      // 1. Check if already initialized
      if (document.getElementById('reveal-sub-id-btn')) {
        return true;
      }

      // 2. Find ads with the data attribute
      const subIdAds = document.querySelectorAll('[data-product-sub-id]');

      if (subIdAds.length > 0) {
        // 3. Create the button
        const revealButton = document.createElement('button');
        revealButton.id = 'reveal-sub-id-btn';
        revealButton.textContent = '◻️　Reveal Sub IDs';

        revealButton.style.cssText = `
                    padding: 6px 12px;
                    background-color: rgba(0, 93, 162, 0.7); /* Blue */
                    color: white;
                    border: 1px solid rgba(255, 255, 255, 0.5);
                    border-radius: 6px;
                    cursor: pointer;
                    font-family: sans-serif;
                    font-size: x-small;
                    font-weight: bold;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                    backdrop-filter: blur(8px);
                    transition: background-color 0.2s;
                `;

        var stackContainer = document.getElementById('ld-button-stack');
        if (stackContainer) {
          stackContainer.appendChild(revealButton);
        } else {
          revealButton.style.cssText += 'position:fixed;left:5%;top:1%;';
          document.body.appendChild(revealButton);
        }

        // 4. Add click functionality
        let isRevealed = false;
        revealButton.addEventListener('click', () => {
          isRevealed = !isRevealed;

          document.querySelectorAll('[data-product-sub-id]').forEach(ad => {
            if (isRevealed) {
              // Prevent adding duplicate displays
              if (ad.querySelector('.sub-id-display')) {
                return;
              }

              const originalPosition = window.getComputedStyle(ad).position;
              if (originalPosition === 'static') {
                ad.style.position = 'relative';
                // Store original position to revert later
                ad.dataset.originalPosition = 'static';
              }

              const subId = ad.dataset.productSubId;
              const displayElement = document.createElement('div');
              displayElement.className = 'sub-id-display';
              displayElement.textContent = subId;
              displayElement.style.cssText = `
                                position: absolute;
                                top: 2px;
                                right: 2px;
                                background-color: rgba(250, 204, 21, 0.9); /* Yellow */
                                color: black;
                                padding: 2px 5px;
                                font-family: monospace;
                                font-size: 11px;
                                font-weight: bold;
                                border-radius: 4px;
                                z-index: 1000;
                                user-select: all;
                                line-height: 1.2;
                            `;
              ad.appendChild(displayElement);
            } else {
              // Remove the sub-id display
              const displayElement = ad.querySelector('.sub-id-display');
              if (displayElement) {
                displayElement.remove();
              }
              // Revert position if we changed it
              if (ad.dataset.originalPosition === 'static') {
                ad.style.position = 'static';
                delete ad.dataset.originalPosition;
              }
            }
          });

          // Update button state
          if (isRevealed) {
            revealButton.textContent = '✅　Reveal Sub IDs';
            revealButton.style.backgroundColor = 'rgba(217, 119, 6, 0.7)'; // Orange when active
          } else {
            revealButton.textContent = '◻️　Reveal Sub IDs';
            revealButton.style.backgroundColor = 'rgba(0, 93, 162, 0.7)'; // Back to blue
          }
        });
        return true; // Success
      }
      return false; // Not found
    }

    // Try to initialize immediately. If it fails, observe for changes.
    if (!initSubIdRevealer()) {
      const observer = new MutationObserver((mutations, obs) => {
        if (initSubIdRevealer()) {
          obs.disconnect(); // Once found, stop observing.
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      // Fallback to stop observing after 5 seconds.
      setTimeout(() => {
        observer.disconnect();
      }, 5000);
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////

    // Auth Pref Revealer /////////////////////////////////////////////////////////////////////////////////
    function initAuthPrefRevealer() {
      // 1. Check if already initialized
      if (document.getElementById('reveal-auth-pref-btn')) {
        return true;
      }

      // 2. Extract flappl- profile IDs from FLDataLayer
      var productProfileID;
      try {
        productProfileID = FLDataLayer.search.productProfileID;
      } catch (e) {
        return false;
      }
      if (!productProfileID) {
        return false;
      }

      var authPrefIds = [];
      productProfileID.split(',').forEach(function(id) {
        id = id.trim();
        if (id.indexOf('flappl-') === 0) {
          var numericId = id.replace('flappl-', '');
          if (numericId) {
            authPrefIds.push(numericId);
          }
        }
      });

      if (authPrefIds.length === 0) {
        return false;
      }

      // 3. Find the matching result cards (the closest li/article ancestor containing a [name*="cid:ID/"] element)
      var authPrefCards = [];
      authPrefIds.forEach(function(cid) {
        var selector = '[name*="cid:' + cid + '/"], [name*="cid:' + cid + '"]';
        var matchingEls = document.querySelectorAll(selector);
        matchingEls.forEach(function(el) {
          // Walk up to find the card container (li or article with serp-card class)
          var card = el.closest('li, article');
          if (card && authPrefCards.indexOf(card) === -1) {
            authPrefCards.push(card);
          }
        });
      });

      if (authPrefCards.length === 0) {
        return false;
      }

      // 4. Create highlight style
      var style = document.createElement('style');
      style.textContent = `
                .auth-pref-highlight {
                    box-shadow: 0 0 12px 4px rgba(168, 85, 247, 0.85) !important;
                    border: 2px solid #7c3aed !important;
                    transition: box-shadow 0.3s ease-in-out, border 0.3s ease-in-out;
                }
            `;
      document.head.appendChild(style);

      // 5. Create the button
      var revealButton = document.createElement('button');
      revealButton.id = 'reveal-auth-pref-btn';
      revealButton.textContent = '◻️　Reveal Auth Pref';

      revealButton.style.cssText = `
                padding: 6px 12px;
                background-color: rgba(109, 40, 217, 0.7); /* Purple */
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.5);
                border-radius: 6px;
                cursor: pointer;
                font-family: sans-serif;
                font-size: x-small;
                font-weight: bold;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                backdrop-filter: blur(8px);
                transition: background-color 0.2s;
            `;

      var stackContainer = document.getElementById('ld-button-stack');
      if (stackContainer) {
        stackContainer.appendChild(revealButton);
      } else {
        revealButton.style.cssText += 'position:fixed;left:5%;top:1%;';
        document.body.appendChild(revealButton);
      }

      // 6. Add toggle functionality
      var isRevealed = false;
      revealButton.addEventListener('click', function() {
        isRevealed = !isRevealed;

        // Re-resolve cards on each click in case DOM changed
        var currentCards = [];
        authPrefIds.forEach(function(cid) {
          var selector = '[name*="cid:' + cid + '/"], [name*="cid:' + cid + '"]';
          document.querySelectorAll(selector).forEach(function(el) {
            var card = el.closest('li, article');
            if (card && currentCards.indexOf(card) === -1) {
              currentCards.push(card);
            }
          });
        });

        currentCards.forEach(function(card) {
          card.classList.toggle('auth-pref-highlight', isRevealed);
        });

        if (isRevealed) {
          revealButton.textContent = '✅　Reveal Auth Pref';
          revealButton.style.backgroundColor = 'rgba(217, 119, 6, 0.7)'; // Orange when active
        } else {
          revealButton.textContent = '◻️　Reveal Auth Pref';
          revealButton.style.backgroundColor = 'rgba(109, 40, 217, 0.7)'; // Back to purple
        }
      });

      return true;
    }

    // Try to initialize immediately. If it fails, observe for changes.
    if (!initAuthPrefRevealer()) {
      var authPrefObserver = new MutationObserver(function(mutations, obs) {
        if (initAuthPrefRevealer()) {
          obs.disconnect();
        }
      });

      authPrefObserver.observe(document.body, {
        childList: true,
        subtree: true
      });

      // Fallback to stop observing after 5 seconds.
      setTimeout(function() {
        authPrefObserver.disconnect();
      }, 5000);
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////

    // Auth Foun Revealer /////////////////////////////////////////////////////////////////////////////////
    function initAuthFounRevealer() {
      // 1. Check if already initialized
      if (document.getElementById('reveal-auth-foun-btn')) {
        return true;
      }

      // 2. Extract flafpl- profile IDs from FLDataLayer
      var productProfileID;
      try {
        productProfileID = FLDataLayer.search.productProfileID;
      } catch (e) {
        return false;
      }
      if (!productProfileID) {
        return false;
      }

      var authFounIds = [];
      productProfileID.split(',').forEach(function(id) {
        id = id.trim();
        if (id.indexOf('flafpl-') === 0) {
          var numericId = id.replace('flafpl-', '');
          if (numericId) {
            authFounIds.push(numericId);
          }
        }
      });

      if (authFounIds.length === 0) {
        return false;
      }

      // 3. Find the matching result cards
      var authFounCards = [];
      authFounIds.forEach(function(cid) {
        var selector = '[name*="cid:' + cid + '/"], [name*="cid:' + cid + '"]';
        var matchingEls = document.querySelectorAll(selector);
        matchingEls.forEach(function(el) {
          var card = el.closest('li, article');
          if (card && authFounCards.indexOf(card) === -1) {
            authFounCards.push(card);
          }
        });
      });

      if (authFounCards.length === 0) {
        return false;
      }

      // 4. Create highlight style
      var style = document.createElement('style');
      style.textContent = `
                .auth-foun-highlight {
                    box-shadow: 0 0 12px 4px rgba(20, 184, 166, 0.85) !important;
                    border: 2px solid #0d9488 !important;
                    transition: box-shadow 0.3s ease-in-out, border 0.3s ease-in-out;
                }
            `;
      document.head.appendChild(style);

      // 5. Create the button
      var revealButton = document.createElement('button');
      revealButton.id = 'reveal-auth-foun-btn';
      revealButton.textContent = '◻️　Reveal Auth Foun';

      revealButton.style.cssText = `
                padding: 6px 12px;
                background-color: rgba(13, 148, 136, 0.7); /* Teal */
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.5);
                border-radius: 6px;
                cursor: pointer;
                font-family: sans-serif;
                font-size: x-small;
                font-weight: bold;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                backdrop-filter: blur(8px);
                transition: background-color 0.2s;
            `;

      var stackContainer = document.getElementById('ld-button-stack');
      if (stackContainer) {
        stackContainer.appendChild(revealButton);
      } else {
        revealButton.style.cssText += 'position:fixed;left:5%;top:1%;';
        document.body.appendChild(revealButton);
      }

      // 6. Add toggle functionality
      var isRevealed = false;
      revealButton.addEventListener('click', function() {
        isRevealed = !isRevealed;

        // Re-resolve cards on each click in case DOM changed
        var currentCards = [];
        authFounIds.forEach(function(cid) {
          var selector = '[name*="cid:' + cid + '/"], [name*="cid:' + cid + '"]';
          document.querySelectorAll(selector).forEach(function(el) {
            var card = el.closest('li, article');
            if (card && currentCards.indexOf(card) === -1) {
              currentCards.push(card);
            }
          });
        });

        currentCards.forEach(function(card) {
          card.classList.toggle('auth-foun-highlight', isRevealed);
        });

        if (isRevealed) {
          revealButton.textContent = '✅　Reveal Auth Foun';
          revealButton.style.backgroundColor = 'rgba(217, 119, 6, 0.7)'; // Orange when active
        } else {
          revealButton.textContent = '◻️　Reveal Auth Foun';
          revealButton.style.backgroundColor = 'rgba(13, 148, 136, 0.7)'; // Back to teal
        }
      });

      return true;
    }

    // Try to initialize immediately. If it fails, observe for changes.
    if (!initAuthFounRevealer()) {
      var authFounObserver = new MutationObserver(function(mutations, obs) {
        if (initAuthFounRevealer()) {
          obs.disconnect();
        }
      });

      authFounObserver.observe(document.body, {
        childList: true,
        subtree: true
      });

      // Fallback to stop observing after 5 seconds.
      setTimeout(function() {
        authFounObserver.disconnect();
      }, 5000);
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
    errorDiv.appendChild(
        document.createTextNode('LD DEV TOOLS ERROR:\n' + err));
    document.body.appendChild(errorDiv);
  }
})();
