
window.addEventListener("load", e => {

    function AddScript(scriptFileName) {
        var script = document.createElement('script');
        script.src = chrome.runtime.getURL(scriptFileName);
        return document.head.appendChild(script);
    }
    
    AddScript("Utils.js");
    AddScript("Curse/MainCurse.js");
    AddScript("Curse/Checks/SelfMessageCheck.js");
    AddScript("Curse/Checks/MessageCheck.js");
    AddScript("Curse/Checks/PunishmentCheck.js");
    AddScript("Curse/Checks/AppearanceCheck.js");
    AddScript("Curse/Functions/All.js");
    AddScript("Curse/Functions/ClubOwner.js");
    AddScript("Curse/Functions/Private.js");
    AddScript("Curse/Functions/Owner.js");
    AddScript("Curse/Functions/Mistress.js");
    AddScript("Curse/Functions/Public.js");
    AddScript("Curse/Functions/Wearer.js");
    AddScript("Curse/Utilities/Activators.js");
    AddScript("Curse/Utilities/AlteredFunctions.js");
    AddScript("Curse/Utilities/Helpers.js");
    AddScript("Curse/Utilities/LongStrings.js");
    AddScript("Curse/Utilities/Tips.js");
    AddScript("Curse/Room/CurseRoom.js");
    AddScript("Curse/Room/WardrobeV2.js");
});