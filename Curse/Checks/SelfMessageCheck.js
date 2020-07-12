/** Function vital to any speech restrictions as it will block a giving message by returning true either directly or after checking all conditions, moving things here has a huge chance of causing logic errors. Be careful when adding to it. */
function SelfMessageCheck(msg) {
  //Returns true if the message cannot be sent
  let r = false;

  //Clears stuff
  originalMsg = msg;
  msg = msg.trim().replace(/^\**/g, "").replace(/\*$/g, "");
  const isWhisper = !!ChatRoomTargetMemberNumber;
  const isEmote = originalMsg.startsWith("*");
  const isNormalMsg = !isEmote;

  // Gagged OOC
  if (
    cursedConfig.hasBlockedOOC && cursedConfig.hasIntenseVersion
    && !Player.CanTalk() && (originalMsg.includes("(") || ChatRoomTargetMemberNumber)
  ) { 
    NotifyOwners("(Tried to use OOC while gagged)");
    popChatSilent("WARNING: You are not allowed to use OOC while gagged.");
    TriggerPunishment(9);
    r = true;
  }
  
  if (msg == "") return r;

  //Parse Commands
  let commandCall = (cursedConfig.commandChar + cursedConfig.slaveIdentifier + " ").toLowerCase();
  if (msg.indexOf(commandCall) != -1) {
    let commandString = msg.split(commandCall)[1];
    command = commandString.split(" ")[0];
    parameters = commandString.split(" ");
    if (parameters.length > 0) {
      parameters.shift();
      //Wearer only command
      r = WearerCommands({ command, parameters, sender: Player.MemberNumber }) ? r : true;
      r = PrivateCommands({ command, parameters, sender: Player.MemberNumber }) ? r : true;
    }
    if (r) {
      TryPopTip(23);
      ChatRoomLastMessage.push(originalMsg);
      return true;
    }
    popChatSilent("(A command call was detected, but unidentified. Check for typos and verify your version if this was intended. This message will be processed normally.)", "System");
  }

  //Should say 
  //Returns immediately, that way it wont collide with other stuff
  if (cursedConfig.say != "" && !cursedConfig.hasFullMuteChat && isNormalMsg) {
    if (
      msg != cursedConfig.say.toLowerCase().trim()
            && !ChatRoomTargetMemberNumber && !originalMsg.startsWith("*")
    ) {
      NotifyOwners("(Did not say the sentence willingly.)");
      popChatSilent("You were punished for not saying the expected sentence willingly: " + cursedConfig.say);
      TriggerPunishment(12);
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
    if (isNormalMsg) {
      NotifyOwners("(Tried to speak freely when her speech was restrained.)");
      popChatSilent("Bad girl. You tried to speak freely while your speech is being restrained.");
      TryPopTip(42);
      TriggerPunishment(16);
      return true;
    }
  }

  //Speech Restrictions
  //Reinforcement
  cursedConfig.charData.forEach(member => {
    if (member.isEnforced && ChatRoomCharacter.map(el => el.MemberNumber).includes(member.Number)) {
      let Name = member.SavedName ? member.SavedName.toLowerCase() : FetchName(member.Number).toLowerCase(); 
      let requiredName = member.RespectNickname && member.Nickname ? [member.Nickname.toLowerCase()] : member.Titles.map(el => el + " " + (member.SavedName ? member.SavedName.toLowerCase() : FetchName(member.Number).toLowerCase()));
      let matches = [...msg
        .matchAll(new RegExp("\\b(" + Name.toLowerCase() + ")\\b", "g"))
      ];
      if (!matches) matches = [];
      let goodMatches = [];
      requiredName.forEach(rn =>
        goodMatches.push(...msg.matchAll(new RegExp(rn, "g")))
      );
      if (matches.length > goodMatches.length) {
        TryPopTip(34);
        NotifyOwners("(Tried to be disrespectful)");
        popChatSilent("Respecting " + member.Number + " is required.");
        TriggerPunishment(15, [member.Number]);
        r = true;
      }
    }
  });

  //Cursed Speech
  if (
    cursedConfig.hasCursedSpeech
  ) {
    let badWords = cursedConfig.bannedWords.filter(word => (
      msg.toLowerCase().replace(/(\.)|(-)/g, "").replace(/(')|(,)|(~)|(")|(\()|(\))|(!)|(\?)/g, " ").match(/[^\s]+/g) || []).includes(word.toLowerCase()
    ));
    if (badWords.length != 0) {
      NotifyOwners(`(Used banned words: ${badWords.join(", ")})`);
      popChatSilent("Bad girl. Bad word(s) used: " + badWords.join(", "));
      badWords.forEach(BW => TriggerPunishment(14, [BW]));
      r = true;
    }
  }

  //Cursed Sound
  if (
    cursedConfig.hasSound
        && cursedConfig.hasIntenseVersion
        && msg.toLowerCase().replace(/(\.)|(-)|(')|(,)|(~)|(\()|(\))|(!)|(\?)/g, " ").split(" ")
          .filter(w => {
            return !(new RegExp("^" + cursedConfig.sound.replace(/(\.)|(-)|(')|(,)|(~)|(\()|(\))|(!)|(\?)/g, "").split("").map(el => el + "*").join("") + "$", "g")).test(w);
          }).length > 0
        && isNormalMsg
  ) {
    NotifyOwners("(Tried to make unallowed sounds)");
    popChatSilent("Bad girl. You made unallowed sounds. (allowed sound: " + cursedConfig.sound + ")");
    TriggerPunishment(13);
    r = true;
  }

  //Contractions
  if (cursedConfig.hasNoContractions && !isEmote && !cursedConfig.hasSound) {
    let hasPunishment = false;
    (msg.match(/[A-Za-z]+('[A-Za-z]+)/g) || []).filter(C => !C.includes("'s")).forEach(CO => { 
      TriggerPunishment(12, [CO]);
      hasPunishment = true;
    });
    if (hasPunishment) {
      NotifyOwners("(Tried to use contractions)");
      popChatSilent("WARNING: You are not allowed to use contractions!");
      r = true;
    }
  }

  //Doll talk
  if (cursedConfig.hasDollTalk && !isEmote) {
    const whitelist = ["goddess", "mistress"];
    const words = msg.toLowerCase().replace(/(\.)|(-)|(')|(,)|(~)|(\()|(\))|(!)|(\?)/g, " ").trim().split(" ").filter(w => w && !whitelist.includes(w));
    const size = words.length;
    const longWords = words.filter(w => w.length > 6);
    if (size > 5) {
      NotifyOwners("(Tried to use too many words (doll talk infraction))");
      popChatSilent("WARNING: You are not allowed to use more than 5 words! (doll talk infraction)");
      TriggerPunishment(11);
      r = true;
    }
    if (longWords.length > 0) {
      NotifyOwners("(Tried to use fancy words (doll talk infraction))");
      popChatSilent("WARNING: You are not allowed to use words with more than 6 letters! (doll talk infraction)");
      longWords.forEach(LW => TriggerPunishment(10, [LW]));
      r = true;
    }
  }
  
  return r;
}
