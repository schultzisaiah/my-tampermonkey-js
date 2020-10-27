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
- If defined, exposes the build identifier for the application serving the page
	- ie: `FLLawyerDirectory-QA_20.11.1.19_9070`
	- expected in the `BuildNumber` variable on the page
	- should match the `instanceName` variable being set by Jenkins on app-start
- Script is executed after the page is loaded, so there may be a short delay before the dev tool elements are displayed on the page

#### Examples
Page served from PVIEW, indicated as such, and FLDataLayer exposed:
![Preview of data shown from PVIEW page](/readme_resources/ld-dev-tools-0.png)

Page served from LD, indicated as such, and FLDataLaywer+toggles exposed:
![Preview of data shown from LD page](/readme_resources/ld-dev-tools-1.png)

### MyTime Helper
[mytime-helper.js](/mytime-helper.js)
1. Installing the script into the Tampermonkey extension
2. Open the "MyTime Helper" script in the Tampermonkey editor (revealing the source code)
3. Modify the "defaults" values to suit your desired auto-fill values
	- I recommend saving these defaults somewhere else for reference. If Tampermonkey auto-updates this script, it may override your customizations.
4. In MyTime, navigate to "Weekly View" tab
5. In the "Show active Projects/tasks that have been used in the last:" dropdown menu, select "SIX MONTHS"
	- this will trigger the helper script to populate the fields
	- if values were already saved for the displayed week, then the script WILL NOT run, and the previous values will be preserved


## Suggest fixes/updates/enhancements
Please do submit pull-requests if you have specific enhancements or fixes that you'd like to exist within this toolset!
