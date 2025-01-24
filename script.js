document.getElementById('uploadBtn').addEventListener('change', function(event) {
  // only get the first file
  const file = event.target.files[0];

  if (file) {
      const reader = new FileReader();

      reader.onload = function(e) {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {raw: false, defval: null}); // defval is to get the blank cell value
          console.log(jsonData); // Access your JSON data here
          // store data
          localStorage.setItem('shortcut_data', JSON.stringify(jsonData));
          // update data info
          now = new Date();
          shortcutDataTime = now.toLocaleString('vi-VN');
          localStorage.setItem('shortcut_data_time', shortcutDataTime);
          // update interface
          // updateInterface();
      };

      reader.readAsArrayBuffer(file); // Read the file as an array buffer

  } else {
      console.log('No file selected');
  }
});

document.getElementById('copyBtn').addEventListener('click', () => {
    data_time = localStorage.getItem('shortcut_data_time');
    console.log(data_time);
    shortcutCodes = localStorage.getItem('shortcut_data');
    shortcutCodesParsed = JSON.parse(shortcutCodes);
    console.log(shortcutCodes)
    console.log(shortcutCodesParsed)
    // Use the Clipboard API to copy the text
    navigator.clipboard.writeText(shortcutCodes);
    alert(`Codes copied: ${shortcutCodes}`);
});


document.getElementById('clearBtn').addEventListener('click', () => {
    if (confirm('Clear all data?')) {
        // clear shortcut data
        localStorage.removeItem('shortcut_data');
        // clear shortcut data store time
        localStorage.removeItem('shortcut_data_time');
        // // update interface
        // updateInterface();
    }
});

let currentShortcutJson = [];

document.getElementById('downloadBtn').addEventListener('click', getCurrentShortcuts);
function getCurrentShortcuts() {
    // find all groupID from class "group"
    groupElements = document.querySelectorAll('.group');
    groupIDs = Array.from(groupElements).map(element => element.id);

    // loop thru all groupIDs
    for (i = 0; i < groupIDs.length; ++i) {
        // find groupName
        group = document.querySelector(`#${groupIDs[i]}`);
        groupName = group.children[1].textContent;
        // find groupBg
        groupBg = group.children[1].getAttribute('style').slice(-7);
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
                shortcutBg = shortcut.getAttribute('style').slice(-7);
            }
            else {
                shortcutName = null;
                link = null;
                shortcutBg = null;
            }
            toStore = {
                "groupName": groupName,
                "groupBg": groupBg,
                "shortcutName": shortcutName,
                "link": link,
                "shortcutBg": shortcutBg
            };
            currentShortcutJson.push(toStore);
            currentShortcutsCodes = JSON.stringify(currentShortcutJson);
        }
    }
    console.log(currentShortcutJson);
    console.log(currentShortcutsCodes);
}

document.getElementById('pasteBtn').addEventListener('click', createShortcut);
function createShortcut() {
    shortcutCodes = localStorage.getItem('shortcut_data');
    shortcutCodesParsed = JSON.parse(localStorage.getItem('shortcut_data'));
    if (shortcutCodes) {
        // delete all current elements in main
        mainDiv = document.getElementById('main');
        while (mainDiv.firstChild) {
            mainDiv.removeChild(mainDiv.firstChild);
        }

        for (i = 0; i < shortcutCodesParsed.length; i++) {
            groupID = shortcutCodesParsed[i]["groupID"];
            groupName = shortcutCodesParsed[i]["groupName"];
            groupBg = shortcutCodesParsed[i]["groupBg"];
            shortcutName = shortcutCodesParsed[i]["shortcutName"];
            link = shortcutCodesParsed[i]["link"];
            shortcutBg = shortcutCodesParsed[i]["shortcutBg"];

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
            if (shortcutName == null || link == null) { // if null
                newBlankShortcut = document.createElement('div');
                newBlankShortcut.classList.add("shortcut"); // add class
                newBlankShortcut.classList.add("blank"); // add class
                newBlankShortcut.innerHTML = '<i class="fa-solid fa-plus"></i>'; // add icon
                shortcutContainer.appendChild(newBlankShortcut); // add shorcut blank to shortcut-container
            }
            else { // if not null
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
        // make group sortable
        $( function() {
            $( "#main" ).sortable({
            placeholder: "placeholder-group",
            handle: ".handle"
            });
        } );
        
        $( function() {
        $( ".shortcut-container" ).sortable({
            // helper: "clone",
            forceHelperSize: true,
            connectWith: ".shortcut-container",
            tolerance: "pointer"
        })
        } );
    }
};

/*
<div id="group-1" class="group">
    <div class="handle"><i class="fa-solid fa-arrows-up-down"></i></div>
    <div class="group-name" style="background-color: #4371ba">MAIN</div>
    <div class="shortcut-container">
        <div class="shortcut" style="background-color: #6c8d91">
            <div class="shortcut-edit" hidden></div>
            <a href="https://www.google.com/" title="Google"></a>
            <div class="shortcut-name">Google</div>
        </div>
        <div class="shortcut" style="background-color: #2d9268">
            <div class="shortcut-edit" hidden></div>
            <a href="https://www.youtube.com/" title="Youtube"></a>
            <div class="shortcut-name">Youtube</div>
        </div>
        <div class="shortcut blank"><i class="fa-solid fa-plus"></i></div>
        <div class="shortcut" style="background-color: #3f1e9b">
            <div class="shortcut-edit" hidden></div>
            <a href="https://www.instagram.com/" title="Instagram"></a>
            <div class="shortcut-name">Instagram</div>
        </div>
        <!-- <div class="shortcut" style="background-color: #6c8d91">10
            <input type="color" id="colorInput">
        </div> -->
        <div class="shortcut blank"><i class="fa-solid fa-plus"></i></div>
        <div class="shortcut blank"><i class="fa-solid fa-plus"></i></div>
        <div class="shortcut blank"><i class="fa-solid fa-plus"></i></div>
        <!-- <div class="shortcut blank"><i class="fa-solid fa-plus"></i></div> -->
        <div class="shortcut blank"><i class="fa-solid fa-plus"></i></div>
        <div class="shortcut" style="background-color: #3f1e9b">
            <div class="shortcut-edit" hidden></div>
            <a href="https://www.instagram.com/" title="Instagram"></a>
            <div class="shortcut-name">Instagram</div>
        </div>
    </div>
</div>

<div class="shortcut blank"><i class="fa-solid fa-plus"></i></div>
*/

// let data = [
//   {
//       "groupID": "group1",
//       "groupName": "MAIN",
//       "groupBg": "",
//       "shortcutName": "Google",
//       "link": "google.com",
//       "shortcutBg": ""
//   },
//   {
//       "groupID": "group1",
//       "groupName": "MAIN",
//       "groupBg": "",
//       "shortcutName": "YouTube",
//       "link": "youtube.com",
//       "shortcutBg": ""
//   },
//   {
//       "groupID": "group1",
//       "groupName": "MAIN",
//       "groupBg": "",
//       "shortcutName": "Facebook",
//       "link": "facebook.com",
//       "shortcutBg": ""
//   },
//   {
//       "groupID": "group1",
//       "groupName": "MAIN",
//       "groupBg": "",
//       "shortcutName": "Instagram",
//       "link": "instagram.com",
//       "shortcutBg": ""
//   },
//   {
//       "groupID": "group1",
//       "groupName": "MAIN",
//       "groupBg": "",
//       "shortcutName": "WhatsApp",
//       "link": "whatsapp.com",
//       "shortcutBg": ""
//   },
//   {
//       "groupID": "group1",
//       "groupName": "MAIN",
//       "groupBg": "",
//       "shortcutName": "X (formerly Twitter)",
//       "link": "x.com",
//       "shortcutBg": ""
//   },
//   {
//       "groupID": "group1",
//       "groupName": "MAIN",
//       "groupBg": "",
//       "shortcutName": "Wikipedia",
//       "link": "wikipedia.org",
//       "shortcutBg": ""
//   },
//   {
//       "groupID": "group1",
//       "groupName": "MAIN",
//       "groupBg": "",
//       "shortcutName": "ChatGPT",
//       "link": "chatgpt.com",
//       "shortcutBg": ""
//   },
//   {
//       "groupID": "group1",
//       "groupName": "MAIN",
//       "groupBg": "",
//       "shortcutName": "Reddit",
//       "link": "reddit.com",
//       "shortcutBg": ""
//   },
//   {
//       "groupID": "group1",
//       "groupName": "MAIN",
//       "groupBg": "",
//       "shortcutName": "Yahoo",
//       "link": "yahoo.com",
//       "shortcutBg": ""
//   },
//   {
//       "groupID": "group2",
//       "groupName": "SUPP",
//       "groupBg": "",
//       "shortcutName": "Amazon",
//       "link": "amazon.com",
//       "shortcutBg": ""
//   },
//   {
//       "groupID": "group2",
//       "groupName": "SUPP",
//       "groupBg": "",
//       "shortcutName": "LinkedIn",
//       "link": "linkedin.com",
//       "shortcutBg": ""
//   },
//   {
//       "groupID": "group2",
//       "groupName": "SUPP",
//       "groupBg": "",
//       "shortcutName": "Netflix",
//       "link": "netflix.com",
//       "shortcutBg": ""
//   },
//   {
//       "groupID": "group2",
//       "groupName": "SUPP",
//       "groupBg": "",
//       "shortcutName": "eBay",
//       "link": "ebay.com",
//       "shortcutBg": ""
//   },
//   {
//       "groupID": "group2",
//       "groupName": "SUPP",
//       "groupBg": "",
//       "shortcutName": "",
//       "link": "",
//       "shortcutBg": ""
//   },
//   {
//       "groupID": "group2",
//       "groupName": "SUPP",
//       "groupBg": "",
//       "shortcutName": "Pinterest",
//       "link": "pinterest.com",
//       "shortcutBg": ""
//   }
// ]

// console.log(data);
// console.log(data[3]["shortcutName"]);


// groups [groupID, groupName, groupBg]
// shortcuts [shortcutName, link, shortcutBg]


// document.getElementById('downloadBtn').addEventListener('click', function() {
//   const data = [
//       ["Name", "Age", "City"],
//       ["Alice", 30, "New York"],
//       ["Bob", 25, "Los Angeles"],
//       ["Charlie", 35, "Chicago"]
//   ];

//   let csvContent = "data:text/csv;charset=utf-8," 
//       + data.map(e => e.join(",")).join("\n");

//   const encodedUri = encodeURI(csvContent);
//   const link = document.createElement("a");
//   link.setAttribute("href", encodedUri);
//   link.setAttribute("download", "data.csv");
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// });

// make group sortable
$( function() {
  $( "#main" ).sortable({
    placeholder: "placeholder-group",
    handle: ".handle"
  });
} );

$( function() {
$( ".shortcut-container" ).sortable({
    // helper: "clone",
    forceHelperSize: true,
    connectWith: ".shortcut-container",
    tolerance: "pointer"
})
} );