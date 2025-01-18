chrome.runtime.onInstalled.addListener(() => {
    chrome.tabs.query({}, (tabs) => {
      // Sync the open tabs using Chrome's sync storage
      chrome.storage.sync.set({ tabs: tabs });
    });
  });
  
  // Listen for tab updates (add, update, remove)
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    chrome.storage.sync.get(['tabs'], (data) => {
      let tabs = data.tabs || [];
      const tabIndex = tabs.findIndex(t => t.id === tabId);
      if (tabIndex !== -1) {
        tabs[tabIndex] = tab; // Update existing tab info
      } else {
        tabs.push(tab); // Add new tab
      }
      chrome.storage.sync.set({ tabs });
    });
  });
  
  // Sync tabs when a new device is signed in
  chrome.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener((msg) => {
      if (msg.action === "getTabs") {
        chrome.storage.sync.get(['tabs'], (data) => {
          port.postMessage({ action: "syncTabs", tabs: data.tabs });
        });
      }
    });
  });