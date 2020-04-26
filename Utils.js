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
            hasEntryMsg: false,
            hasFullMuteChat: false,
            hasCursedScrews: false,
            hasCursedPony: false,
            hasSound: false,
            hasRestrainedPlay: false,
            hasNoMaid: false,
            
            owners: Player.Ownership ? [Player.Ownership.MemberNumber.toString()] : [],
            mistresses: Player.Ownership ? [Player.Ownership.MemberNumber.toString()] : [],
            enforced: Player.Ownership ? [Player.Ownership.MemberNumber.toString()] : [],
            blacklist: [...Player.BlackList],
            bannedWords: [],
            cursedItems: [],
            cursedAppearance: [],
            entryMsg: "",
            say: "",
            sound: "",
            mistressIsHere: false,
            ownerIsHere: false,
    
            slaveIdentifier: Player.Name,
            commandChar: "#",
            
            strikes: 0,
            lastPunishmentAmount: 0,
            lastWardrobeLock: 0,
            strikeStartTime: Date.now(),
            punishmentColor: "#222",
            punishmentsDisabled: false,
    
            mustRefresh: false,
            isRunning: false,
            isSilent: false,
            isLockedOwner: false,
            hasIntenseVersion: false,
            wasLARPWarned: false,
            chatlog: [],
            chatStreak: 0,
            hasForward: false,
            onRestart: true,
        };
    
        window.currentVersion = 20;
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
            cursedConfig = { ...cursedConfig, ...oldStorage };
            console.log(oldStorage, cursedConfig);
            
            if (oldVersion != currentVersion) {
                SendChat("The curse following " + Player.Name + " has changed.");
                popChatSilent("You have loaded an updated version of the curse, make sure you have refreshed your page before using this version. Please report any new bugs. This update may have introduced new features, don't forget to use the help command to see the available commands. (" + cursedConfig.commandChar + cursedConfig.slaveIdentifier + " help)");
                localStorage.setItem(`bc-cursedConfig-version-${Player.MemberNumber}`, currentVersion);
                alert("IMPORTANT! Please make sure you refreshed your page after updating.")
            } else if (oldVersion == currentVersion) {
                SendChat("The curse follows " + Player.Name + ".");
                popChatSilent("Have fun~ Please report any issues or bug you encounter to ace (12401) - Ace__#5558.");
            }
        }
        
        if (cursedConfig.hasIntenseVersion) {
            popChatSilent("Intense mode is on (risky).");
        }
        
        //Cleans the existing chatlog
        document.querySelectorAll('.ChatMessage:not([verified=true]').forEach(msg => {
            var verifiedAtt = document.createAttribute("verified");
            verifiedAtt.value = "true";
            msg.setAttributeNode(verifiedAtt);
        });
    
        //Runs the script
        cursedConfig.isRunning = true;
        cursedConfig.onRestart = true;
        CursedCheckUp(); //Initial check
        ChatlogProcess(); //Chatlog handling
        InitHelpMsg();
    
        //ALTERED FUNCTIONS
        
        // Sends a message to the server.
        ServerSend = function (Message, Data) {
            var isActivated = !(cursedConfig.mistressIsHere && cursedConfig.disaledOnMistress)
                && ((cursedConfig.enabledOnMistress && cursedConfig.ownerIsHere) || !cursedConfig.enabledOnMistress) && cursedConfig.isRunning
            if (Message == "ChatRoomChat" && Data.Type == "Chat" && cursedConfig.hasIntenseVersion && cursedConfig.hasFullMuteChat && isActivated) return;
            ServerSocket.emit(Message, Data);
        }
        
        //Management break functions
        ManagementCanBreakTrialOnline = function () { return (( !cursedConfig.isRunning || !cursedConfig.isLockedOwner || !cursedConfig.hasIntenseVersion) && (Player.Owner == "") && (Player.Ownership != null) && (Player.Ownership.Stage != null) && (Player.Ownership.Stage == 0)) }
        ManagementCanBeReleasedOnline = function () { return ((!cursedConfig.isRunning || !cursedConfig.isLockedOwner || !cursedConfig.hasIntenseVersion) && (Player.Owner != "") && (Player.Ownership != null) && (Player.Ownership.Start != null) && (Player.Ownership.Start + 604800000 <= CurrentTime)) }
        ManagementCannotBeReleasedOnline = function () { return ((!cursedConfig.isRunning || !cursedConfig.isLockedOwner || !cursedConfig.hasIntenseVersion) && (Player.Owner != "") && (Player.Ownership != null) && (Player.Ownership.Start != null) && (Player.Ownership.Start + 604800000 > CurrentTime)) }
        
        //Maid
        MainHallMaidReleasePlayer = function () {
            if (MainHallMaid.CanInteract() && (!cursedConfig.isRunning || !cursedConfig.hasIntenseVersion || !cursedConfig.hasNoMaid)) {
                for(var D = 0; D < MainHallMaid.Dialog.length; D++)
                    if ((MainHallMaid.Dialog[D].Stage == "0") && (MainHallMaid.Dialog[D].Option == null))
                        MainHallMaid.Dialog[D].Result = DialogFind(MainHallMaid, "AlreadyReleased");
                CharacterRelease(Player);
                MainHallMaid.Stage = "10";
            } else MainHallMaid.CurrentDialog = DialogFind(MainHallMaid, "CannotRelease");
        }
    } catch { }
}

//Stops the script
function CursedStopper() { 
    try {
        if (cursedConfig.isRunning) { 
            cursedConfig.isRunning = false;
            popChatSilent("Curse stopped");
        }
    } catch { }
}

//Intense Mode
function CursedIntenseOn() {
    try {
        if (!cursedConfig.hasIntenseVersion) {
            cursedConfig.hasIntenseVersion = true;
            popChatSilent("Intense mode activated (risky).");
        }
    } catch { }
}

function CursedIntenseOff() { 
    try {
        if (cursedConfig.hasIntenseVersion) {
            cursedConfig.hasIntenseVersion = false;
            cursedConfig.say = "";
            cursedConfig.hasFullMuteChat = false;
            popChatSilent("Intense mode deactivated (safe).");
        }
    } catch { }
    
}

//Import/Export extension buttons
async function CursedExtImport() {
    try {
        let configs = await navigator.clipboard.readText();
        cursedImport(configs);
        localStorage.setItem(`bc-cursedConfig-${Player.MemberNumber}`, JSON.stringify(cursedConfig));
    } catch { console.log("Import failed"); }
}
function CursedExtExport() { 
    try {
        navigator.permissions.query({name: "clipboard-write"}).then(result => {
            if (result.state == "granted" || result.state == "prompt") {
                navigator.clipboard.writeText(cursedExport());
            }
        });
    } catch { console.log("Export failed"); }
}