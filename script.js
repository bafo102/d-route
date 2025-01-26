// CREATE SHORTCUTS BASED ON STORED DATA
createShortcut();
checkAndAddBlanks();
rearrangeGroupIds();
updateHeader();

// UPLOAD DATA
document.getElementById('upload').addEventListener('change', function(event) {
    // only get the first file
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            // read data from excel
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {raw: false, defval: null}); // defval is to get the blank cell value

            // store data
            localStorage.setItem('shortcut_data', JSON.stringify(jsonData));

            // store data time
            now = new Date();
            shortcutDataTime = now.toLocaleString('vi-VN');
            localStorage.setItem('shortcut_data_time', shortcutDataTime);

            // create shortcuts based on data stored
            createShortcut();

            // check and add blank shortcuts
            checkAndAddBlanks();

            // rearrange group ids
            rearrangeGroupIds();

            // update header buttons
            updateHeader();
        };
        reader.readAsArrayBuffer(file); // Read the file as an array buffer

    } else {
        console.log('No file selected');
    }
});

// COPY CODES
document.getElementById('copyBtn').addEventListener('click', () => {
    data_time = localStorage.getItem('shortcut_data_time');
    storedCodes = localStorage.getItem('shortcut_data');
    storedCodesJson = JSON.parse(storedCodes);
    // Use the Clipboard API to copy the text
    navigator.clipboard.writeText(storedCodes);
    alert(`Codes copied: ${storedCodes}`);
});

// CLEAR DATA
document.getElementById('clearBtn').addEventListener('click', () => {
    if (confirm('Clear all data?')) {
        // clear shortcut data
        localStorage.removeItem('shortcut_data');
        // clear shortcut data store time
        localStorage.removeItem('shortcut_data_time');
        // update header buttons
        updateHeader();
        // restore default html
        mainDiv = document.getElementById('main');
        while (mainDiv.firstChild) {
            mainDiv.removeChild(mainDiv.firstChild);
        }
        mainDiv.innerHTML = '<div id="group-1" class="group blank only"><i class="fa-solid fa-folder-plus"></i></div>';
    }
});


// UPDATE AND STORE DATA WHEN THERE ARE CHANGES
function convertRbgToHex(bgStyleString) {
    hex = '';
    if (bgStyleString.includes("rgb")) {
        rgbValuesAsString = bgStyleString.match(/\d+/g); // Use regex to find all numbers
        rgbValuesAsNumber = rgbValuesAsString.map(Number); // Convert strings to numbers
        rHex = rgbValuesAsNumber[0].toString(16).padStart(2, '0'); // 2 is the length, "0" will be added if the string is only 1-digit long
        gHex = rgbValuesAsNumber[1].toString(16).padStart(2, '0');
        bHex = rgbValuesAsNumber[2].toString(16).padStart(2, '0');
        hex = `#${rHex}${gHex}${bHex}`;
    }
    else {
        hex = bgStyleString.slice(-7);
    }
    return hex;
}


// FUNCTION TO UPDATE CURRENT CODES
function updateCurrentCodes() {
    // clear current codes
    currentCodesJson = [];

    // find all groupID from class "group"
    groupElements = document.querySelectorAll('.group');
    groupIDs = Array.from(groupElements).map(element => element.id);

    // loop thru all groupIDs
    for (i = 0; i < groupIDs.length; ++i) {
        // find groupName
        groupID = groupIDs[i];
        group = document.querySelector(`#${groupID}`);

        // if group not blank
        if (!group.classList.contains("blank")) {
            groupName = group.children[1].textContent;
            // find groupBg
            groupBgStyle = group.children[1].getAttribute('style');
            groupBg = convertRbgToHex(groupBgStyle);
            
            // loop thru all shortcuts
            shortcutContainer = group.children[2];
            for (let j = 0; j < shortcutContainer.children.length; j++) {
                shortcut = shortcutContainer.children[j];
                shortcutName = '';
                link = '';
                shortcutBg = '';
                // if shortcut not blank
                if (!shortcutContainer.children[j].classList.contains('blank')) {
                    // shortcutName, link, shortcutBg
                    shortcutName = shortcut.children[2].textContent;
                    link = shortcut.children[1].href;
                    shortcutBgStyle = shortcut.getAttribute('style');
                    shortcutBg = convertRbgToHex(shortcutBgStyle);
                }
                else {
                    shortcutName = null;
                    link = null;
                    shortcutBg = null;
                }
                toStore = {
                    "groupID": groupID,
                    "groupName": groupName,
                    "groupBg": groupBg,
                    "shortcutName": shortcutName,
                    "link": link,
                    "shortcutBg": shortcutBg
                };
                currentCodesJson.push(toStore);
            }
        }
        else {
            groupName = null;
            groupBg = null;
            shortcutName = null;
            link = null;
            shortcutBg = null;
            toStore = {
                "groupID": groupID,
                "groupName": groupName,
                "groupBg": groupBg,
                "shortcutName": shortcutName,
                "link": link,
                "shortcutBg": shortcutBg
            };
            currentCodesJson.push(toStore);
        };
    }

    // check last group and remove from codes if blank
    lastObject = currentCodesJson[currentCodesJson.length - 1];
    if (lastObject) {
        if (lastObject["groupName"] == null && lastObject["groupBg"] == null) {
            currentCodesJson.pop();
        }
    }

    currentCodes = JSON.stringify(currentCodesJson);
    storedCodes = localStorage.getItem('shortcut_data');
    if (currentCodes !== storedCodes && currentCodes.length == 0) {
        // store data
        localStorage.setItem('shortcut_data', currentCodes);

        // store data time
        now = new Date();
        shortcutDataTime = now.toLocaleString('vi-VN');
        localStorage.setItem('shortcut_data_time', shortcutDataTime);
    }
}

// PASTE CODES
document.getElementById('pasteBtn').addEventListener('click', () => {
    codes = prompt('Paste your codes here:');
    if (codes && codes != "null" && codes != null) {
        // store data
        localStorage.setItem('shortcut_data', codes);
        // update data info
        now = new Date();
        shortcutDataTime = now.toLocaleString('vi-VN');
        localStorage.setItem('shortcut_data_time', shortcutDataTime);
        // create shortcuts
        createShortcut();

        // check and add blank shortcuts
        checkAndAddBlanks();

        // rearrange group ids
        rearrangeGroupIds();

        // update header button
        updateHeader();
    }
});

// FUNCTION TO CREATE SHORTCUTS
function createShortcut() {
    storedCodes = localStorage.getItem('shortcut_data');
    storedCodesJson = JSON.parse(localStorage.getItem('shortcut_data'));
    if (storedCodes) {
        // delete all current elements in main
        mainDiv = document.getElementById('main');
        while (mainDiv.firstChild) {
            mainDiv.removeChild(mainDiv.firstChild);
        }

        // loop thru all objects in Json
        for (i = 0; i < storedCodesJson.length; i++) {
            groupID = storedCodesJson[i]["groupID"];
            groupName = storedCodesJson[i]["groupName"];
            groupBg = storedCodesJson[i]["groupBg"];
            shortcutName = storedCodesJson[i]["shortcutName"];
            link = storedCodesJson[i]["link"];
            shortcutBg = storedCodesJson[i]["shortcutBg"];

            // create normal group, ignore blank group from data
            if (groupName != null & groupBg != null) {
                // create group, handle, group-name, shortcut-container if not available
                if (!mainDiv.querySelector(`#${groupID}`)) {
                    // create group
                    newGroup = document.createElement('div');
                    newGroup.setAttribute("id", `${groupID}`); // set id
                    newGroup.classList.add("group"); // add class
                    mainDiv.appendChild(newGroup); // add group to main

                    // create handle
                    newHandle = document.createElement('div');
                    newHandle.classList.add("handle"); // add class
                    newHandle.innerHTML = '<i class="fa-solid fa-arrows-up-down"></i>'; // add icon
                    newGroup.appendChild(newHandle); // add handle to group

                    // create group-name
                    newGroupName = document.createElement('div');
                    newGroupName.classList.add("group-name"); // add class
                    newGroupName.setAttribute("style", `background-color: ${groupBg}`); // set style
                    newGroupName.textContent = groupName; // set textContent
                    newGroup.appendChild(newGroupName); // add group-name to group

                    // create shorcut-container
                    newShortcutContainer = document.createElement('div');
                    newShortcutContainer.classList.add("shortcut-container"); // add class
                    newGroup.appendChild(newShortcutContainer); // add shorcut-container to group
                }
                
                // re-declare parent div
                shortcutContainer = mainDiv.querySelector(`#${groupID} .shortcut-container`);

                // create shortcut
                if (shortcutName == null || link == null) { // create blank shorcut
                    newBlankShortcut = document.createElement('div');
                    newBlankShortcut.classList.add("shortcut"); // add class
                    newBlankShortcut.classList.add("blank"); // add class
                    newBlankShortcut.innerHTML = '<i class="fa-solid fa-plus"></i>'; // add icon
                    shortcutContainer.appendChild(newBlankShortcut); // add shorcut blank to shortcut-container
                }
                else { // create normal shortcut
                    newShortcut = document.createElement('div');
                    newShortcut.classList.add("shortcut"); // add class
                    newShortcut.setAttribute("style", `background-color: ${shortcutBg}`); // set style
                    shortcutContainer.appendChild(newShortcut); // add shorcut to shortcut-container
                    
                    // create shortcut-edit
                    newShortcutEdit = document.createElement('div');
                    newShortcutEdit.classList.add("shortcut-edit"); // add class
                    newShortcutEdit.hidden = true; // set hidden
                    newShortcut.appendChild(newShortcutEdit); // add shorcut-edit to shortcut

                    // create a
                    newA = document.createElement('a');
                    newA.href = link; // set link
                    newA.title = shortcutName; // set title
                    newShortcut.appendChild(newA); // add a to shortcut

                    // create shortcut-name
                    newShortcutName = document.createElement('div');
                    newShortcutName.classList.add("shortcut-name"); // add class
                    newShortcutName.textContent = shortcutName; // set textContent
                    newShortcut.appendChild(newShortcutName); // add shorcut-name to shortcut
                }
            }
        }
        // make group sortable
        $( function() {
            $( "#main" ).sortable({
            placeholder: "placeholder-group",
            handle: ".handle",
            stop: function() {
                updateCurrentCodes();
                checkAndAddBlanks();
                rearrangeGroupIds();
            }
            });
        } );
        
        $( function() {
        $( ".shortcut-container" ).sortable({
            // helper: "clone",
            forceHelperSize: true,
            connectWith: ".shortcut-container",
            tolerance: "pointer",
            stop: function() {
                updateCurrentCodes();
                checkAndAddBlanks();
                rearrangeGroupIds();
            }
        })
        } );
    }
};


// FUNCTION TO CHECK AND ADD BLANK SHORTCUTS AND GROUPS
function checkAndAddBlanks() {
    // find all groupID from class "group"
    groupElements = document.querySelectorAll('.group');
    groupIDs = Array.from(groupElements).map(element => element.id);
    lastID = groupIDs[groupIDs.length - 1]
    lastGroupElement = document.querySelector(`#${lastID}`);

    // only execute if there is a group
    if (lastGroupElement != null) {

        // check and create blank group
        if (!lastGroupElement.classList.contains("blank")) {
            newBlankGroup = document.createElement('div');
            newBlankGroup.setAttribute("id", `group-${groupIDs.length + 1}`); // set id
            newBlankGroup.classList.add("group"); // add class
            newBlankGroup.classList.add("blank"); // add class
            newBlankGroup.innerHTML = '<i class="fa-solid fa-folder-plus"></i>'; // add icon
            document.querySelector("#main").appendChild(newBlankGroup); // add shorcut blank to main
        }
        
        // loop thru all groupIDs to check and create blank shortcut
        for (i = 0; i < groupIDs.length; ++i) {
            // find groupName
            groupID = groupIDs[i];
            group = document.querySelector(`#${groupID}`);
            
            // if shortcutContainer not blank
            if (!group.classList.contains("blank")) {
                shortcutContainer = group.children[2];
                numberOfShortcuts = shortcutContainer.children.length;
                lastShortcut = shortcutContainer.children[numberOfShortcuts - 1];

                // add shortcut if shortcutContainer has less than 10 shortcuts
                if (numberOfShortcuts < 10 && !lastShortcut.classList.contains('blank')) {
                    newBlankShortcut = document.createElement('div');
                    newBlankShortcut.classList.add("shortcut"); // add class
                    newBlankShortcut.classList.add("blank"); // add class
                    newBlankShortcut.innerHTML = '<i class="fa-solid fa-plus"></i>'; // add icon
                    shortcutContainer.appendChild(newBlankShortcut); // add shorcut blank to shortcut-container
                }

                // remove last shortcut if shortcutContainer has more than 10 shortcuts
                if (numberOfShortcuts > 10 && lastShortcut.classList.contains('blank')) {
                    lastShortcut = shortcutContainer.children[numberOfShortcuts - 1];
                    lastShortcut.remove();
                }
            }
        }
    };
    // update codes
    updateCurrentCodes();
};

// FUNCTION TO REARRANGE GROUP IDS
function rearrangeGroupIds() {
    // find all groups as children of main
    main = document.querySelector('#main');
    // loop thru all children
    for (i = 0; i < main.children.length; ++i) {
        group = main.children[i];
        group.id = `group-${i+1}`;
    }
    // update codes
    updateCurrentCodes();
};

// UPDATE HEADER BUTTONS
function updateHeader() {
    storedCodes = localStorage.getItem('shortcut_data');
    if (!storedCodes) {
        document.querySelector('#copyBtn').disabled = true;
        document.querySelector('#downloadBtn').disabled = true;
        document.querySelector('#clearBtn').disabled = true;
    }
    else {
        document.querySelector('#copyBtn').disabled = false;
        document.querySelector('#downloadBtn').disabled = false;
        document.querySelector('#clearBtn').disabled = false;
    }
}

// DOWNLOAD DATA
document.getElementById('downloadBtn').addEventListener('click', () => {
    storedCodes = localStorage.getItem('shortcut_data');
    storedCodesJson = JSON.parse(storedCodes);
    // Create a new workbook and a worksheet
    wb = XLSX.utils.book_new();
    ws_data = storedCodesJson;
    ws = XLSX.utils.json_to_sheet(ws_data);
    XLSX.utils.book_append_sheet(wb, ws, "data");

    // Generate a file and trigger the download
    saveTime = getFormattedDateAndTime();
    XLSX.writeFile(wb, `Shortcut Data - ${saveTime}.xlsx`);
});

function getFormattedDateAndTime() {
    now = new Date();
    year = now.getFullYear();
    month = String(now.getMonth() + 1).padStart(2, '0');
    day = String(now.getDate()).padStart(2, '0');
    hours = String(now.getHours()).padStart(2, '0');
    minutes = String(now.getMinutes()).padStart(2, '0');
    seconds = String(now.getSeconds()).padStart(2, '0');

    return `${day}-${month}-${year} ${hours}.${minutes}.${seconds}`;
}

// MAKE SORTABLES
$( function() {
  $( "#main" ).sortable({
    placeholder: "placeholder-group",
    handle: ".handle",
    stop: function() {
        updateCurrentCodes();
        checkAndAddBlanks();
        rearrangeGroupIds();
    }
  });
} );

$( function() {
$( ".shortcut-container" ).sortable({
    // helper: "clone",
    forceHelperSize: true,
    connectWith: ".shortcut-container",
    tolerance: "pointer",
    stop: function() {
        updateCurrentCodes();
        checkAndAddBlanks();
        rearrangeGroupIds();
    }
})
} );

// document.querySelector(".shortcut").addEventListener("contextmenu", (event) => {
//     console.log("right clicked");

// });
// function to add blank at the end     V  
// function to update codes when changes are made   V
// function to rearrange groupIDs       V
// function to update header            V
// function to download data            V
// function to add blank group          V
// set default html                     V
// style buttons                        V
// edit mode by right click             
// make blank editable
// style groups





