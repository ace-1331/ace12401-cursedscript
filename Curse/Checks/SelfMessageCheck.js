/** Function vital to any speech restrictions as it will block a giving message by returning true either directly or after checking all conditions, moving things here has a huge chance of causing logic errors. Be careful when adding to it. */
function SelfMessageCheck(msg) {
  //Returns true if the message cannot be sent
  let r = false;

  //Clears stuff
  originalMsg = msg;
  msg = msg.split("(")[0].trim().replace(/^\**/g, "").replace(/\*$/g, "");
  const isWhisper = !!ChatRoomTargetMemberNumber;
  const isEmote = originalMsg.startsWith("*");
  const isNormalMsg = !isWhisper && !isEmote;

  // Gagged OOC
  if (
    cursedConfig.hasBlockedOOC && cursedConfig.hasIntenseVersion
    && !Player.CanTalk() && originalMsg.includes("(")
  ) { 
    NotifyOwners({ Tag: "SelfMsgCheckNotifyGagOOC" });
    popChatSilent({ Tag: "SelfMsgCheckWearerWarnGagOOC" });
    TriggerPunishment(9);
    r = true;
  }

  // Gagged Whisper
  if (
    cursedConfig.hasBlockedWhisper && cursedConfig.hasIntenseVersion
    && !Player.CanTalk() && isWhisper
  ) {
    NotifyOwners({ Tag: "SelfMsgCheckNotifyGagOOC" });
    popChatSilent({ Tag: "SelfMsgCheckWearerWarnGagOOC" });
    TriggerPunishment(27);
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
    popChatSilent({ Tag: "SelfMsgCheckCommandCallError" }, "System");
  }

  //Should say 
  //Returns immediately, that way it wont collide with other stuff
  if (cursedConfig.say != "" && !cursedConfig.hasFullMuteChat && isNormalMsg) {
    if (
      msg != cursedConfig.say.toLowerCase().trim()
            && !ChatRoomTargetMemberNumber && !originalMsg.startsWith("*")
    ) {
      NotifyOwners({ Tag: "SelfMsgCheckNotifyForceSay"});
      popChatSilent({ Tag: "SelfMsgCheckWarnForceSay", Param: [cursedConfig.say] });
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
      NotifyOwners({ Tag: "SelfMsgCheckNotifyRestrained"});
      popChatSilent({ Tag: "SelfMsgCheckWarnRestrained" });
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
        NotifyOwners({ Tag: "SelfMsgCheckNotifyDisrespect"});
        popChatSilent({ Tag: "SelfMsgCheckWarnDisrespect", Param: [FetchName(member.Number)] });
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
      msg.toLowerCase().replace(/(\.)|(-)/g, "").replace(/(')|(,)|(~)|(")|(!)|(\?)/g, " ").match(/[^\s]+/g) || []).includes(word.toLowerCase()
    ));
    if (badWords.length != 0) {
      NotifyOwners({ Tag: "SelfMsgCheckNotifyWord", Param: [badWords.join(", ")] });
      popChatSilent({ Tag: "SelfMsgCheckWarnWord", Param: [badWords.join(", ")] });
      badWords.forEach(BW => TriggerPunishment(14, [BW]));
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
        && isNormalMsg
  ) {
    NotifyOwners({ Tag: "SelfMsgCheckNotifySound" });
    popChatSilent({ Tag: "SelfMsgCheckWarnSound", Param: [cursedConfig.sound] });
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
      NotifyOwners({ Tag: "SelfMsgCheckNotifyContraction"});
      popChatSilent({ Tag: "SelfMsgCheckWarnContraction" });
      r = true;
    }
  }

  //Doll talk
  if (cursedConfig.hasDollTalk && !isEmote) {
    const whitelist = ["goddess", "mistress"];
    const words = msg.toLowerCase().replace(/(\.)|(-)|(')|(,)|(~)|(!)|(\?)/g, " ").trim().split(" ").filter(w => w && !whitelist.includes(w));
    const size = words.length;
    const longWords = words.filter(w => w.length > 6);
    if (size > 5) {
      NotifyOwners({ Tag: "SelfMsgCheckNotifyDollLong"});
      popChatSilent({ Tag: "SelfMsgCheckWarnDollLong" });
      TriggerPunishment(11);
      r = true;
    }
    if (longWords.length > 0) {
      NotifyOwners({ Tag: "SelfMsgCheckNotifyDollMany"});
      popChatSilent({ Tag: "SelfMsgCheckWarnDollMany" });
      longWords.forEach(LW => TriggerPunishment(10, [LW]));
      r = true;
    }
  }
  
  return r;
}