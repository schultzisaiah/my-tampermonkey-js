# Custom Tampermonkey Scripts

## Installation
### Tampermonkey
Install the chrome extension: https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo

### Script
1. Open the "Utilties" tab in the Tampermonkey extension config window (can go directly by copying this into the address bar: `chrome-extension://dhdgffkkebhmkfjojejmpbldmpobfkfo/options.html#nav=utils`)
2. In the "Install from URL" box, use the "raw" link to the desired script. ie: https://raw.githubusercontent.com/schultzisaiah/my-tampermonkey-js/main/ld-dev-tools.js
3. Any updates made in this repo should be automatically loaded by the Tampermonkey extension (I think the default refresh setting is once-per-day).

## Usage
### LD Dev Tools
#### ld-dev-tools.js
- Exposes `FLDataLayer` from the page
- If defined, exposes `FlagsFLFE` from the page
	- this is the set of feature toggles active at the time the page was served by the application

Examples:

![Preview of data shown from PVIEW page](/readme_resources/ld-dev-tools-0.png)

![Preview of data shown from LD page](/readme_resources/ld-dev-tools-1.png)