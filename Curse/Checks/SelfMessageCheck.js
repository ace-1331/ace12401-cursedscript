/** Function vital to any speech restrictions as it will block a giving message by returning true either directly or after checking all conditions, moving things here has a huge chance of causing logic errors. Be careful when adding to it. */
function SelfMessageCheck(msg) {
    //Returns true if the message cannot be sent
    let r = false;

    //Clears stuff
    originalMsg = msg;
    msg = msg.split("(")[0].trim().replace(/^\**/g, "").replace(/\*$/g, "");
    if (msg == "") return false;

    //Parse Commands
    var commandCall = (cursedConfig.commandChar + cursedConfig.slaveIdentifier + " ").toLowerCase();
    if (msg.indexOf(commandCall) != -1) {
        var commandString = msg.split(commandCall)[1];
        command = commandString.split(" ")[0];
        parameters = commandString.split(" ");
        if (parameters.length > 0) {
            parameters.shift();
            //Wearer only command
            r = WearerCommands({ command, parameters, sender: Player.MemberNumber }) ? r : true;
            r = PrivateCommands({ command, parameters, sender: Player.MemberNumber }) ? r : true;
        }
        if (r) return true;
    }

    //Should say 
    //Returns immediately, that way it wont collide with other stuff
    if (cursedConfig.say != "" && !cursedConfig.hasFullMuteChat && !ChatRoomTargetMemberNumber && originalMsg.indexOf("*") != 0) {
        if (
            msg != cursedConfig.say.toLowerCase().trim()
            && !ChatRoomTargetMemberNumber && !originalMsg.startsWith("*")
        ) {
            NotifyOwners("(Did not say the sentence willingly.)");
            popChatSilent("You were punished for not saying the expected sentence willingly: " + cursedConfig.say);
            cursedConfig.strikes += 15;
            cursedConfig.say = "";
            return true;
        } else {
            cursedConfig.say = "";
            return false;
        }
    }

    //Restrained speech (will not proc in whispers or emotes)
    //Returns immediately, that way it wont collide with other stuff
    if (
        cursedConfig.hasRestrainedSpeech
        && cursedConfig.hasIntenseVersion
    ) {
        if (!ChatRoomTargetMemberNumber && !originalMsg.startsWith("*")) {
            NotifyOwners("(Tried to speak freely when her speech was restrained.)");
            popChatSilent("Bad girl. You tried to speak freely while your speech is being restrained.");
            cursedConfig.strikes += 5;
            return true;
        }
        return false;
    }

    //Speech Restrictions
    //Reinforcement
    cursedConfig.charData.forEach(member => {
        var Name;
        var requiredName;
        if (member.isEnforced && ChatRoomCharacter.map(el => el.MemberNumber.toString()).includes(member.Number)) {
            Name = member.SavedName;
            requiredName = member.RespectNickname ? [member.Nickname.toLowerCase()] : member.Titles.map(el => el + " " + Name.toLowerCase());
            var matches = [...msg
                .matchAll(new RegExp("\\b(" + Name.toLowerCase() + ")\\b", 'g'))
            ];
            if (!matches) matches = [];
            var goodMatches = [];
            requiredName.forEach(rn =>
                goodMatches.push(...msg.matchAll(new RegExp(rn, 'g')))
            );
            if (matches.length > goodMatches.length) {
                NotifyOwners("(Tried to be disrespectful)");
                popChatSilent("Respecting " + member.Number + " is required.");
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
            NotifyOwners(`(Used banned words: ${badWords.join(", ")})`);
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
        && !ChatRoomTargetMemberNumber && !originalMsg.startsWith("*")
    ) {
        NotifyOwners("(Tried to make unallowed sounds)");
        popChatSilent("Bad girl. You made unallowed sounds. (allowed sound: " + cursedConfig.sound + ")");
        cursedConfig.strikes += 3;
        r = true;
    }

    //Contractions
    if (cursedConfig.hasNoContractions && !cursedConfig.hasSound && (msg.match(/[A-Za-z]+('[A-Za-z]+)/g) || []).length != 0) {
        NotifyOwners("(Tried to use contractions)");
        popChatSilent("WARNING: You are not allowed to use contractions!");
        cursedConfig.strikes += 2;
        r = true;
    }

    //Doll talk
    if (cursedConfig.hasDollTalk && !originalMsg.startsWith("*")) {
        let words = msg.toLowerCase().replace(/(\.)|(-)|(')|(,)|(~)|(!)|(\?)/g, " ").trim().split(" ").filter(w => w);
        if (words.length > 5) {
            NotifyOwners("(Tried to use too many words (doll talk infraction))");
            popChatSilent("WARNING: You are not allowed to use more than 5 words! (doll talk infraction)");
            cursedConfig.strikes += 2;
            r = true;
        } else if (words.filter(w => w.length > 6).length > 0) {
            NotifyOwners("(Tried to use fancy words (doll talk infraction))");
            popChatSilent("WARNING: You are not allowed to use words with more than 6 letters! (doll talk infraction)");
            cursedConfig.strikes += 2;
            r = true;
        }
    }

    return r;
}