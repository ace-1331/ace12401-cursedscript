//************************************ LOOP LOGIC ************************************//

/** Main curse loop to prepare data and patch it through the right areas */
async function CursedCheckUp() {
  // Stays Idle if the curse is disabled
  if (!cursedConfig.isRunning) {
    setTimeout(CursedCheckUp, 10000);
    return;
  }

  // Pop missed silent chats
  if (cursedConfig.shouldPopSilent) {
    popChatSilent();
  }

  //Gets the messages
  let messagesToVerify = [];
    
  //Checks settings
  AdjustSettings();

  // DC Prevention
  delete cursedConfig.lastChatroom;
  if (cursedConfig.hasIntenseVersion && cursedConfig.hasDCPrevention && !Player.CanWalk() && ChatRoomData && ChatRoomData.Name) {
    cursedConfig.lastChatroom = ChatRoomData.Name;
  }
    
  //Run the script only in chatrooms
  if (window.CurrentScreen == "ChatRoom") {
    messagesToVerify = document.querySelectorAll(".ChatMessage:not([verified=true]");
        
    //LARP Warn
    if (ChatRoomSpace == "LARP" && !cursedConfig.wasLARPWarned) {
      popChatSilent("LARP Room detected: the curse is inactive in this room", "System");
      //Only pop the message once per LARP room, and reset the curse items when going back in a normal room 
      cursedConfig.wasLARPWarned = true;
      cursedConfig.onRestart = true;
      TryPopTip(28);
    }

    //When it should be ran 
    if (ChatRoomSpace != "LARP") {

      //Remove expired curses
      cursedConfig.cursedAppearance.forEach(({ name, group, dateOfRemoval }) => {
        if (dateOfRemoval && dateOfRemoval < Date.now()) {
          toggleCurseItem({ name, group, forceRemove: true });
        }
      });

      //Running the normal curse
      if (!cursedConfig.onRestart) {
        cursedConfig.wasLARPWarned = false;

        //Triggers the function for unverified messages
        messagesToVerify.forEach(msg => {
          AnalyzeMessage(msg);

          // Marks message as verified
          let verifiedAtt = document.createAttribute("verified");
          verifiedAtt.value = "true";
          msg.setAttributeNode(verifiedAtt);
        });

        //Runs only if something happened
        if (messagesToVerify.length > 0) {
          // Appearance checks & punishment application outside of LARP
          // Functions return true if something changed, so refresh or procs will notify with var
          if (AppearanceCheck() || PunishmentCheck() || cursedConfig.mustRefresh) {
            //Reloads Char
            CharacterLoadEffect(Player);
            ChatRoomCharacterUpdate(Player);
            /*let before = cursedConfig.toUpdate.length;
                        cursedConfig.toUpdate = cursedConfig.toUpdate.filter((g, i) => cursedConfig.toUpdate.indexOf(g) === i);
                        if (before - cursedConfig.toUpdate.length > 0) {
                            popChatSilent("Warning: The curse tried to apply more than one curse to the same slot. You may have configuration issues. Please disable the curse if it's spamming. Error: WA01");
                        }
                        cursedConfig.toUpdate.forEach(group => {
                            ChatRoomCharacterItemUpdate(Player, group);
                        });*/
            cursedConfig.mustRefresh = false;
            cursedConfig.toUpdate = [];
          }
        }
      }

      //Running the curse on restart for fairness
      if (cursedConfig.onRestart) {
        let oldLog = [...cursedConfig.chatlog];
        let oldStrikes = cursedConfig.strikes;
        //Process the required things
        if (AppearanceCheck() || cursedConfig.mustRefresh) {
          //Reloads Char for free
          CharacterLoadEffect(Player);
          ChatRoomCharacterUpdate(Player);
          /*let before = cursedConfig.toUpdate.length;
                    cursedConfig.toUpdate = cursedConfig.toUpdate.filter((g, i) => cursedConfig.toUpdate.indexOf(g) === i);
                    if (before - cursedConfig.toUpdate.length > 0) {
                        popChatSilent("Warning: The curse tried to apply more than one curse to the same slot. You may have configuration issues. Please disable the curse if it's spamming. Error: WA01");
                    }
                    cursedConfig.toUpdate.forEach(group => {
                        ChatRoomCharacterItemUpdate(Player, group);
                    });*/
          cursedConfig.mustRefresh = false;
          cursedConfig.toUpdate = [];
          //Resumes as normal
          cursedConfig.chatlog = oldLog;
          cursedConfig.strikes = oldStrikes;
          popChatSilent("Your current curses have been applied with no punishments.", "System");
          TryPopTip(29);
        }
        cursedConfig.onRestart = false;
      }
    }
  }

  // Saves if needed, strip not required data
  if (messagesToVerify.length > 0) {
    SaveConfigs();
  }

  // Loops
  setTimeout(CursedCheckUp, 1200);
}

/** Function to process the chat message queue */
async function ChatlogProcess() {
  //Optimizes send times, removes fast dupes, keeps the order, does not work while restarting
  let purged = 0;
  if (cursedConfig.chatlog.length != 0 && !cursedConfig.onRestart) {
    let actionTxt = cursedConfig.chatlog.shift();
    let before = cursedConfig.chatlog.length;
    cursedConfig.chatlog = cursedConfig.chatlog.filter(el => el != actionTxt);
    purged = before - cursedConfig.chatlog.length;
    popChatGlobal(actionTxt);
    cursedConfig.chatStreak++;
  } else {
    cursedConfig.chatStreak = 0;
  }

  //Spam block 
  if (cursedConfig.chatStreak > 5 || purged > 3) {
    cursedConfig.isRunning = false;
    cursedConfig.chatlog = [];
    popChatSilent("ERROR S011: Spam detected, the curse sent too many messages too quickly, it has been disabled. Please correct the issue before re-enabling the script. If it was a bug, please contact Ace__#5558 on discord", "Error");
  }
  setTimeout(ChatlogProcess, 500);
}

/** Function to display reminders. Will not loop if reminders are not enabled */
async function ReminderProcess() {
  if (!cursedConfig.hasReminders) {
    return;
  }
  if (cursedConfig.isRunning && cursedConfig.reminders.length > 0 && CurrentScreen == "ChatRoom" && ChatRoomSpace != "LARP") {
    TryPopTip(30);
    let reminder = cursedConfig.reminders[Math.floor(Math.random() * cursedConfig.reminders.length)];
    popChatSilent(reminder, "Reminder");
  }
  cursedConfig.reminderInterval < 60000 ? cursedConfig.reminderInterval = 60000 : "";
  setTimeout(ReminderProcess, cursedConfig.reminderInterval);
}