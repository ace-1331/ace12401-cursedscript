//************************************Callbacks************************************

//Boot up sequence
let AlwaysOn;
let isLoaded;
try {
    AlwaysOn = localStorage.getItem("bc-cursed-always-on");
} catch { }
LoginListener();

async function LoginListener() {
    while (!isLoaded) {
        try {
            while (CurrentScreen == "Login") {
                await new Promise(r => setTimeout(r, 2000));
            }
            isLoaded = true;
            //Initialize base functions
            InitBasedFns();
            //AlwaysOn
            if (AlwaysOn == "enabled") {
                CursedStarter();
            }
        } catch { };
        await new Promise(r => setTimeout(r, 2000));
    }
}


/** Starts the script */
function CursedStarter() {
    try {
        //Cleans the existing chatlog
        document.querySelectorAll('.ChatMessage:not([verified=true]').forEach(msg => {
            var verifiedAtt = document.createAttribute("verified");
            verifiedAtt.value = "true";
            msg.setAttributeNode(verifiedAtt);
        });
        
        // Just restarts if the curse already exists (prevents dupes)
        if (window.cursedConfigInit && cursedConfig.isRunning == false) {
            //Runs the script
            cursedConfig.isRunning = true;
            cursedConfig.onRestart = true;
            popChatSilent("Curse restarted.", "System");
        } else if (!window.cursedConfigInit) {
            //Base configs
            window.cursedConfigInit = {
                hasPublicAccess: true,
                hasCursedBelt: false,
                hasCursedKneel: false,
                hasCursedLatex: false,
                hasCursedSpeech: true,
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
                hasCursedPaws: false,
                hasEntryMsg: false,
                hasFullMuteChat: false,
                hasCursedScrews: false,
                hasCursedPony: false,
                hasSound: false,
                hasRestrainedPlay: false,
                hasNoMaid: false,
                hasCursedRopes: false,
                hasNoContractions: false,
                hasFullPublic: false,
                hasAntiAFK: false,
                hasCursedMaid: false,
                hasRestrainedSpeech: false,
                hasCursedDildogag: false,
                canReceiveNotes: false,
                hasCaptureMode: false,
                hasReminders: false,
                hasForcedSensDep: false,
                
                owners: Player.Ownership ? [Player.Ownership.MemberNumber.toString()] : [],
                mistresses: Player.Ownership ? [Player.Ownership.MemberNumber.toString()] : [],
                enforced: Player.Ownership ? [Player.Ownership.MemberNumber.toString()] : [],
                blacklist: [],
                bannedWords: [],
                sentences: [{ ident: "yes", text: "Yes, %target%" }, { ident: "no", text: "No, %target%" }, { ident: "rephrase", text: "May this be rephrased into a yes or no question, %target%?" }, { ident: "greetings", text: "Greetings, %target%, it is good to see you." }, { ident: "leave", text: "May %self% be excused, %target%?" }, { ident: "service", text: "How may %self% be useful for you today, %target%?" },],
                cursedItems: [],
                cursedAppearance: [],
                savedColors: [],
                nicknames: [],
                reminders: [],
                reminderInterval: 60000,
                entryMsg: "",
                say: "",
                sound: "",
                self: "I",
                targets: [{ ident: "miss", text: "miss" }, { ident: "mistress", text: "mistress" }],
                capture: { capturedBy: "", Valid: 0},
                mistressIsHere: false,
                ownerIsHere: false,

                slaveIdentifier: Player.Name,
                commandChar: "#",

                strikes: 0,
                lastPunishmentAmount: 0,
                strikeStartTime: Date.now(),
                punishmentColor: "#222",
                punishmentsDisabled: false,

                warned: [],
                toUpdate: [],
                mustRefresh: false,
                isRunning: false,
                isSilent: false,
                isClassic: false,
                canLeash: false,
                isLockedOwner: false,
                hasWardrobeV2: false,
                hasIntenseVersion: false,
                wasLARPWarned: false,
                chatlog: [],
                chatStreak: 0,
                hasForward: false,
                onRestart: true,
            };
            window.cursedConfig = { ...cursedConfigInit };
            window.currentVersion = 28;
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
                popChatSilent("Welcome to the curse! The curse allows for many mysterious things to happen... have fun discovering them. The help command should be able to get you started (" + cursedConfig.commandChar + cursedConfig.slaveIdentifier + " help). Please report any issues or bug you encounter to ace (12401) - Ace__#5558.", "System");
                try {
                    localStorage.setItem(`bc-cursedConfig-version-${Player.MemberNumber}`, currentVersion);
                } catch { }
            } else {
                //Load previous data, takes care of upgrades or downgrades
                cursedConfig = { ...cursedConfig, ...oldStorage };

                //Set name immediately
                let user = cursedConfig.nicknames.filter(c => c.Number == Player.MemberNumber);
                if (user.length > 0) {
                    if (Player.Name != user[0].Nickname && !user[0].SavedName) {
                        cursedConfig.nicknames.filter(c => c.Number == char.MemberNumber)[0].SavedName = Player.Name;
                    }
                    Player.Name = cursedConfig.hasIntenseVersion && ChatRoomSpace != "LARP" ? user[0].Nickname : user[0].SavedName;
                }

                if (oldVersion > currentVersion) {
                    alert("WARNING! Downgrading the curse to an old version is not supported. This may cause issues with your settings. Please reinstall the latest version. Error: V03");
                }
                if (oldVersion != currentVersion) {
                    localStorage.setItem(`bc-cursedConfig-version-${Player.MemberNumber}`, currentVersion);
                    alert("IMPORTANT! Please make sure you refreshed your page after updating.");

                    //Update messages after alert so they are not lost if wearer refreshes on alert and storage was updated
                    SendChat("The curse following " + Player.Name + " has changed.");
                    popChatSilent("You have loaded an updated version of the curse, make sure you have refreshed your page before using this version. Please report any new bugs. This update may have introduced new features, don't forget to use the help command to see the available commands. (" + cursedConfig.commandChar + cursedConfig.slaveIdentifier + " help)", "System");
                } else if (oldVersion == currentVersion) {
                    SendChat("The curse follows " + Player.Name + ".");
                    popChatSilent("Have fun~ Please report any issues or bug you encounter to ace (12401) - Ace__#5558.", "System");
                }
            }

            if (cursedConfig.hasIntenseVersion) {
                popChatSilent("Intense mode is on (risky).");
            }

            //Resets Strikes when it has been a week
            if (cursedConfig.strikeStartTime + 604800000 < Date.now()) {
                popChatSilent("A new week has begun, your strikes have reset.", "System");
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
            ReminderProcess(); //Reminders handling
            InitCleanup(); //Cleans up the arrays
        }
    } catch { }
}

/** Stops the script */
function CursedStopper() {
    try {
        if (cursedConfig.isRunning) {
            cursedConfig.isRunning = false;
            popChatSilent("Curse stopped", "System");
        }
    } catch { }
}

/** Intense Mode Switch On */
function CursedIntenseOn() {
    try {
        if (!cursedConfig.hasIntenseVersion) {
            cursedConfig.hasIntenseVersion = true;
            popChatSilent("Intense mode activated (risky).", "System");
        }
    } catch { }
}

/** Intense Mode Switch Off */
function CursedIntenseOff() {
    try {
        if (cursedConfig.hasIntenseVersion) {
            cursedConfig.hasIntenseVersion = false;
            cursedConfig.say = "";
            cursedConfig.hasFullMuteChat = false;
            popChatSilent("Intense mode deactivated (safe).", "System");
        }
    } catch { }

}

/** Always on mode to start on load switch on */
function AlwaysOnTurnOn() {
    localStorage.setItem("bc-cursed-always-on", "enabled");
}

/** Always on mode to start on load switch off */
function AlwaysOnTurnOff() {
    localStorage.setItem("bc-cursed-always-on", "disabled");
}