//************************************Callbacks************************************

//Starts the script
function CursedStarter() {
    try {
        //Base configs
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
            nicknames: [],
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
    
        window.currentVersion = 21;
        window.oldStorage = null;
        window.oldVersion = null;
    
        //Tries to load configs
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
    
        //Resets Strikes when it has been a week 
        if (cursedConfig.strikeStartTime + 604800000 < Date.now()) { 
            SendChat("The curse on " + Player.Name + " forgets her past transgressions, a new week has begun.");
            cursedConfig.strikeStartTime = Date.now();
            cursedConfig.strikes = 0;
            cursedConfig.lastPunishmentAmount = 0;
        }
        
        //Make sure the real owner is in the list
        if (Player.Owner && !cursedConfig.owners.includes(Player.Ownership.MemberNumber.toString())) { 
            cursedConfig.owners.push(Player.Ownership.MemberNumber.toString());
        }
        
        //Runs the script
        cursedConfig.isRunning = true;
        cursedConfig.onRestart = true;
        InitHelpMsg();
        InitAlteredFns();
        CursedCheckUp(); //Initial check
        ChatlogProcess(); //Chatlog handling
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