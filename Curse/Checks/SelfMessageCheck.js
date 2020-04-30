function SelfMessageCheck(msg) {
    //Returns true if the message cannot be sent
    let r = false;
    //Clears OOC
    originalMsg = msg;
    msg = msg.split("(")[0].trim().replace(/^\**/g, "").replace(/\*$/g, "");
    
    //Parse Commands
    var commandCall = (cursedConfig.commandChar + cursedConfig.slaveIdentifier + " ").toLowerCase();
    if (msg.indexOf(commandCall) != -1) {
        var commandString = msg.split(commandCall)[1];
        command = commandString.split(" ")[0];
        parameters = commandString.split(" ");
        if (parameters.length > 0) {
            parameters.shift();
            //Wearer only command
            r = WearerCommands({ command, parameters, sender: Player.MemberNumber }) ? false : true;
        }
        if (r) return true;
    }
    
    //Should say 
    //Returns immediately, that way it wont collide with other stuff
    if (cursedConfig.say != "" && !cursedConfig.hasFullMuteChat && !ChatRoomTargetMemberNumber && originalMsg.indexOf("*") != 0) {
        if (
            msg != cursedConfig.say.toLowerCase().trim()
            && !ChatRoomTargetMemberNumber && originalMsg.indexOf("*") != 0
        ) {
            popChatSilent("You were punished for not saying the expected sentence willingly: " + cursedConfig.say);
            cursedConfig.strikes += 6;
            cursedConfig.say = "";
            return true;
        } else {
            cursedConfig.say = "";
            return false;
        }
    }
    
    //Speech Restrictions
    //Reinforcement
    cursedConfig.enforced.forEach(memberNumber => {
        if (ChatRoomCharacter.map(el => el.MemberNumber.toString()).includes(memberNumber)) {
            var Name = cursedConfig.nicknames.filter(u => u.Number == memberNumber)[0] ? cursedConfig.nicknames.filter(u => u.Number == memberNumber)[0].SavedName : "" || ChatRoomCharacter
                .map(el => { return { MemberNumber: el.MemberNumber, Name: el.Name } })
                .filter(el => el.MemberNumber == memberNumber)[0].Name;
            var requiredName = ['miss', 'mistress', 'goddess', 'owner']
                .map(el => el + " " + Name.toLowerCase());
            var matches = [...msg
                .matchAll(new RegExp("\\b(" + Name.toLowerCase() + ")\\b", 'g'))
            ];
            if (!matches) matches = [];
            var goodMatches = [];
            requiredName.forEach(rn =>
                goodMatches.push(...msg.matchAll(new RegExp(rn, 'g')))
            );
            if (matches.length > goodMatches.length) {
                sendWhisper(memberNumber, "(Tried to be disrespectful.)");
                popChatSilent("Respecting " + memberNumber + " is required.");
                cursedConfig.strikes += 7;
                r = true;
            }
        }
    });
    
    //Cursed Speech
    if (
        cursedConfig.hasCursedSpeech
    ) {
        let badWords = cursedConfig.bannedWords.filter(word => (
            msg.toLowerCase().replace(/(\.)|(-)/g, "").replace(/(')|(,)|(~)|(")|(!)|(\?)/g, " ").match(/[^\s]+/g) || []).includes(word.toLowerCase()
            ));
        if (badWords.length != 0) {
            popChatSilent("Bad girl. Bad word(s) used: " + badWords.join(", "));
            cursedConfig.strikes += 5;
            r = true;
        }
    }
    
    //Cursed Sound
    if (
        cursedConfig.hasSound
        && cursedConfig.hasIntenseVersion
        && msg.toLowerCase().replace(/(\.)|(-)|(')|(,)|(~)|(!)|(\?)/g, " ").split(" ")
            .filter(w => {
                return !(new RegExp("^" + cursedConfig.sound.replace(/(\.)|(-)|(')|(,)|(~)|(!)|(\?)/g, "").split("").map(el => el + "*").join("") + "$", "g")).test(w);
            }).length > 0
        && !ChatRoomTargetMemberNumber && originalMsg.indexOf("*") != 0
    ) {
        popChatSilent("Bad girl. You made unallowed sounds. (allowed sound: " + cursedConfig.sound + ")");
        cursedConfig.strikes++;
        r = true;
    }
    
    return r;
}