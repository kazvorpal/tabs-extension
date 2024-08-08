const prefixChannel = new BroadcastChannel('prefix');
function savePrefix() {
    const prefix = document.getElementById('prefixInput').value;
    prefixChannel.postMessage({window: "test", prefix: prefix});
    chrome.storage.local.set({prefix}, function() {
        console.log('Prefix is set to ' + prefix);
    });
}
document.addEventListener('DOMContentLoaded', function() {
    const saveButton = document.getElementById('saveButton');
    saveButton.addEventListener('click', function() {
        const prefix = document.getElementById('prefixInput').value;
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            var currentTab = tabs[0];
            console.log({currentTab});
            prefixChannel.postMessage({window: currentTab.windowId, prefix: prefix})
        });
        chrome.storage.local.set({ prefix }, function() {
            console.log('Prefix storage be set to ' + prefix);
        });
    });
});
