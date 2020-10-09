/** Altered club functions to patch in stuff for rules (a function must be intense if it modifies something existing). These require the curse to be started once */
function InitAlteredFns() {
  //ALTERED FUNCTIONS

  if (cursedConfig.hasCommandsV2) {
    LoadCommandsV2();
  }
  
  // Sends a message to the server. (Chatblock)
  ServerSend = function (Message, Data) {
    let isActivated = !(cursedConfig.mistressIsHere && cursedConfig.disaledOnMistress)
      && ((cursedConfig.enabledOnMistress && cursedConfig.ownerIsHere) || !cursedConfig.enabledOnMistress) && cursedConfig.isRunning && ChatRoomSpace != "LARP";
    if (Message == "ChatRoomChat" && Data.Type == "Chat" && cursedConfig.hasIntenseVersion && cursedConfig.hasFullMuteChat && isActivated) return;
    ServerSocket.emit(Message, Data);
  };

  // Management break functions (Owner breaking block)
  if (window.ManagementCanBreakTrialOnline) {
    let backupManagementCanBreakTrialOnline = ManagementCanBreakTrialOnline;
    ManagementCanBreakTrialOnline = function (...rest) { return ((!cursedConfig.isRunning || !cursedConfig.isLockedOwner || !cursedConfig.hasIntenseVersion) && backupManagementCanBreakTrialOnline(...rest)); };
  }

  if (window.ManagementCanBeReleasedOnline) {
    let backupManagementCanBeReleasedOnline = ManagementCanBeReleasedOnline;
    ManagementCanBeReleasedOnline = function (...rest) { return ((!cursedConfig.isRunning || !cursedConfig.isLockedOwner || !cursedConfig.hasIntenseVersion) && backupManagementCanBeReleasedOnline(...rest)); };
  }

  if (window.ManagementCannotBeReleasedOnline) {
    let backupManagementCannotBeReleasedOnline = ManagementCannotBeReleasedOnline;
    ManagementCannotBeReleasedOnline = function (...rest) { return ((!cursedConfig.isRunning || !cursedConfig.isLockedOwner || !cursedConfig.hasIntenseVersion) && backupManagementCannotBeReleasedOnline(...rest)); };
  }

  // NPC rescues
  if (window.MainHallMaidReleasePlayer) {
    let backupMainHallMaidReleasePlayer = MainHallMaidReleasePlayer;
    MainHallMaidReleasePlayer = function (...rest) {
      if (cursedConfig.isRunning && cursedConfig.hasIntenseVersion && cursedConfig.hasNoMaid) {
        TryPopTip(36);
        MainHallMaid.CurrentDialog = DialogFind(MainHallMaid, "CannotRelease");
        return;
      }
      backupMainHallMaidReleasePlayer(...rest);
    };
  }

  if (window.PhotographicPlayerRelease) {
    let backupPhotographicPlayerRelease = PhotographicPlayerRelease;
    PhotographicPlayerRelease = function (...rest) {
      if (cursedConfig.isRunning && cursedConfig.hasIntenseVersion && cursedConfig.hasNoMaid) return;
      backupPhotographicPlayerRelease(...rest);
    };
  }

  if (window.ManagementAllowReleaseChastity) {
    let backupManagementAllowReleaseChastity = ManagementAllowReleaseChastity;
    ManagementAllowReleaseChastity = function (...rest) {
      if (cursedConfig.isRunning && cursedConfig.hasIntenseVersion && cursedConfig.hasNoMaid) return false;
      return backupManagementAllowReleaseChastity(...rest);
    };
  }
  if (window.MainHallMaidShamePlayer) {
    let backupMainHallMaidShamePlayer = MainHallMaidShamePlayer;
    MainHallMaidShamePlayer = function (...rest) {
      if (cursedConfig.isRunning && cursedConfig.hasIntenseVersion && cursedConfig.hasNoMaid) {
        TryPopTip(36);
        MainHallMaid.CurrentDialog = DialogFind(MainHallMaid, "CannotRelease");
        return;
      }
      backupMainHallMaidShamePlayer(...rest);
    };
  }

  if (window.GamblingRun) {
    let backupGamblingRun = GamblingRun;
    GamblingRun = function (...rest) {
      if (cursedConfig.isRunning && cursedConfig.hasIntenseVersion && cursedConfig.hasNoMaid) {
        alert(GT(Player.MemberNumber, {Tag: "NoRescueGambling"}));
        CommonSetScreen("Room", "MainHall");

        return;
      }
      backupGamblingRun(...rest);
    };
  }
  if (window.NurseryRun) {
    let backupNurseryRun = NurseryRun;
    NurseryRun = function (...rest) {
      if (cursedConfig.isRunning && cursedConfig.hasIntenseVersion && cursedConfig.hasNoMaid) {
        alert(GT(Player.MemberNumber, {Tag: "NoRescueNursery"}));
        CommonSetScreen("Room", "MainHall");

        return;
      }
      backupNurseryRun(...rest);
    };
  }

  //Wearer tap in chat
  if (window.ChatRoomSendChat) {
    let backupChatRoomSendChat = ChatRoomSendChat;
    ChatRoomSendChat = (...rest) => {
      let isActivated = !(cursedConfig.mistressIsHere && cursedConfig.disaledOnMistress)
        && ((cursedConfig.enabledOnMistress && cursedConfig.ownerIsHere) || !cursedConfig.enabledOnMistress) && cursedConfig.isRunning && ChatRoomSpace != "LARP";

      let msg = ElementValue("InputChat").trim();
      let m = msg.toLowerCase().trim();
      let commandCall = (cursedConfig.commandChar + cursedConfig.slaveIdentifier + " ").toLowerCase();
      let isCommand = m.split("(")[0].indexOf(commandCall) != -1;
      if (m != "" && m.indexOf("/") != 0 && (isActivated || isCommand)) {
        let shouldReturn = SelfMessageCheck(m);
        if ((shouldReturn && !cursedConfig.isClassic) || isCommand) {
          if (cursedConfig.mustRetype) document.getElementById("InputChat").value = "";
          return;
        }
      }
      backupChatRoomSendChat(...rest);
    };
  }

  //Anti AFK
  if (window.AfkTimerSetIsAfk) {
    let backupAfk = AfkTimerSetIsAfk;
    AfkTimerSetIsAfk = (...rest) => {
      let isActivated = !(cursedConfig.mistressIsHere && cursedConfig.disaledOnMistress)
        && ((cursedConfig.enabledOnMistress && cursedConfig.ownerIsHere) || !cursedConfig.enabledOnMistress) && cursedConfig.isRunning && ChatRoomSpace != "LARP";
      if (isActivated && cursedConfig.hasAntiAFK) {
        NotifyOwners({ Tag: "AFKTimerTrigger" }, true);
        TriggerPunishment(3);
      }
      backupAfk(...rest);
    };
  }

  //Wardrobe V2
  if (cursedConfig.hasWardrobeV2 && window.AnimationGetDynamicDataName) {
    // LoadAppearanceV2();
  }

  // Leashing
  if (window.ServerAccountBeep) {
    let backupServerAccountBeep = ServerAccountBeep;
    ServerAccountBeep = function (data) {
      let isActivated = cursedConfig.hasIntenseVersion && cursedConfig.isRunning && ChatRoomSpace != "LARP" && cursedConfig.canLeash;
      TryPopTip(37);

      backupServerAccountBeep(data);

      //Single beep in capture mode
      if (isActivated && cursedConfig.capture.Valid > Date.now() && data.MemberNumber == cursedConfig.capture.capturedBy) {
        popChatGlobal({ Tag: "DraggedOutAction"});
        SendToRoom(data);
        popChatSilent({ Tag: "DraggedOutWearerCapture", Param: [data.ChatRoomName] });
      }

      //Triple beep quickly to send to the beep room
      let beepLogSize = FriendListBeepLog.length;
      if (isActivated && beepLogSize >= 3) {
        let beep1 = FriendListBeepLog[beepLogSize - 3];
        let beep2 = FriendListBeepLog[beepLogSize - 2];
        let beep3 = FriendListBeepLog[beepLogSize - 1];
        if (beep1.MemberNumber == beep2.MemberNumber && beep2.MemberNumber == beep3.MemberNumber && beep3.Time - beep1.Time < 60000 && (!ChatRoomData || ChatRoomData.Name != data.ChatRoomName || CurrentScreen != "ChatRoom") && ((Player.Ownership && Player.Ownership.MemberNumber == data.MemberNumber) || cursedConfig.owners.includes(data.MemberNumber.toString()))) {
          popChatGlobal({ Tag: "LeashAction"});
          SendToRoom(data);
          popChatSilent({ Tag: "LeashWearer", Param: [data.ChatRoomName] });
        }
      }
    };
  }

  // Orgasm Block, count and punish
  if (window.ActivityOrgasmPrepare) {
    let activityOrgasmPrepareBackup = ActivityOrgasmPrepare;
    ActivityOrgasmPrepare = function (...rest) {
      let isActivated = cursedConfig.isRunning && ChatRoomSpace != "LARP";
      if (rest[0].ID == 0 && isActivated) {
        if (cursedConfig.cannotOrgasm) {
          rest[0].ArousalSettings.Progress = 90;
          return;
        }
      }
      activityOrgasmPrepareBackup(...rest);
    };
  }

  if (window.ActivityOrgasmStart) {
    let backupActivityOrgasmStart = ActivityOrgasmStart;
    ActivityOrgasmStart = function (...rest) {
      let isActivated = cursedConfig.isRunning && ChatRoomSpace != "LARP";
      if (rest[0].ID == 0 && isActivated) {
        cursedConfig.orgasms++;
        if (cursedConfig.forbidorgasm) {
          TriggerPunishment(4);
          SendChat({ Tag: "PunishOrgasm" });
        }
      }
      backupActivityOrgasmStart(...rest);
    };
  }

  // Always slow
  if (Player.IsSlow) {
    Player.isSlowBackup = Player.IsSlow;
    Player.IsSlow = function (...rest) {
      let isActivated = cursedConfig.isRunning && ChatRoomSpace != "LARP" && cursedConfig.hasFullSlowMode;
      if (isActivated) return true;
      return Player.isSlowBackup(...rest);
    };
  }
  
  // Prevent leaving a room
  if (Player.CanWalk) {
    Player.walkBackup = Player.CanWalk;
    Player.CanWalk = function (...rest) {
      let isActivated =  cursedConfig.isRunning && ChatRoomSpace != "LARP";
      let isTriggered = cursedConfig.triggerWord.lastTrigger + cursedConfig.triggerWord.triggerDuration > Date.now();
      return Player.walkBackup(...rest) && (!(isActivated && cursedConfig.hasIntenseVersion && cursedConfig.hasCaptureMode) || cursedConfig.capture.Valid < Date.now()) && (!isActivated || !isTriggered);
    };
  }

  // Prevent interacting
  Player.interactBackup = Player.CanInteract;
  Player.CanInteract = function () {
    let isActivated = cursedConfig.isRunning && ChatRoomSpace != "LARP";
    let isTriggered = cursedConfig.triggerWord.lastTrigger + cursedConfig.triggerWord.triggerDuration > Date.now();
    return Player.interactBackup() && (!isActivated || !isTriggered);
  }
  
  Player.kneelBackup = Player.CanKneel;
  Player.CanKneel = function () {
    let isActivated = cursedConfig.isRunning && ChatRoomSpace != "LARP";
    let isTriggered = cursedConfig.triggerWord.lastTrigger + cursedConfig.triggerWord.triggerDuration > Date.now();
    return Player.kneelBackup() && (!isActivated || !isTriggered);
  }

  // Prevent changing
  Player.changeBackup = Player.CanChange;
  Player.CanChange = function () {
    let isActivated = cursedConfig.isRunning && ChatRoomSpace != "LARP";
    let isTriggered = cursedConfig.triggerWord.lastTrigger + cursedConfig.triggerWord.triggerDuration > Date.now();
    return Player.changeBackup() && (!isActivated || !isTriggered);
  }

  // Block new lovers
  if (window.ChatRoomLovershipOptionIs) {
    let backupChatRoomLovershipOptionIs = ChatRoomLovershipOptionIs;
    ChatRoomLovershipOptionIs = function (...rest) {
      if (cursedConfig.hasIntenseVersion && cursedConfig.isRunning && ChatRoomSpace != "LARP" && cursedConfig.isLockedNewLover) {
        TryPopTip(38);
        return false;
      }
      return backupChatRoomLovershipOptionIs(...rest);
    };
  }

  // Block new subs
  if (window.ChatRoomOwnershipOptionIs) {
    let backupChatRoomOwnershipOptionIs = ChatRoomOwnershipOptionIs;
    ChatRoomOwnershipOptionIs = function (...rest) {
      if (cursedConfig.hasIntenseVersion && cursedConfig.isRunning && ChatRoomSpace != "LARP" && cursedConfig.isLockedNewSub) {
        TryPopTip(39);
        return false;
      }
      return backupChatRoomOwnershipOptionIs(...rest);
    };
  }

  // Draw character for curse icon
  if (window.ChatRoomDrawCharacter) {
    let backupChatRoomDrawCharacter = ChatRoomDrawCharacter;
    ChatRoomDrawCharacter = function (...rest) {
      backupChatRoomDrawCharacter(...rest);
      // Determine the horizontal & vertical position and zoom levels to fit all characters evenly in the room
      var Space = ChatRoomCharacter.length >= 2 ? 1000 / Math.min(ChatRoomCharacter.length, 5) : 500;
      var Zoom = ChatRoomCharacter.length >= 3 ? Space / 400 : 1;
      var X = ChatRoomCharacter.length >= 3 ? (Space - 500 * Zoom) / 2 : 0;
      var Y = ChatRoomCharacter.length <= 5 ? 1000 * (1 - Zoom) / 2 : 0;
      
      for (let C = 0; C < ChatRoomCharacter.length; C++) {
        var CharX = X + (C % 5) * Space;
        var CharY = Y + Math.floor(C / 5) * 500;
        if (!cursedConfig.hasHiddenDisplay && ChatRoomCharacter[C].MemberNumber != Player.MemberNumber) {
          if (
            ChatRoomCharacter[C].MemberNumber != null
            && Array.isArray(ChatRoomCharacter[C].Inventory)
            && ChatRoomCharacter[C].Inventory.find(A => A.Name == "Curse")
          ) {
            // Asign the C or ?
            ChatRoomCharacter[C].isCursed = ChatRoomCharacter[C].Inventory.find(A => A.Name == "Curse" + currentVersion) ? "C" : "?";
            ChatRoomCharacter[C].isCursed === "C" ? TryPopTip(40) : TryPopTip(49);
            //DrawText(ChatRoomCharacter[C].isCursed, (C % 5) * Space + X + 250 * Zoom, (25 + Y) + (Math.floor(C / 5) * 1000), ChatRoomCharacter[C].isCursed === "C" ? "White" : "Red");
            DrawText(ChatRoomCharacter[C].isCursed, CharX + 250 * Zoom, CharY + 20, ChatRoomCharacter[C].isCursed === "C" ? "White" : "Red");
          }
        }
      }
    };
  }

  // Hide arousal meter
  if (window.DrawArousalMeter) {
    let backupDrawArousalMeter = DrawArousalMeter;
    DrawArousalMeter = function (...rest) {
      if (cursedConfig.hasIntenseVersion && cursedConfig.isRunning && cursedConfig.hasSecretOrgasm) {
        return;
      }
      backupDrawArousalMeter(...rest);
    };
  }

  // Special vibrator modes disabled with cursed orgasms
  if (window.VibratorModeScriptDraw) {
    let backupVibratorModeScriptDraw = VibratorModeScriptDraw;
    VibratorModeScriptDraw = function (...rest) {
      if (cursedConfig.isRunning && cursedConfig.hasCursedOrgasm) {
        return;
      }
      backupVibratorModeScriptDraw(...rest);
    };
  }
  
  // DeafImmune
  if (window.SpeechGarble) {
    let backupSpeechGarble = SpeechGarble;
    SpeechGarble = function (...rest) {
      Player.backupDefLevel = Player.GetDeafLevel;

      if (cursedConfig.isRunning && ChatRoomSpace != "LARP" && cursedConfig.deafImmune.find(MN => rest[0].MemberNumber == MN)) {
        Player.GetDeafLevel = () => 0;
      }
      var garbledSpeech = backupSpeechGarble(...rest);

      Player.GetDeafLevel = Player.backupDefLevel;
      return garbledSpeech;
    };
  }

  // Asylum bedroom lockdown
  if (window.AsylumBedroomLoad) {
    let backupAsylumBedroomLoad = AsylumBedroomLoad;
    AsylumBedroomLoad = function (...rest) {
      if (cursedConfig.hasIntenseVersion && cursedConfig.isRunning && cursedConfig.hasAsylumLockdown) {
        let oldLog = [...cursedConfig.chatlog];
        let oldTransgressions = [...cursedConfig.transgressions];
        //Process the required things
        if (AppearanceCheck() || cursedConfig.mustRefresh) {
          //Reloads Char for free
          CharacterRefresh(Player, false);
          cursedConfig.mustRefresh = false;
          cursedConfig.toUpdate = [];
          //Resumes as normal
          cursedConfig.chatlog = oldLog;
          cursedConfig.transgressions = oldTransgressions;
        }
      }
      DrawCustomBeepText(GT(Player.MemberNumber, { Tag: "AsylumLockdownActive" }));
      backupAsylumBedroomLoad(...rest);
    };
  }
  
  // Garbled whispers
  
  if (window.ChatRoomTarget) {
    let backupChatRoomTarget = ChatRoomTarget;
    ChatRoomTarget = function (...rest) {
      backupChatRoomTarget(...rest);
      if (cursedConfig.isRunning && cursedConfig.garbledNames && ChatRoomTargetMemberNumber && Array.isArray(Player.Effect) && Player.IsBlind()) {
        document.getElementById("InputChat").placeholder = TextGet("WhisperTo") + " ???";
      }
    };
  }
}

/** Altered functions that do *NOT* require cursedConfig */
function InitBasedFns() {
  //Custom Room 
  if (window.MainHallRun) {
    let backupMainHallRun = MainHallRun;
    MainHallRun = (...rest) => {
      DrawButton(45, 665, 90, 90, "", "White", "Icons/Question.png", "Bunny hole?");
      backupMainHallRun(...rest);
    };
  }

  if (window.MainHallClick) {
    let backupMainHallClick = MainHallClick;
    MainHallClick = (...rest) => {
      if (MouseIn(45, 665, 135 - 45, 755 - 665)) {
        CurrentScreen = "CurseRoom";
        CurseRoomRun();
      }
      backupMainHallClick(...rest);
    };
  }
}