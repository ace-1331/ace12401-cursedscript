//************************************Callbacks************************************

//Starts the script
function CursedStarter() {
    try {
        window.cursedConfig = {
            hasPublicAccess: true,
            hasCursedBelt: false,
            hasCursedKneel: false,
            hasCursedLatex: false,
            hasCursedSpeech: false,
            hasCursedOrgasm: false,
            hasCursedNakedness: false,
            isMute: false,
            disaledOnMistress: false,
            enabledOnMistress: false,
            hasCursedBlindfold: false,
            hasCursedHood: false,
            hasCursedEarplugs: false,
            hasCursedDildogag: false,
            hasCursedPanties: false,
            hasCursedGag: false,
            hasCursedMittens: false,
            hasCursedBunny: false,
            hasEntryMsg: false,
            hasFullMuteChat: false,
            hasCursedScrews: false,
        
            owners: Player.Ownership ? [Player.Ownership.MemberNumber.toString()] : [],
            mistresses: Player.Ownership ? [Player.Ownership.MemberNumber.toString()] : [],
            enforced: Player.Ownership ? [Player.Ownership.MemberNumber.toString()] : [],
            blacklist: [...Player.BlackList],
            bannedWords: [],
            cursedItems: [],
            entryMsg: "",
            say: "",
            mistressIsHere: false,
            ownerIsHere: false,
    
            slaveIdentifier: Player.Name,
            commandChar: "#",
    
            strikes: 0,
            lastPunishmentAmount: 0,
            lastWardrobeLock: 0,
            strikeStartTime: Date.now(),
    
            isRunning: false,
            isSilent: false,
            hasIntenseVersion: false,
            chatlog: [],
            log: [],
        };
    
        window.currentVersion = 11;
        window.oldStorage = null;
        window.oldVersion = null;
    
        try {
            oldStorage = JSON.parse(localStorage.getItem(`bc-cursedConfig-${Player.MemberNumber}`));
            oldVersion = JSON.parse(localStorage.getItem(`bc-cursedConfig-version-${Player.MemberNumber}`));
        } catch { }
    
        //Pull config from log or create
        if (!oldStorage) {
            SendChat("The curse awakens on " + Player.Name + ".");
            popChatSilent("Welcome to the curse! The curse allows for many mysterious things to happen... have fun discovering them. The help command should be able to get you started (" + cursedConfig.commandChar + cursedConfig.slaveIdentifier + " help). Please report any issues or bug you encounter to ace (12401) - Ace__#5558.");
            try {
                localStorage.setItem(`bc-cursedConfig-version-${Player.MemberNumber}`, currentVersion);
            } catch { }
        } else {
            //Load previous data, takes care of upgrades or downgrades
            if (oldVersion != currentVersion) {
                cursedConfig = { ...cursedConfig, ...oldStorage };
                SendChat("The curse following " + Player.Name + " has changed.");
                popChatSilent("You have loaded an updated version of the curse, please report any new bugs. This update may have introduced new features or bug fixes, don't forget to use the help command to see the available commands. (" + cursedConfig.commandChar + cursedConfig.slaveIdentifier + " help)");
                localStorage.setItem(`bc-cursedConfig-version-${Player.MemberNumber}`, currentVersion);
            } else if (oldVersion == currentVersion) {
                cursedConfig = oldStorage;
                SendChat("The curse follows " + Player.Name + ".");
                popChatSilent("Have fun~ Please report any issues or bug you encounter to ace (12401) - Ace__#5558.");
            }
        }
    
        //Cleans the existing chatlog
        document.querySelectorAll('.ChatMessage:not([verified=true]').forEach(msg => {
            var verifiedAtt = document.createAttribute("verified");
            verifiedAtt.value = "true";
            msg.setAttributeNode(verifiedAtt);
        });
    
        //Runs the script
        cursedConfig.isRunning = true;
        CursedCheckUp(); //Initial check
        ChatlogProcess(); //Chatlog handling
        InitHelpMsg();
    
        // Sends a message to the server.. this is modified to allow tricks into it
        ServerSend = function (Message, Data) {
            var isActivated = !(cursedConfig.mistressIsHere && cursedConfig.disaledOnMistress)
                && ((cursedConfig.enabledOnMistress && cursedConfig.ownerIsHere) || !cursedConfig.enabledOnMistress)
            if (Message == "ChatRoomChat" && Data.Type == "Chat" && cursedConfig.hasFullMuteChat && isActivated) return;
            ServerSocket.emit(Message, Data);
        }
    } catch { }
}

//Stops the script
function CursedStopper() { 
    try {
        cursedConfig.isRunning = false;
    } catch { }
}

//Intense Mode
function CursedIntenseOn() {
    try {
        cursedConfig.hasIntenseVersion = true;
    } catch { }
}

function CursedIntenseOff() { 
    try {
        cursedConfig.hasIntenseVersion = false;
        cursedConfig.say = "";
        cursedConfig.hasFullMuteChat = false;
    } catch { }
    
}