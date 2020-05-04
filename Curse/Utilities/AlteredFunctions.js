function InitAlteredFns() {
    //ALTERED FUNCTIONS

    // Sends a message to the server. (Chatblock)
    ServerSend = function (Message, Data) {
        var isActivated = !(cursedConfig.mistressIsHere && cursedConfig.disaledOnMistress)
            && ((cursedConfig.enabledOnMistress && cursedConfig.ownerIsHere) || !cursedConfig.enabledOnMistress) && cursedConfig.isRunning && ChatRoomSpace != "LARP"
        if (Message == "ChatRoomChat" && Data.Type == "Chat" && cursedConfig.hasIntenseVersion && cursedConfig.hasFullMuteChat && isActivated) return;
        ServerSocket.emit(Message, Data);
    }

    // Management break functions (Owner breaking block)
    ManagementCanBreakTrialOnline = function () { return ((!cursedConfig.isRunning || !cursedConfig.isLockedOwner || !cursedConfig.hasIntenseVersion) && (Player.Owner == "") && (Player.Ownership != null) && (Player.Ownership.Stage != null) && (Player.Ownership.Stage == 0)) }
    ManagementCanBeReleasedOnline = function () { return ((!cursedConfig.isRunning || !cursedConfig.isLockedOwner || !cursedConfig.hasIntenseVersion) && (Player.Owner != "") && (Player.Ownership != null) && (Player.Ownership.Start != null) && (Player.Ownership.Start + 604800000 <= CurrentTime)) }
    ManagementCannotBeReleasedOnline = function () { return ((!cursedConfig.isRunning || !cursedConfig.isLockedOwner || !cursedConfig.hasIntenseVersion) && (Player.Owner != "") && (Player.Ownership != null) && (Player.Ownership.Start != null) && (Player.Ownership.Start + 604800000 > CurrentTime)) }

    // Maid (Maid block)
    MainHallMaidReleasePlayer = function () {
        if (MainHallMaid.CanInteract() && (!cursedConfig.isRunning || !cursedConfig.hasIntenseVersion || !cursedConfig.hasNoMaid)) {
            for (var D = 0; D < MainHallMaid.Dialog.length; D++)
                if ((MainHallMaid.Dialog[D].Stage == "0") && (MainHallMaid.Dialog[D].Option == null))
                    MainHallMaid.Dialog[D].Result = DialogFind(MainHallMaid, "AlreadyReleased");
            CharacterRelease(Player);
            MainHallMaid.Stage = "10";
        } else MainHallMaid.CurrentDialog = DialogFind(MainHallMaid, "CannotRelease");
    }
    
    //Wearer tap in chat
    let backupChatRoomSendChat = ChatRoomSendChat;
    ChatRoomSendChat = () => {
        var isActivated = !(cursedConfig.mistressIsHere && cursedConfig.disaledOnMistress)
            && ((cursedConfig.enabledOnMistress && cursedConfig.ownerIsHere) || !cursedConfig.enabledOnMistress) && cursedConfig.isRunning && ChatRoomSpace != "LARP"
        
        var msg = ElementValue("InputChat").trim();
        var m = msg.toLowerCase().trim();
        if (m != "" && m.indexOf("/") != 0 && isActivated) { 
            if (SelfMessageCheck(m) && !cursedConfig.isClassic) { 
                document.getElementById('InputChat').value = "";
                return;
            }
        }
        backupChatRoomSendChat();
    }
    
    //Anti AFK
    let backupAfk = AfkTimerSetIsAfk;
    AfkTimerSetIsAfk = () => { 
        var isActivated = !(cursedConfig.mistressIsHere && cursedConfig.disaledOnMistress)
            && ((cursedConfig.enabledOnMistress && cursedConfig.ownerIsHere) || !cursedConfig.enabledOnMistress) && cursedConfig.isRunning && ChatRoomSpace != "LARP"
        if (isActivated && cursedConfig.hasAntiAFK) { 
            NotifyOwners("(Was AFK for more than 5 minutes and got punished accordingly.)", true);
            cursedConfig.strikes += 5;
        }
        backupAfk();
    }
    
    //Wardrobe V2
    if (cursedConfig.hasWardrobeV2) { 
        LoadAppearanceV2();
    }
}

function InitBasedFns() { 
    //Custom Room 
    let backupMainHallRun = MainHallRun;
    MainHallRun = () => {
        DrawButton(45, 665, 90, 90, "", "White", "Icons/Question.png", "Bunny hole?");
        backupMainHallRun();
    }
    
    let backupMainHallClick = MainHallClick;
    MainHallClick = () => {
        if ((MouseX >= 45) && (MouseX < 135) && (MouseY >= 665) && (MouseY < 755)) { 
            CurseRoomAce = null;
            CurseRoomRun();
            CurrentScreen = "CurseRoom";
        }
        backupMainHallClick();
    }
}