function LoadCommandsV2() {
    if (Array.isArray(window.Commands)) return;
    window.Commands = [];
    // Sends the chat to everyone in the room
    window.ChatRoomSendChat = function ChatRoomSendChat() {
        // If there's a message to send
        const msg = ElementValue("InputChat").trim();
        if (msg != "") {
            if (!CommonIsMobile) {
                // Keeps the chat log in memory so it can be accessed with pageup/pagedown
                ChatRoomLastMessage.push(msg);
                ChatRoomLastMessageIndex = ChatRoomLastMessage.length;
            }
            CommandParse(msg);
        }
    }
    /**
     * Fill the user input with the command
     * @param {string} command 
     */
    window.CommandSet = function CommandSet(command) {
        ElementValue("InputChat", "/" + command + " ");
        ElementFocus("InputChat");
    }
    /**
     * Add a list of commands
     * @param {ICommand[]} add 
     */
    window.CommandCombine = function CommandCombine(add) {
        Commands = Commands.filter(C => !add.some(A => A.Tag == C.Tag)).concat(add);
        Commands.sort((A, B) => (A.Tag > B.Tag) ? 1 : ((B.Tag > A.Tag) ? -1 : 0));
    }
    /**
     * Beeps a given member by sending the name and the current room of the beepee. Also adds an entry to the beep log of the player
     * @param {number} MemberNumber - The ID of the player to beep
     * @param {string} MemberName - The name of the player to beep
     */
    FriendListBeep = function FriendListBeep(MemberNumber, MemberName) {
        ServerSend("AccountBeep", { MemberNumber: MemberNumber });
        FriendListBeepLog.push({ MemberNumber: MemberNumber, MemberName: MemberName, ChatRoomName: ((ChatRoomData == null) ? null : ChatRoomData.Name), Sent: true, Time: new Date() });
        ChatRoomSendLocal("Beep Sent: #" + MemberNumber.toString() + " " + MemberName);
    }

    CommandCombine(CommonCommands);
    CommandCombine(AdditionalCommands);
    // CommandLoadDescription();
}

/**
 * Removes (*) (/me) (/action) then sends message as emote
 * @param {string} msg 
 */
function ChatRoomSendEmote(msg) {
    if (msg.indexOf("**") == 0) {
        msg = "*" + msg.replace(/\*/g, "");
    } else {
        msg = msg.replace(/\*/g, "");
        msg = msg.replace(/\/me /g, "");
        msg = msg.replace(/\/action /g, "*");
    }
    msg = msg.trim();
    if (msg != "") ServerSend("ChatRoomChat", { Content: msg, Type: "Emote" });
}

/**
 * Sends message to user with HTML tags
 * @param {string} msg 
 */
function ChatRoomSendLocal(msg) {
    const div = document.createElement("div");
    div.setAttribute('class', 'ChatMessage');
    div.setAttribute('data-time', ChatRoomCurrentTime());
    div.setAttribute('data-sender', Player.MemberNumber.toString());
    div.innerHTML = msg;

    const Refocus = document.activeElement.id == "InputChat";
    const ShouldScrollDown = ElementIsScrolledToEnd("TextAreaChatLog");
    if (document.getElementById("TextAreaChatLog") != null) {
        document.getElementById("TextAreaChatLog").appendChild(div);
        if (ShouldScrollDown) ElementScrollToEnd("TextAreaChatLog");
        if (Refocus) ElementFocus("InputChat");
    }
}

/**
 * @typedef ICommand
 * @property {string} Tag
 * @property {string?} Description
 * @property {(args: string, msg: string) => void} Action
 * @property {(() => boolean)?} Prerequisite
 */

/**
 * Parse the user message
 * @param {string} msg 
 */
function CommandParse(msg) {
    if (msg.indexOf("/") == 0) {
        CommandExecute(msg);
    } else if (msg.indexOf("*") == 0) {
        ChatRoomSendEmote(msg);
        ElementValue("InputChat", "");
    } else {
        if (ChatRoomTargetMemberNumber == null) ServerSend("ChatRoomChat", { Content: msg, Type: "Chat" });
        else {
            ServerSend("ChatRoomChat", { Content: msg, Type: "Whisper", Target: ChatRoomTargetMemberNumber });
            let TargetName = "";
            for (let C = 0; C < ChatRoomCharacter.length; C++)
                if (ChatRoomTargetMemberNumber == ChatRoomCharacter[C].MemberNumber)
                    TargetName = ChatRoomCharacter[C].Name;

            const div = document.createElement("div");
            div.setAttribute('class', 'ChatMessage ChatMessageWhisper');
            div.setAttribute('data-time', ChatRoomCurrentTime());
            div.setAttribute('data-sender', Player.MemberNumber.toString());
            div.innerHTML = TextGet("WhisperTo") + " " + TargetName + ": " + msg;

            const Refocus = document.activeElement.id == "InputChat";
            const ShouldScrollDown = ElementIsScrolledToEnd("TextAreaChatLog");
            if (document.getElementById("TextAreaChatLog") != null) {
                document.getElementById("TextAreaChatLog").appendChild(div);
                if (ShouldScrollDown) ElementScrollToEnd("TextAreaChatLog");
                if (Refocus) ElementFocus("InputChat");
            }
        }
        ElementValue("InputChat", "");
    }
}

/**
 * Prints out the commands with tags that include low
 * @param {string} low - lower case search keyword for tags
 */
function CommandHelp(low) {
    Commands
        .filter(C => low == null || low == "" || C.Tag.includes(low))
        .filter(C => C.Prerequisite == null || C.Prerequisite())
        .forEach(C => ChatRoomSendLocal("<strong onclick='window.CommandSet(\"" + C.Tag + "\")'>/" + C.Tag + "</strong>" + C.Description));
}

/**
 * Finds command and executes it from the message
 * @param {string} msg 
 */
function CommandExecute(msg) {
    const low = msg.toLowerCase();
    let C = Commands.filter(C => low.indexOf("/" + C.Tag) == 0);
    C = C[0] && C.reduce(function (a, b) { return a.length > b.length ? a : b; });
    if (C && C.Reference) C = Commands.find(D => D.Tag == C.Reference);
    if (C == null) {
        ElementValue("InputChat", "/invalid command: no such command");
        return;
    }
    if (C.Prerequisite && !C.Prerequisite()) {
        ElementValue("InputChat", "/invalid command: prerequisite did not met");
        return;
    }
    C.Action(low.substring(C.Tag.length + 2), msg);
    if (C.Clear == null || C.Clear) {
        ElementValue("InputChat", "");
        ElementFocus("InputChat");
    }
}

/**
 * @type {ICommand[]}
 */
const CommonCommands = [
    {
        Tag: 'dice',
        Description: ' [Number: 6..1000], to cast a random dice roll',
        Action: (_, msg) => {
            // The player can roll X dice of Y faces, using XdY.  If no size is specified, a 6 sided dice is assumed
            let DiceNumber = 0;
            if (/(^\d+)[dD](\d+$)/.test(msg.substring(5, 50).trim())) {
                const Roll = /(^\d+)[dD](\d+$)/.exec((msg.substring(5, 50).trim()));
                DiceNumber = (!Roll) ? 1 : parseInt(Roll[1]);
                const DiceSize = (!Roll) ? 6 : parseInt(Roll[2]);
                if ((DiceNumber < 1) || (DiceNumber > 100)) DiceNumber = 1;
            } else if (/(^\d+$)/.test((msg.substring(5, 50).trim()))) {
                const Roll = /(^\d+)/.exec((msg.substring(5, 50).trim()));
                DiceNumber = 1;
                const DiceSize = (!Roll) ? 6 : parseInt(Roll[1]);
            }

            // If there's at least one dice to roll
            if (DiceNumber > 0) {
                if ((DiceSize < 2) || (DiceSize > 100)) DiceSize = 6;
                let CurrentRoll = 0;
                const Result = [];
                let Total = 0;
                while (CurrentRoll < DiceNumber) {
                    const Roll = Math.floor(Math.random() * DiceSize) + 1
                    Result.push(Roll);
                    Total += Roll;
                    CurrentRoll++;
                }
                msg = "ActionDice";
                const Dictionary = [];
                Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name });
                Dictionary.push({ Tag: "DiceType", Text: DiceNumber.toString() + "D" + DiceSize.toString() });
                if (DiceNumber > 1) {
                    Result.sort((a, b) => a - b);
                    Dictionary.push({ Tag: "DiceResult", Text: Result.toString() + " = " + Total.toString() });
                } else if (DiceNumber == 1) Dictionary.push({ Tag: "DiceResult", Text: Total.toString() });
                if (msg != "") ServerSend("ChatRoomChat", { Content: msg, Type: "Action", Dictionary: Dictionary });
            }
        }
    },
    {
        Tag: 'coin',
        Description: ', to throw a coin',
        Action: () => {
            const Heads = (Math.random() >= 0.5);
            const Dictionary = [
                { Tag: "SourceCharacter", Text: Player.Name },
                { Tag: "CoinResult", TextToLookUp: Heads ? "Heads" : "Tails" }];
            ServerSend("ChatRoomChat", { Content: "ActionCoin", Type: "Action", Dictionary: Dictionary });
        }
    },
    {
        Tag: 'friendlistadd',
        Description: ' [MemberNumber], add to friendlist',
        Action: (_, msg) => ChatRoomListManipulation(Player.FriendList, null, msg)
    },
    {
        Tag: 'friendlistremove',
        Description: ' [MemberNumber], remove from friendlist',
        Action: (_, msg) => ChatRoomListManipulation(null, Player.FriendList, msg)
    },
    {
        Tag: 'ghostadd',
        Description: ' [MemberNumber], add to ghostlist',
        Action: (_, msg) => ChatRoomListManipulation(Player.GhostList, null, msg)
    },
    {
        Tag: 'ghostremove',
        Description: ' [MemberNumber], remove from ghostlist',
        Action: (_, msg) => ChatRoomListManipulation(null, Player.GhostList, msg)
    },
    {
        Tag: 'whitelistadd',
        Description: ' [MemberNumber], add to whitelist',
        Action: (_, msg) => ChatRoomListManipulation(Player.WhiteList, Player.BlackList, msg)
    },
    {
        Tag: 'whitelistremove',
        Description: ' [MemberNumber], remove from whitelist',
        Action: (_, msg) => ChatRoomListManipulation(null, Player.WhiteList, msg)
    },
    {
        Tag: 'blacklistadd',
        Description: ' [MemberNumber], add to blacklist',
        Action: (_, msg) => ChatRoomListManipulation(Player.BlackList, Player.WhiteList, msg)
    },
    {
        Tag: 'blacklistremove',
        Description: ' [MemberNumber], remove from blacklist',
        Action: (_, msg) => ChatRoomListManipulation(null, Player.BlackList, msg)
    },
    {
        Tag: 'showblack',
        Description: ', show blacklist',
        Action: () => ChatRoomSendLocal('Blacklist: ' + JSON.stringify(Player.BlackList))
    },
    {
        Tag: 'showwhite',
        Description: ', show whitelist',
        Action: () => ChatRoomSendLocal('Whitelist: ' + JSON.stringify(Player.WhiteList))
    },
    {
        Tag: 'showghost',
        Description: ', show ghostlist',
        Action: () => ChatRoomSendLocal('Ghostlist: ' + JSON.stringify(Player.GhostList))
    },
    {
        Tag: 'showfriends',
        Description: ', show friendlist',
        Action: () => ChatRoomSendLocal('Blacklist: ' + JSON.stringify(Player.FriendList))
    },
    {
        Tag: 'ban',
        Description: ' [MemberNumber], ban user',
        Prerequisite: () => ChatRoomPlayerIsAdmin(),
        Action: (_, msg) => ChatRoomAdminChatAction("Ban", msg)
    },
    {
        Tag: 'unban',
        Description: ' [MemberNumber], remove ban',
        Prerequisite: () => ChatRoomPlayerIsAdmin(),
        Action: (_, msg) => ChatRoomAdminChatAction("Unban", msg)
    },
    {
        Tag: 'kick',
        Description: ' [MemberNumber], kick user',
        Prerequisite: () => ChatRoomPlayerIsAdmin(),
        Action: (_, msg) => ChatRoomAdminChatAction("Kick", msg)
    },
    {
        Tag: 'promote',
        Description: ' [MemberNumber], promote user to room administrator',
        Prerequisite: () => ChatRoomPlayerIsAdmin(),
        Action: (_, msg) => ChatRoomAdminChatAction("Promote", msg)
    },
    {
        Tag: 'demote',
        Description: ' [MemberNumber], demote user from room administrator',
        Prerequisite: () => ChatRoomPlayerIsAdmin(),
        Action: (_, msg) => ChatRoomAdminChatAction("Demote", msg)
    },
    {
        Tag: 'me',
        Description: ' [Message], send emote: "<i>*[PlayerName] Message*</i>", alternative start message with *"',
        Action: (_, msg) => ChatRoomSendEmote(msg)
    },
    {
        Tag: 'action',
        Description: ' [Message], send emote: "<i>*Message*</i>", alternative start message with **',
        Action: (_, msg) => ChatRoomSendEmote(msg)
    },
    {
        Tag: 'invalid',
        Description: ', do nothing',
        Action: () => { }
    },
    {
        Tag: '/',
        Description: '[Message], send "/Message"',
        Action: (_, msg) => { ServerSend("ChatRoomChat", { Content: msg.substring(1), Type: "Chat" }); }
    },
    {
        Tag: 'help',
        Description: ' [Name?], print help for commands where Name is prefix of command',
        Action: args => CommandHelp(args)
    },
    {
        Tag: 'afk',
        Description: ', Set AFK emote',
        Action: () => CharacterSetFacialExpression(Player, "Emoticon", "Afk")
    },
];

/**
 * @type {ICommand[]}
 */
const AdditionalCommands = [
    {
        Tag: 'curse',
        Description: ', open curse setting screen',
        Prerequisite: () => window.cursedConfig != null,
        Action: () => { 
            document.getElementById("InputChat").style.display = "none";
		    document.getElementById("TextAreaChatLog").style.display = "none";
            CursePreferenceRun();
            CurrentScreen = "CursePreference";
            CursePreferenceReturnRoom = "ChatRoom";
        }
    },
    {
        Tag: 'logoff',
        Description: ', disconnect from server',
        Action: () => {
            ServerPlayerAppearanceSync();
            ServerSend("AccountDisconnect");
            window.location = window.location;
        }
    },
    {
        Tag: 'admin',
        Description: ', open admin screen',
        Action: () => {
            document.getElementById("InputChat").style.display = "none";
		    document.getElementById("TextAreaChatLog").style.display = "none";
            CommonSetScreen("Online", "ChatAdmin");
        }
    },
    {
        Tag: 'profile',
        Description: ', open profile screen',
        Action: () => {
            document.getElementById("InputChat").style.display = "none";
		    document.getElementById("TextAreaChatLog").style.display = "none";
            InformationSheetLoadCharacter(Player);
        }
    },
    {
        Tag: 'beep',
        Description: ' [MemberNumber], sends beep to other side',
        Action: arg => {
            const T = parseInt(arg);
            if (isFinite(T) && T > 0) {
                FriendListBeep(T, "#" + T.toString());
            }
        }
    },
    {
        Tag: 'clothes',
        Description: ', open appearance screen',
        Prerequisite: () => Player.CanChange(),
        Action: () => {
            document.getElementById("InputChat").style.display = "none";
		    document.getElementById("TextAreaChatLog").style.display = "none";
            CharacterAppearanceReturnRoom = "ChatRoom";
            CharacterAppearanceReturnModule = "Online";
            CharacterAppearanceLoadCharacter(Player);
        }
    },
    {
        Tag: 'load',
        Description: ' [Number: 0..11], load clothes from wardrobe',
        Prerequisite: () => Player.CanChange(),
        Action: args => WardrobeFastLoad(Player, parseInt(args))
    },
    {
        Tag: 'save',
        Description: ' [Number: 0..11], save clothes to wardrobe',
        Prerequisite: () => Player.CanChange(),
        Action: args => WardrobeFastSave(Player, parseInt(args))
    },
    {
        Tag: 'reload',
        Description: ', reload this page',
        Action: () => {
            ServerPlayerAppearanceSync();
            location.reload(true);
        }
    },
    {
        Tag: 'whisper',
        Description: ' [MemberNumber], set whisper target',
        Action: args => {
            if (args.trim() == "") {
                ChatRoomTargetMemberNumber = null
            }
            ChatRoomTargetMemberNumber = parseInt(args);
            if (!Number.isInteger(ChatRoomTargetMemberNumber)) ChatRoomTargetMemberNumber = null;
            const C = ChatRoomCharacter.find(C => C.MemberNumber == ChatRoomTargetMemberNumber);
            const TargetName = C ? C.Name : null;
            document.getElementById("InputChat").placeholder = (ChatRoomTargetMemberNumber == null) ? TextGet("PublicChat") : TextGet("WhisperTo") + " " + TargetName;
        }
    },
];