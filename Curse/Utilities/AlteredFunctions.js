/** Altered club functions to patch in stuff for rules (a function must be intense if it modifies something existing). These require the curse to be started once */
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
    let backupManagementCanBreakTrialOnline = ManagementCanBreakTrialOnline;
    ManagementCanBreakTrialOnline = function () { return ((!cursedConfig.isRunning || !cursedConfig.isLockedOwner || !cursedConfig.hasIntenseVersion) && backupManagementCanBreakTrialOnline()) }
    
    let backupManagementCanBeReleasedOnline = ManagementCanBeReleasedOnline;
    ManagementCanBeReleasedOnline = function () { return ((!cursedConfig.isRunning || !cursedConfig.isLockedOwner || !cursedConfig.hasIntenseVersion) && backupManagementCanBeReleasedOnline()) }
    
    let backupManagementCannotBeReleasedOnline = ManagementCannotBeReleasedOnline;
    ManagementCannotBeReleasedOnline = function () { return ((!cursedConfig.isRunning || !cursedConfig.isLockedOwner || !cursedConfig.hasIntenseVersion) && backupManagementCannotBeReleasedOnline()) }

    // Maid (Maid block)
    let backupMainHallMaidReleasePlayer = MainHallMaidReleasePlayer;
    MainHallMaidReleasePlayer = function () {
        if (cursedConfig.isRunning && cursedConfig.hasIntenseVersion && cursedConfig.hasNoMaid) { 
            MainHallMaid.CurrentDialog = DialogFind(MainHallMaid, "CannotRelease");
            return;
        }
        backupMainHallMaidReleasePlayer();
    }

    //Wearer tap in chat
    let backupChatRoomSendChat = ChatRoomSendChat;
    ChatRoomSendChat = () => {
        var isActivated = !(cursedConfig.mistressIsHere && cursedConfig.disaledOnMistress)
            && ((cursedConfig.enabledOnMistress && cursedConfig.ownerIsHere) || !cursedConfig.enabledOnMistress) && cursedConfig.isRunning && ChatRoomSpace != "LARP"

        var msg = ElementValue("InputChat").trim();
        var m = msg.toLowerCase().trim();
        var commandCall = (cursedConfig.commandChar + cursedConfig.slaveIdentifier + " ").toLowerCase();
        var isCommand = m.split("(")[0].indexOf(commandCall) != -1;
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

        //Single beep in capture mode
        if (isActivated && cursedConfig.capture.Valid > Date.now() && data.MemberNumber == cursedConfig.capture.capturedBy) {
            popChatGlobal(Player.Name + " was dragged out by her captor.");
            ServerSend("ChatRoomJoin", { Name: data.ChatRoomName });
            ElementRemove("FriendList");
            CommonSetScreen("Online", "ChatRoom");
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
                ServerSend("ChatRoomJoin", { Name: data.ChatRoomName });
                ElementRemove("FriendList");
                CommonSetScreen("Online", "ChatRoom");
                popChatSilent("You have been sent to the room " + data.ChatRoomName + " by one of your owners. Any messages above this message is from the previous room.", "System");
            }
        }
    }
    
    // Prevent leaving a room
    Player.walkBackup = Player.CanWalk;
    Player.CanWalk = function () { 
        var isActivated = cursedConfig.hasIntenseVersion && cursedConfig.isRunning && ChatRoomSpace != "LARP" && cursedConfig.hasCaptureMode;
        return Player.walkBackup() && (!isActivated || cursedConfig.capture.Valid < Date.now());
    }
}

/** Altered functions that do *NOT* require cursedConfig */
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