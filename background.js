const ignoredUrls = [
    "chrome://",
    "chrome-extension://",
    "https://chrome.google.com/webstore"
];
const ignore = target => ignoredUrls.some(url => target.startsWith(url));

const tabhistory = new Map();
const tabprefixes = new Map();
chrome.tabs.onActivated.addListener(activeInfo => {
    chrome.tabs.get(activeInfo.tabId, function(tab) {
        previoustab = (currenttab.title) ? currenttab :  tab;
        currenttab = tab;
        if (previoustab.windowId == currenttab.windowId) {
            chrome.scripting.executeScript({
                target: {tabId: previoustab.id},
                function: setTabTitle,
                args: [previoustab.title]
            });
        }
        updateTabTitle(tab);
    });
});

const prefixChannel = new BroadcastChannel("prefix");

prefixChannel.onmessage = (event) => {
    tabprefixes.set(event.data.window, event.data.prefix);
    console.log(tabprefixes);
}

currenttab = previousttab = {};
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.active) {
        updateTabTitle(tab);
    }
});

function updateTabTitle(tab) {
    console.log(tab);
    const prefix = (tabprefixes.get(tab.windowId) || "Default") + " — " ;
    console.log({prefix});
    if (!tab.title.startsWith(prefix) && !ignore(tab.url)) {
        tabhistory.set(tab.id, tab.title);
        console.log(tabhistory);
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: setTabTitle,
            args: [prefix + tab.title]
        }).catch(error => {
            console.error("Failed to execute script:", error.message);
        });
    }
}

function setTabTitle(newTitle) {
    document.title = newTitle;
}
  
