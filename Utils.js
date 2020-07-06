//************************************Callbacks************************************

//Boot up sequence
window.currentVersion = 35;
let AlwaysOn;
let isLoaded;

try {
  AlwaysOn = localStorage.getItem("bc-cursed-always-on");
} catch (err) { console.log(err); }

LoginListener();

async function LoginListener() {
  while (!isLoaded) {
    try {
      while ((!window.CurrentScreen || window.CurrentScreen == "Login") && !isLoaded) {
        await new Promise(r => setTimeout(r, 2000));
      }
      isLoaded = true;
      //Initialize base functions
      InitBasedFns();
      //AlwaysOn
      if (AlwaysOn == "enabled") {
        CursedStarter();
        TryPopTip(31);
      }
    } catch (err) { console.log(err); }
    await new Promise(r => setTimeout(r, 2000));
  }
}

/** Starts the script */
function CursedStarter() {
  try {
    //Cleans the existing chatlog
    document.querySelectorAll(".ChatMessage:not([verified=true]").forEach(msg => {
      let verifiedAtt = document.createAttribute("verified");
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
        hasCursedKneel: false,
        hasCursedSpeech: true,
        hasCursedOrgasm: false,
        isMute: false,
        disaledOnMistress: false,
        enabledOnMistress: false,
        hasEntryMsg: false,
        hasFullMuteChat: false,
        hasSound: false,
        hasRestrainedPlay: false,
        hasNoMaid: false,
        hasNoContractions: false,
        hasFullPublic: false,
        hasAntiAFK: false,
        hasRestrainedSpeech: false,
        canReceiveNotes: false,
        hasCaptureMode: false,
        hasReminders: false,
        hasForcedSensDep: false,
        isLockedNewSub: false,
        isLockedNewLover: false,
        isLockedOwner: false,
        hasDollTalk: false,
        hasForcedMeterLocked: false,
        hasForcedMeterOff: false,
        hasDCPrevention: false,
        cannotOrgasm: false,
        forbidorgasm: false,
        hasBlockedOOC: false,
        hasSecretOrgasm: false,
        hasNoEasyEscape: false,
        hasFullLengthMode: false,
        hasFullBlindMode: false,
        
        owners: Player.Ownership ? [Player.Ownership.MemberNumber.toString()] : [],
        mistresses: Player.Ownership ? [Player.Ownership.MemberNumber.toString()] : [],
        blacklist: [],
        bannedWords: [],
        sentences: [{ ident: "yes", text: "Yes, %target%" }, { ident: "no", text: "No, %target%" }, { ident: "rephrase", text: "May this be rephrased into a yes or no question, %target%?" }, { ident: "greetings", text: "Greetings, %target%, it is good to see you." }, { ident: "leave", text: "May %self% be excused, %target%?" }, { ident: "service", text: "How may %self% be useful for you today, %target%?" },],
        cursedAppearance: [],
        cursedPresets: [],
        savedColors: [],
        charData: [],
        reminders: [],
        reminderInterval: 300000,
        entryMsg: "",
        say: "",
        sound: "",
        self: "I",
        targets: [{ ident: "miss", text: "miss" }, { ident: "mistress", text: "mistress" }],
        capture: { capturedBy: "", Valid: 0 },
        mistressIsHere: false,
        ownerIsHere: false,
        seenTips: [],

        slaveIdentifier: Player.Name,
        commandChar: "#",

        vibratorIntensity: 3,
        orgasms: 0,
        strikes: 0,
        lastPunishmentAmount: 0,
        strikeStartTime: Date.now(),
        punishmentsDisabled: false,
        transgressions: [],

        warned: [],
        toUpdate: [],
        mustRefresh: false,
        isRunning: false,
        isSilent: false,
        isClassic: false,
        isEatingCommands: false,
        isLooseOwner: false,
        mustRetype: true,
        hasRestraintVanish: false,
        canLeash: false,
        hasWardrobeV2: false,
        hasIntenseVersion: false,
        wasLARPWarned: false,
        hasFullCurse: false,
        disabledCommands: [],
        optinCommands: [{command: 'forcedsay', isEnabled: false}, {command: 'disableblocking', isEnabled: false}],
        chatlog: [],
        savedSilent: [],
        chatStreak: 0,
        shouldPopSilent: false,
        hasForward: false,
        onRestart: true,
        hasHiddenDisplay: false,
      };
      window.cursedConfig = { ...cursedConfigInit };
      window.oldStorage = null;
      window.oldVersion = null;
      window.vibratorGroups = ["ItemButt", "ItemFeet", "ItemVulva", "ItemNipples", "ItemVulvaPiercings", "ItemNipplesPiercings", "ItemDevices"];
      window.brokenVibratingItems = ["MermaidSuit", "AnalHook"];

      //Tries to load configs
      try {
        oldStorage = JSON.parse(localStorage.getItem(`bc-cursedConfig-${Player.MemberNumber}`));
        oldVersion = JSON.parse(localStorage.getItem(`bc-cursedConfig-version-${Player.MemberNumber}`));
      } catch (err) { console.log(err); }

      //Pull config from log or create
      if (!oldStorage) {
        SendChat("The curse awakens on " + Player.Name + ".");
        popChatSilent("Welcome to the curse! The curse allows for many mysterious things to happen... have fun discovering them. The help command should be able to get you started (" + cursedConfig.commandChar + cursedConfig.slaveIdentifier + " help). You can also get tips by using this command: " + cursedConfig.commandChar + cursedConfig.slaveIdentifier + " tip .  There is an official discord if you have anything to say: https://discord.gg/9dtkVFP . Please report any issues or bug you encounter to ace (12401) - Ace__#5558.", "System");
        try {
          localStorage.setItem(`bc-cursedConfig-version-${Player.MemberNumber}`, currentVersion);
        } catch (err) { console.log(err); }
      } else {
        //Load previous data, takes care of upgrades or downgrades
        cursedConfig = { ...cursedConfig, ...oldStorage };

        //Set name immediately
        let user = cursedConfig.charData.filter(c => c.Number == Player.MemberNumber);
        if (user.length > 0 && user[0].Nickname) {
          if (Player.Name != user[0].Nickname && !user[0].SavedName) {
            cursedConfig.charData.filter(c => c.Number == Player.MemberNumber)[0].SavedName = Player.Name;
          }
          Player.Name = cursedConfig.hasIntenseVersion && ChatRoomSpace != "LARP" ? user[0].Nickname : user[0].SavedName;
        }

        if (oldVersion > currentVersion) {
          alert("WARNING! Downgrading the curse to an old version is not supported. This may cause issues with your settings. Please reinstall the latest version. (Ignore this message if downgrading was the recommended action to a problem.) Error: V03");
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

        if (curseTips.find(T => !cursedConfig.seenTips.includes(T.ID) && !T.isContextual)) {
          popChatSilent("There are unseen tips available. Use '" + cursedConfig.commandChar + cursedConfig.slaveIdentifier + " tip' to see one", "System");
        }
      }

      //Runs the script
      cursedConfig.isRunning = true;
      cursedConfig.onRestart = true;
      InitStartup();
      InitHelpMsg();
      InitAlteredFns();
      InitCleanup(); //Cleans up the arrays/migrations
      CursedCheckUp(); //Initial check
      ChatlogProcess(); //Chatlog handling
      ReminderProcess(); //Reminders handling
    }
  } catch (err) { console.error(err); }
}

/** Stops the script */
function CursedStopper() {
  try {
    if (cursedConfig.isRunning) {
      cursedConfig.isRunning = false;
      popChatSilent("Curse stopped", "System");
    }
  } catch (err) { console.error(err); }
}

/** Intense Mode Switch On */
function CursedIntenseOn() {
  try {
    if (!cursedConfig.hasIntenseVersion) {
      cursedConfig.hasIntenseVersion = true;
      TryPopTip(2);
      popChatSilent("Intense mode activated (risky).", "System");
    }
  } catch (err) { console.error(err); }
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
  } catch (err) { console.error(err); }

}

/** Always on mode to start on load switch on */
function AlwaysOnTurnOn() {
  localStorage.setItem("bc-cursed-always-on", "enabled");
}

/** Always on mode to start on load switch off */
function AlwaysOnTurnOff() {
  localStorage.setItem("bc-cursed-always-on", "disabled");
}
