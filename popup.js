document.getElementById("addSite").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = new URL(tab.url);
  const hostname = url.hostname;
  window.open(
    `https://github.com/InOnesGraveDed/SlopsiteDetector/issues/new?title=Add ${hostname} to blacklist&body=Please add: ${hostname}`,
    "_blank",
  );
});
