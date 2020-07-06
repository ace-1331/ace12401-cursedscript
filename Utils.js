//************************************Callbacks************************************

//Boot up sequence
window.currentVersion = 36;
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
      InitCursedConfig();
      window.cursedConfig = { ...cursedConfigInit };
      window.oldStorage = null;
      window.oldVersion = null;
      window.vibratorGroups = ["ItemButt", "ItemFeet", "ItemVulva", "ItemNipples", "ItemVulvaPiercings", "ItemNipplesPiercings", "ItemDevices"];
      window.brokenVibratingItems = ["MermaidSuit", "AnalHook"];

      //Tries to load configs
      let beforeParseStorage = null;
      let beforeParseVersion = null;
      try {
        beforeParseStorage = localStorage.getItem(`bc-cursedConfig-${Player.MemberNumber}`);
        beforeParseVersion = localStorage.getItem(`bc-cursedConfig-version-${Player.MemberNumber}`);
        oldStorage = JSON.parse(beforeParseStorage);
        oldVersion = JSON.parse(beforeParseVersion);
      } catch (err) {
        console.log(err);
        alert(`CURSE ERROR: Invalid Configs Detected. Your stored data for #${Player.MemberNumber} could not be parsed and was reset. View the console to recover your flushed data. Error: M08`);
        console.log(`Flushed data for #${Player.MemberNumber}: ${beforeParseStorage}`);
        console.warn(`You can fix your data and re-inject it through the console. This is a risky manipulation.`);
      }

      //Pull config from log or create
      if (!oldStorage) {
        SendChat("The curse awakens on " + Player.Name + ".");
        popChatSilent("Welcome to the curse! The curse allows for many mysterious things to happen... have fun discovering them. The help command should be able to get you started (" + cursedConfig.commandChar + cursedConfig.slaveIdentifier + " help). You can also get tips by using this command: " + cursedConfig.commandChar + cursedConfig.slaveIdentifier + " tip .  There is an official discord if you have anything to say: https://discord.gg/9dtkVFP . Please report any issues or bug you encounter to ace (12401) - Ace__#5558 or on the discord server.", "System");
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
          popChatSilent("You have loaded an updated version of the curse, make sure you have refreshed your page before using this version. Please report any new bugs on discord https://discord.gg/9dtkVFP. This update may have introduced new features, don't forget to use the help command to see the available commands. (" + cursedConfig.commandChar + cursedConfig.slaveIdentifier + " help)", "System");
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
