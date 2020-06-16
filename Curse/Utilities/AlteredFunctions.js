/** Altered club functions to patch in stuff for rules (a function must be intense if it modifies something existing). These require the curse to be started once */
function InitAlteredFns() {
  //ALTERED FUNCTIONS

  // Sends a message to the server. (Chatblock)
  ServerSend = function (Message, Data) {
    let isActivated = !(cursedConfig.mistressIsHere && cursedConfig.disaledOnMistress)
            && ((cursedConfig.enabledOnMistress && cursedConfig.ownerIsHere) || !cursedConfig.enabledOnMistress) && cursedConfig.isRunning && ChatRoomSpace != "LARP";
    if (Message == "ChatRoomChat" && Data.Type == "Chat" && cursedConfig.hasIntenseVersion && cursedConfig.hasFullMuteChat && isActivated) return;
    ServerSocket.emit(Message, Data);
  };

  // Management break functions (Owner breaking block)
  let backupManagementCanBreakTrialOnline = ManagementCanBreakTrialOnline;
  ManagementCanBreakTrialOnline = function () { return ((!cursedConfig.isRunning || !cursedConfig.isLockedOwner || !cursedConfig.hasIntenseVersion) && backupManagementCanBreakTrialOnline()); };

  let backupManagementCanBeReleasedOnline = ManagementCanBeReleasedOnline;
  ManagementCanBeReleasedOnline = function () { return ((!cursedConfig.isRunning || !cursedConfig.isLockedOwner || !cursedConfig.hasIntenseVersion) && backupManagementCanBeReleasedOnline()); };

  let backupManagementCannotBeReleasedOnline = ManagementCannotBeReleasedOnline;
  ManagementCannotBeReleasedOnline = function () { return ((!cursedConfig.isRunning || !cursedConfig.isLockedOwner || !cursedConfig.hasIntenseVersion) && backupManagementCannotBeReleasedOnline()); };

  // Maid (Maid block)
  let backupMainHallMaidReleasePlayer = MainHallMaidReleasePlayer;
  MainHallMaidReleasePlayer = function () {
    if (cursedConfig.isRunning && cursedConfig.hasIntenseVersion && cursedConfig.hasNoMaid) {
      TryPopTip(36);
      MainHallMaid.CurrentDialog = DialogFind(MainHallMaid, "CannotRelease");
      return;
    }
    backupMainHallMaidReleasePlayer();
  };
  let backupPhotographicPlayerRelease = PhotographicPlayerRelease;
  PhotographicPlayerRelease = function () { 
    if (cursedConfig.isRunning && cursedConfig.hasIntenseVersion && cursedConfig.hasNoMaid) return;
    backupPhotographicPlayerRelease();
  };

  //Wearer tap in chat
  let backupChatRoomSendChat = ChatRoomSendChat;
  ChatRoomSendChat = () => {
    let isActivated = !(cursedConfig.mistressIsHere && cursedConfig.disaledOnMistress)
            && ((cursedConfig.enabledOnMistress && cursedConfig.ownerIsHere) || !cursedConfig.enabledOnMistress) && cursedConfig.isRunning && ChatRoomSpace != "LARP";

    let msg = ElementValue("InputChat").trim();
    let m = msg.toLowerCase().trim();
    let commandCall = (cursedConfig.commandChar + cursedConfig.slaveIdentifier + " ").toLowerCase();
    let isCommand = m.split("(")[0].indexOf(commandCall) != -1;
    if (m != "" && m.indexOf("/") != 0 && (isActivated || isCommand)) {
      let shouldReturn = SelfMessageCheck(m);
      if ((shouldReturn && !cursedConfig.isClassic) || isCommand) {
        document.getElementById("InputChat").value = "";
        return;
      }
    }
    backupChatRoomSendChat();
  };

  //Anti AFK
  let backupAfk = AfkTimerSetIsAfk;
  AfkTimerSetIsAfk = () => {
    let isActivated = !(cursedConfig.mistressIsHere && cursedConfig.disaledOnMistress)
            && ((cursedConfig.enabledOnMistress && cursedConfig.ownerIsHere) || !cursedConfig.enabledOnMistress) && cursedConfig.isRunning && ChatRoomSpace != "LARP";
    if (isActivated && cursedConfig.hasAntiAFK) {
      NotifyOwners("(Was AFK for more than 5 minutes and got punished accordingly.)", true);
      cursedConfig.strikes ++;
    }
    backupAfk();
  };

  //Wardrobe V2
  if (cursedConfig.hasWardrobeV2) {
    LoadAppearanceV2();
  }

  // Leashing
  let backupServerAccountBeep = ServerAccountBeep;
  ServerAccountBeep = function (data) {
    let isActivated = cursedConfig.hasIntenseVersion && cursedConfig.isRunning && ChatRoomSpace != "LARP" && cursedConfig.canLeash;
    TryPopTip(37);

    backupServerAccountBeep(data);
        
    //Single beep in capture mode
    if (isActivated && cursedConfig.capture.Valid > Date.now() && data.MemberNumber == cursedConfig.capture.capturedBy) {
      popChatGlobal(Player.Name + " was dragged out by her captor.");
      SendToRoom(data.ChatRoomName);
      popChatSilent("You have been sent to the room " + data.ChatRoomName + " by your captor, the messages above this one are from the previous room.", "System");
    }

    //Triple beep quickly to send to the beep room
    let beepLogSize = FriendListBeepLog.length;
    if (isActivated && beepLogSize >= 3) {
      let beep1 = FriendListBeepLog[beepLogSize - 3];
      let beep2 = FriendListBeepLog[beepLogSize - 2];
      let beep3 = FriendListBeepLog[beepLogSize - 1];
      if (beep1.MemberNumber == beep2.MemberNumber && beep2.MemberNumber == beep3.MemberNumber && beep3.Time - beep1.Time < 60000 && (!ChatRoomData || ChatRoomData.Name != data.ChatRoomName || CurrentScreen != "ChatRoom") && cursedConfig.owners.includes(data.MemberNumber.toString())) {
        popChatGlobal(Player.Name + " was leashed out by her owner.");
        SendToRoom(data.ChatRoomName);
        popChatSilent("You have been sent to the room " + data.ChatRoomName + " by your captor, the messages above this one are from the previous room.", "System");
      }
    }
  };

  // Orgasm Block, count and punish
  let activityOrgasmPrepareBackup = ActivityOrgasmPrepare;
  ActivityOrgasmPrepare = function (C) {
    let isActivated = cursedConfig.isRunning && ChatRoomSpace != "LARP";
    if (C.ID == 0 && isActivated) {
      if (cursedConfig.cannotOrgasm) { 
        C.ArousalSettings.Progress = 90;
        return;
      }
    }
    activityOrgasmPrepareBackup(C);
  };
    
    
  let backupActivityOrgasmStart = ActivityOrgasmStart;
  ActivityOrgasmStart = function (C) {
    let isActivated = cursedConfig.isRunning && ChatRoomSpace != "LARP";
    if (C.ID == 0 && isActivated) {
      cursedConfig.orgasms++;
      if (cursedConfig.shouldntOrgasm) { 
        cursedConfig.strikes += 15;
        SendChat("The curse on " + Player.Name + " punishes her for orgasming when her owner forbade her.");
      }
    }
    backupActivityOrgasmStart(C);
  };
    
    
    
  // Prevent leaving a room
  Player.walkBackup = Player.CanWalk;
  Player.CanWalk = function () {
    let isActivated = cursedConfig.hasIntenseVersion && cursedConfig.isRunning && ChatRoomSpace != "LARP" && cursedConfig.hasCaptureMode;
    return Player.walkBackup() && (!isActivated || cursedConfig.capture.Valid < Date.now());
  };
    
  // // Prevent interacting
  // Player.interactBackup = Player.CanInteract;
  // Player.CanInteract = function () {
  //     var isActivated = cursedConfig.hasIntenseVersion && cursedConfig.isRunning && ChatRoomSpace != "LARP";
  //     return Player.interactBackup() && (!isActivated || /* */);
  // }
    
  // // Prevent changing
  // Player.changeBackup = Player.CanChange;
  // Player.CanChange = function () {
  //     var isActivated = cursedConfig.hasIntenseVersion && cursedConfig.isRunning && ChatRoomSpace != "LARP";
  //     return Player.changeBackup() && (!isActivated || /**/);
  // }
    
  // Block new lovers
  let backupChatRoomLovershipOptionIs = ChatRoomLovershipOptionIs;
  ChatRoomLovershipOptionIs = function (Option) {
    if (cursedConfig.hasIntenseVersion && cursedConfig.isRunning && cursedConfig.isLockedNewLover) {
      TryPopTip(38);
      return false;
    }
    return backupChatRoomLovershipOptionIs(Option);
  };
    
  // Block new subs
  let backupChatRoomOwnershipOptionIs = ChatRoomOwnershipOptionIs;
  ChatRoomOwnershipOptionIs = function (Option) {
    if (cursedConfig.hasIntenseVersion && cursedConfig.isRunning && cursedConfig.isLockedNewSub) { 
      TryPopTip(39);
      return false;
    }
    return backupChatRoomOwnershipOptionIs(Option);
  };
    
  // Draw character for curse icon
  let backupChatRoomDrawCharacter = ChatRoomDrawCharacter;
  ChatRoomDrawCharacter = function (DoClick) {
    backupChatRoomDrawCharacter(DoClick);
    // Sets the X position
    let X = 0;
    let Space = 500;
    if (ChatRoomCharacter.length == 3) Space = 333;
    if (ChatRoomCharacter.length == 4) Space = 250;
    if (ChatRoomCharacter.length >= 5) Space = 200;
    if (ChatRoomCharacter.length >= 3) X = (Space / -5);

    // Sets the Y position
    let Y = 0;
    if (ChatRoomCharacter.length == 3) Y = 50;
    if (ChatRoomCharacter.length == 4) Y = 150;
    if (ChatRoomCharacter.length == 5) Y = 250;

    // Sets the zoom factor
    let Zoom = 1;
    if (ChatRoomCharacter.length == 3) Zoom = 0.9;
    if (ChatRoomCharacter.length == 4) Zoom = 0.7;
    if (ChatRoomCharacter.length >= 5) Zoom = 0.5;
    for (let C = 0; C < ChatRoomCharacter.length; C++) {
      if (!DoClick && !cursedConfig.hasHiddenDisplay && ChatRoomCharacter[C].MemberNumber != Player.MemberNumber) {
        if (
          ChatRoomCharacter[C].MemberNumber != null
                    && Array.isArray(ChatRoomCharacter[C].Inventory)
                    && ChatRoomCharacter[C].Inventory.filter(A => A.Name == "Curse").length > 0
        ) {
          ChatRoomCharacter[C].isCursed = true;
          DrawText("C", (C % 5) * Space + X + 250 * Zoom, 25 + Y + Math.floor(C / 5) * 1000, "White");
          TryPopTip(40);
        }
      }
    }
  };
}

/** Altered functions that do *NOT* require cursedConfig */
function InitBasedFns() {
  //Custom Room 
  let backupMainHallRun = MainHallRun;
  MainHallRun = () => {
    DrawButton(45, 665, 90, 90, "", "White", "Icons/Question.png", "Bunny hole?");
    backupMainHallRun();
  };

  let backupMainHallClick = MainHallClick;
  MainHallClick = () => {
    if ((MouseX >= 45) && (MouseX < 135) && (MouseY >= 665) && (MouseY < 755)) {
      CurseRoomAce = null;
      CurseRoomRun();
      CurrentScreen = "CurseRoom";
    }
    backupMainHallClick();
  };
}