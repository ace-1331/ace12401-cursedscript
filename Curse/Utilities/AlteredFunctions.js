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
        var commandCall = (cursedConfig.commandChar + cursedConfig.slaveIdentifier + " ").toLowerCase();
        var isCommand =  m.split("(")[0].indexOf(commandCall) != -1;
        if (m != "" && m.indexOf("/") != 0 && (isActivated || isCommand)) {
            var shouldReturn = SelfMessageCheck(m);
            if ((shouldReturn && !cursedConfig.isClassic) || isCommand) {
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

    // Leashing
    let backupServerAccountBeep = ServerAccountBeep;
    ServerAccountBeep = function (data) {
        var isActivated = cursedConfig.hasIntenseVersion && cursedConfig.isRunning && ChatRoomSpace != "LARP" && cursedConfig.canLeash;
        
        backupServerAccountBeep(data);
        
        //Triple beep quickly to send to the beep room
        let beepLogSize = FriendListBeepLog.length;
        if (isActivated && beepLogSize >= 3) {
            let beep1 = FriendListBeepLog[beepLogSize - 3];
            let beep2 = FriendListBeepLog[beepLogSize - 2];
            let beep3 = FriendListBeepLog[beepLogSize - 1];
            if (beep1.MemberNumber == beep2.MemberNumber && beep2.MemberNumber == beep3.MemberNumber && beep3.Time - beep1.Time < 60000 && (!ChatRoomData || ChatRoomData.Name != data.ChatRoomName) && cursedConfig.owners.includes(data.MemberNumber.toString())) { 
                popChatGlobal(Player.Name + " was leashed out by their owner.");
                ServerSend("ChatRoomJoin", { Name: data.ChatRoomName });
                ElementRemove("FriendList");
                CommonSetScreen("Online", "ChatRoom");
                popChatSilent("You have been sent to the room " + data.ChatRoomName + " by one of your owners. Any messages above this message is from the previous room.");
            }
        }
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