console.log("Background: script loaded");

chrome.runtime.onInstalled.addListener(() => {
  let newURL = "https://github.com/ace-1331/ace12401-cursedscript/wiki/New-Installation";
  chrome.tabs.create({ url: newURL });
});