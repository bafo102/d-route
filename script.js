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
    shortcutCodesParsed = JSON.parse(localStorage.getItem('shortcut_data'));
    console.log(shortcutCodes)
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

let currentShortcuts = [];


document.getElementById('downloadBtn').addEventListener('click', getCurrentShortcuts);
function getCurrentShortcuts() {
    // find all groupIDs
    groupElements = document.querySelectorAll('.group');
    groupIds = Array.from(groupElements).map(element => element.id);
    
    // loop thru all groupID
    for (i = 0; i < groupIds.length; ++i) {
        // find groupName
        groupName = document.querySelector(`#${groupIds[i]} .group-name`).textContent;
        // find groupBg
        groupBg = document.querySelector(`#${groupIds[i]} .group-name`).getAttribute('style');
        // loop thru all shortcuts
        for (let i = 0; i < 10; i++) {
            // shortcutName
            
            // link
            // shortcutBg
        }
        
        console.log(groupName, groupBg, numberOfShorcuts);
    }
}

document.getElementById('pasteBtn').addEventListener('click', createShortcut);
function createShortcut() {
    shortcutCodes = localStorage.getItem('shortcut_data');
    shortcutCodesParsed = JSON.parse(localStorage.getItem('shortcut_data'));
    if (shortcutCodes) {
        for (let i = 0; i < shortcutCodesParsed.length; i++) {
            groupID = shortcutCodesParsed[i]["groupID"];
            groupName = shortcutCodesParsed[i]["groupName"];
            groupBg = shortcutCodesParsed[i]["groupBg"];
            shortcutName = shortcutCodesParsed[i]["shortcutName"];
            link = shortcutCodesParsed[i]["link"];
            shortcutBg = shortcutCodesParsed[i]["shortcutBg"];
            console.log(groupID, groupName, groupBg, shortcutName, link, shortcutBg);


            // create group
            // create handle
            // create group-name
            // create shorcut-container
            // create shortcut
        }
        const newDiv = document.createElement('div');
        newDiv.textContent = "new";
        document.querySelector("#group1 > div.shorcut-container.ui-sortable").appendChild(newDiv);
    }
};


/*
<div id="group1" class="group ui-state-default">
    <div class="handle"><i class="fa-solid fa-arrows-up-down"></i></div>
        <div class="group-name">MAIN</div>
            <div class="shorcut-container">
                <div class="shortcut">
                    <div class="shortcut-edit">
                        <button><i class="fa-solid fa-pen"></i></button>
                        <button><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                    <a href="https://www.youtube.com/"></a>
                    <div class="shortcut-content">Youtube</div>
                </div>
        <div class="shortcut">2</div>
        <div class="shortcut">3</div>
        <div class="shortcut">4</div>
        <div class="shortcut">5</div>
        <div class="shortcut">6</div>
        <div class="shortcut">7</div>
        <div class="shortcut">8</div>
        <div class="shortcut">9</div>
        <div class="shortcut">10
            <input type="color" id="colorInput" value="#ff0000">
        </div>
    </div>
</div>
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
    placeholder: "ui-state-highlight",
    handle: ".handle"
  });
} );

$( function() {
$( ".shorcut-container" ).sortable({
  connectWith: ".shorcut-container",
  tolerance: "pointer"
})
} );