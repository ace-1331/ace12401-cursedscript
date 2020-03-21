
window.addEventListener("load", e => {

    function AddScript(scriptFileName) {
        var script = document.createElement('script');
        script.src = chrome.runtime.getURL(scriptFileName);
        return document.head.appendChild(script);
    }

    AddScript("Utils.js");
    AddScript("CursedPublic/CP_Activators.js");
    AddScript("CursedPublic/CP_Helpers.js");
    AddScript("CursedPublic/CP_LongStrings.js");
    AddScript("CursedPublic/CP_Loop.js");
    AddScript("CursedPublic/CP_MessageCheck.js");
});