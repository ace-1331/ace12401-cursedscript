/** Function to trigger commands intended for all, returns true if no command was executed */
function AllCommands({
  command, sender, commandCall, parameters
}) {
  switch (command) {
    case "showstrikes":
      sendWhisper(sender, { Tag: "AllShowStrikes", Param: [cursedConfig.strikes] });
      break;
    case "transgressions":
      const transgressionReport = cursedConfig.transgressions.map(T => T.Count + "x " + T.Name).join(", ");
      sendWhisper(sender, { Tag: "AllShowTransgressions", Param: [transgressionReport] });
      break;
    case "listoffcommands":
      TryPopTip(50);
      const offCommands = [...cursedConfig.disabledCommands, ...cursedConfig.optinCommands.filter(OC => !OC.isEnabled)].join(", ");
      sendWhisper(sender, { Tag: "AllShowlistoffcommands", Param: [offCommands] });
      break;
    case "asylumtimeleft":
      let oldLog = Log.filter(el => el.Name == "Committed");
      let timeLeft = oldLog.length > 0 ? oldLog[0].Value - CurrentTime : 0;
      timeLeft /= 3600000;
      SendChat({ Tag: "asylumtimeleft", Param: [(timeLeft < 0 ? "0" : Math.round(timeLeft * 100) / 100)] });
      break;
    case "help":
      sendWhisper(sender, { Tag: "OtherWhisperHelpMessage1", Param: [commandCall, commandCall] });
      sendWhisper(sender, { Tag: "OtherWhisperHelpMessage2" });
      break;
    case "blocknickname":
      //Force delete self
      DeleteNickname([sender], sender, 5);
      break;
    case "readnote":
      let note;
      try {
        note = localStorage.getItem(`bc-cursedNote-${Player.MemberNumber}`);
      } catch (err) { console.error("Curse: Error reading note: RN05"); }
      if (note) {
        sendWhisper(sender, { Tag: "AllReadOwnerNote", Param: [note] });
      }
      break;
    case "sendnote":
      let notes;
      try {
        notes = JSON.parse(localStorage.getItem(`bc-cursedReviews-${Player.MemberNumber}`)) || [];
        notes.push(FetchName(sender) + " (" + sender + "): " + parameters.join(" "));
        localStorage.setItem(`bc-cursedReviews-${Player.MemberNumber}`, JSON.stringify(notes));
      } catch (e) { console.error("Curse: Error sending notes: RS65", e); }
      sendWhisper(sender, { Tag: "AllNoteSent" });
      break;
    case "orgasmcount":
      sendWhisper(sender, { Tag: "AllReadOrgasmCount", Param: [cursedConfig.orgasms] });
      break;
    case "language":
      TryPopTip(55);
      switch (parameters[0]) { 
        case "ru":
        case "en":
        case "ger":
        case "fr":
          DictionaryRequest(sender, parameters[0].toUpperCase());
          sendWhisper(sender, { Tag: "AllSetDictionary", Param: [parameters[0].toUpperCase()] });
          break;
        default:
          sendWhisper(sender, { Tag: "AllInvalidLanguage" });
          break;
      }
      break;
    default:
      // No command found
      return true;
  }
}