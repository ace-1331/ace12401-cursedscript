/** Function to trigger commands intended for all, returns true if no command was executed */
function AllCommands({
  command, sender, commandCall, parameters
}) {
  switch (command) {
    case "showstrikes":
      sendWhisper(sender, Player.Name + " has accumulated a total of " + cursedConfig.strikes + " strikes.");
      break;
    case "transgressions":
      const transgressionReport = cursedConfig.transgressions.map(T => T.Count + "x " + T.Name).join(", ");
      sendWhisper(sender, "Transgression(s) to report: " + transgressionReport);
      break;
    case "listoffcommands":
      TryPopTip(50);
      const offCommands = [...cursedConfig.disabledCommands, ...cursedConfig.optinCommands.filter(OC => !OC.isEnabled)].join(", ");
      sendWhisper(sender, "The following commands are disabled: " + offCommands);
      break;
    case "asylumtimeleft":
      let oldLog = Log.filter(el => el.Name == "Committed");
      let timeLeft = oldLog.length > 0 ? oldLog[0].Value - CurrentTime : 0;
      timeLeft /= 3600000;
      SendChat(Player.Name + " has " +
        (timeLeft < 0 ? "0" : Math.round(timeLeft * 100) / 100) +
        " hours left in the asylum");
      break;
    case "help":
      sendWhisper(sender, `(To use the curse on me, ask me about the commands... there are more available depending on your permissions [blacklist, public, mistress, owner]. 
            Commands are called with ${commandCall}, like "${commandCall} respect")`);
      sendWhisper(sender, "(To learn all the commands or use it for yourself, check out this repository: https://github.com/ace-1331/ace12401-cursedscript/wiki/Functions )");
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
        sendWhisper(sender, "(A note is attached to her from her owner: " + localStorage.getItem(`bc-cursedNote-${Player.MemberNumber}`) + ")");
      }
      break;
    case "sendnote":
      let notes;
      try {
        notes = JSON.parse(localStorage.getItem(`bc-cursedReviews-${Player.MemberNumber}`)) || [];
        notes.push(FetchName(sender) + " (" + sender + "): " + parameters.join(" "));
        localStorage.setItem(`bc-cursedReviews-${Player.MemberNumber}`, JSON.stringify(notes));
      } catch (e) { console.error("Curse: Error sending notes: RS65", e); }
      sendWhisper(sender, "(Note sent to owner(s).)");
      break;
    case "orgasmcount":
      sendWhisper(sender, `(Has had ${cursedConfig.orgasms} orgasm(s) since the last reset.)`);
      break;
    case "language":
      TryPopTip(55);
      switch (parameters[0]) { 
        case "ru":
        case "en":
        case "fr":
          DictionaryRequest(sender, parameters[0].toUpperCase());
          sendWhisper(sender, `(Dictionary set to ${parameters[0].toUpperCase()}.)`);
          break;
        default:
          sendWhisper(sender, `(Invalid language. Currently only "fr", "ru" and "en" are available. Anyone can contribute to add more!)`);
          break;
      }
      break;
    default:
      // No command found
      return true;
  }
}