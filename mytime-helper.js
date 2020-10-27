// ==UserScript==
// @name         MyTime Helper
// @version      0.1
// @description  try to take over the world!
// @author       Isaiah Schultz
// @run-at       document-idle
// @match        https://mytime.thomsonreuters.com/mytime/WeeklyView.htm
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var abProject = '1060782';
    var flfProject = '1057492';
    var depMeeting = '110001';

    // Update defaults as needed:
    var defaults = [
        //[projId,   capitalExpenseType,                 monHrs, tueHrs, wedHrs, thuHrs, friHrs]
        [abProject,  '1 - Delivery',                     4,      4,      4,      4,      4],
        [abProject,  '2 - Business Strategy/Operations', 1,      0,      1,      0,      1],
        [flfProject, '1 - Delivery',                     2,      2,      2,      2,      2],
        [flfProject, '2 - Business Strategy/Operations', 0,      1,      0,      1,      0],
        [depMeeting, 'Department Meeting',               1,      1,      1,      1,      1],
    ];


    // Modify below this line at your own risk!!! /////////////////////////////////////////////////////////////////////////////////////////////
    if (180 == document.getElementById('selNOD').value && 'Project Totals: (0.0)' === document.getElementById('wvWeekTotal').value) {

        var indeces = new Map();

        var keepGoing = true;
        for (var i = 0; indeces.size < defaults.length && i < 50; i++) {
            var proj = document.getElementById('timecards[' + i + '].projectId');
            var projType = document.getElementById('timecards[' + i + '].displayName');

            var found = false;
            for (var j = 0; !found && j < defaults.length; j++) {
                var thisProjId = defaults[j][0];
                var thisProjType = defaults[j][1];
                if (thisProjId == proj.value && thisProjType == projType.value) {
                    indeces.set(thisProjId + thisProjType, i);
                    found = true;
                }
            }
        }

        for (var x = 0; x < defaults.length; x++) {
            var index = indeces.get(defaults[x][0] + defaults[x][1]);
            if (index != null) {
                document.getElementById('timecards[' + index + '].days[2].hours').value = defaults[x][2];
                document.getElementById('timecards[' + index + '].days[3].hours').value = defaults[x][3];
                document.getElementById('timecards[' + index + '].days[4].hours').value = defaults[x][4];
                document.getElementById('timecards[' + index + '].days[5].hours').value = defaults[x][5];
                document.getElementById('timecards[' + index + '].days[6].hours').value = defaults[x][6];
            }
        }
    }
})();
