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
[ld-dev-tools.js](/ld-dev-tools.js)
- Exposes `FLDataLayer` from the page
- If defined, exposes `FlagsFLFE` from the page
	- this is the set of feature toggles active at the time the page was served by the application
- If a profile page (ie: URI matching `/profile/*`), then indicate whether LD or PVIEW is serving the page
	- this value is based on the `ldprofile` _response header_ value
		- if `ldprofile: true`, then `LD`
		- otherwise `PVEIW`
- Script is executed after the page is loaded, so there may be a short delay before the dev tool elements are displayed on the page

#### Examples
Page served from PVIEW, indicated as such, and FLDataLayer exposed:
![Preview of data shown from PVIEW page](/readme_resources/ld-dev-tools-0.png)

Page served from LD, indicated as such, and FLDataLaywer+toggles exposed:
![Preview of data shown from LD page](/readme_resources/ld-dev-tools-1.png)

## Suggest fixes/updates/enhancements
Please do submit pull-requests if you have specific enahncements or fixes that you'd like to exist within this toolset!
