let websiteList = [];

async function loadWebsiteList() {
  const response = await fetch(chrome.runtime.getURL("list"));
  const text = await response.text();
  websiteList = text.split("\n").filter((line) => line.trim() !== "");
}

loadWebsiteList().then(() => {
  chrome.webNavigation.onCompleted.addListener((details) => {
    const url = new URL(details.url);
    const hostname = url.hostname;
    const isInList = websiteList.some(
      (entry) => hostname === entry || hostname.endsWith(`.${entry}`),
    );

    if (isInList) {
      chrome.scripting.executeScript({
        target: { tabId: details.tabId },
        func: showPopupIfNeeded,
        args: [hostname],
      });
    }
  });
});

function showPopupIfNeeded(hostname) {
  chrome.storage.local.get([`popup_cooldown_${hostname}`], (data) => {
    const now = Date.now();
    const lastShown = data[`popup_cooldown_${hostname}`];
    const cooldown = 5 * 60 * 1000;

    if (!lastShown || now - lastShown > cooldown) {
      const result = confirm("Slopsite Detected!\n\nGo back?");
      if (result) {
        if (window.history.length === 1) {
          window.close();
          return;
        }
        window.history.back();
      } else {
        chrome.storage.local.set({ [`popup_cooldown_${hostname}`]: now });
      }
    }
  });
}
