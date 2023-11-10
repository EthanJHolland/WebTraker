// const sites = [wikipedia]; //a site must be in this array to be tracked

function setupPage(){
    if(document.getElementById("toggle")){
        document.getElementById("toggle").checked=true;
    }else{
        console.log("no")
    }
    // for(let site of sites){

    // }
}

// Saves options to chrome.storage
function saveSettings() {
    var color = document.getElementById('color').value;
    var likesColor = document.getElementById('like').checked;
    chrome.storage.sync.set({
      favoriteColor: color,
      likesColor: likesColor
    }, function() {
      // Update status to let user know options were saved.
      var status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(function() {
        status.textContent = '';
      }, 750);
    });
    // document.getElementById("toggle").checked=false;
}
  
  // Restores select box and checkbox state using the preferences
  // stored in chrome.storage.
  function loadSettings() {
      document.getElementById("toggle").checked=true;
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
      favoriteColor: 'red',
      likesColor: true
    }, function(items) {
      document.getElementById('color').value = items.favoriteColor;
      document.getElementById('like').checked = items.likesColor;
    });
  }
  document.addEventListener('DOMContentLoaded', setupPage);
  document.getElementById('save').addEventListener('click', saveSettings);