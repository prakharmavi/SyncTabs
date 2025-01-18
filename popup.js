document.getElementById('syncButton').addEventListener('click', () => {
    chrome.runtime.connect().postMessage({ action: 'getTabs' });
  });
  
  chrome.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener((msg) => {
      if (msg.action === "syncTabs") {
        const tabsList = document.getElementById('tabsList');
        tabsList.innerHTML = '';
        msg.tabs.forEach(tab => {
          const li = document.createElement('li');
          li.textContent = tab.title;
          tabsList.appendChild(li);
        });
      }
    });
  });