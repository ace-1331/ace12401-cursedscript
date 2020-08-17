function InitStartup() {
  if (cursedConfig.hasIntenseVersion) {
    popChatSilent({ Tag: "IntenseOn" }, "System");
  }
  
  //Resets Strikes when it has been a week
  if (cursedConfig.strikeStartTime + 604800000 < Date.now()) {
      popChatSilent({ Tag: "WeeklyReset" }, "System");
      cursedConfig.strikeStartTime = Date.now();
      cursedConfig.strikes = 0;
      cursedConfig.lastPunishmentAmount = 0;
  }

  //Enables the hidden curse item to display who has the curse
  AssetFemale3DCG.push({ Group: "CurseItems", Priority: 6969, Left: 0, Top: 0, AllowColorize: false, AllowCustomize: false, Asset: [] });
  AssetFemale3DCG.filter(G => G.Group == "CurseItems")[0].Asset.push({ Name: "Curse", Wear: false, Visible: false, Value: -1 });
  AssetFemale3DCG.filter(G => G.Group == "CurseItems")[0].Asset.push({ Name: "Curse" + currentVersion, Wear: false, Visible: false, Value: -1 });
  AssetLoadAll();
  InventoryAdd(Player, "Curse", "CurseItems");
  InventoryAdd(Player, "Curse" + currentVersion, "CurseItems");
  // Always re-enable the version tip to promote staying up to date
  cursedConfig.seenTips = cursedConfig.seenTips.filter(ST => ST !== 49);

  // Blindfolds
  if (cursedConfig.hasFullBlindMode) {
    Asset.forEach(A => A.Effect && A.Effect.find(E => E.includes("Blind")) ? A.Effect.push("BlindHeavy") : "");
  }
    
  // Help message
  if (cursedConfig.hideHelp) { 
    ChatRoomHelpSeen = true;
  }
  
  // DC Prevention
  if (cursedConfig.hasIntenseVersion && cursedConfig.hasDCPrevention && !Player.CanWalk() && cursedConfig.lastChatroom) {
    const roomToGoTo = cursedConfig.lastChatroom;
    delete cursedConfig.lastChatroom;
    SendToRoom(roomToGoTo);
    NotifyOwners({ Tag: "DCPreventionOn" }, true);
    TryPopTip(43);

  }
}

function CheckEnforceMigration() {
  if (cursedConfig.nicknames && cursedConfig.nicknames.length > 0) {
    cursedConfig.nicknames.forEach(m => {
      if (isNaN(m.Number)) return;
      cursedConfig.charData.push({ Number: parseInt(m.Number), Nickname: m.Nickname, NPriority: m.Priority, SavedName: m.SavedName, isEnforced: false, RespectNickname: false, TPriority: 0, Titles: [] });
    });
  }

  if (cursedConfig.enforced && cursedConfig.enforced.length > 0) {
    cursedConfig.enforced.forEach(num => {
      if (isNaN(num)) return;
      let found = cursedConfig.charData.find(C => C.Number == num);
      if (found) {
        found.isEnforced = true;
        found.Titles = ["miss", "mistress", "goddess", "owner"];
      } else {
        cursedConfig.charData.push({ Number: parseInt(num), NPriority: 0, isEnforced: true, RespectNickname: false, TPriority: 1, Titles: ["miss", "mistress", "goddess", "owner"] });
      }
    });
  }
}

/** Cleans the data on startup */
function InitCleanup() {
  //Migrate item curses (backward compatibility)
  const oldCurses = ["hasCursedBelt", "hasCursedLatex", "hasCursedBlindfold", "hasCursedHood", "hasCursedEarplugs", "hasCursedDildogag", "hasCursedPanties", "hasCursedGag", "hasCursedMittens", "hasCursedPaws", "hasCursedScrews", "hasCursedPony", "hasCursedRopes", "hasCursedMaid", "hasCursedNakedness"];

  oldCurses.forEach(prop => {
    if (cursedConfig[prop]) {
      switch (prop) {
        case "hasCursedBelt":
          toggleCurseItem({ name: "PolishedChastityBelt", group: "ItemPelvis", forceAdd: true });
          break;
        case "hasCursedLatex":
          toggleCurseItem({ name: "SeamlessCatsuit", group: "Suit", forceAdd: true });
          toggleCurseItem({ name: "SeamlessCatsuit", group: "SuitLower", forceAdd: true });
          toggleCurseItem({ name: "LatexCorset1", group: "ItemTorso", forceAdd: true });
          toggleCurseItem({ name: "Catsuit", group: "Gloves", forceAdd: true });
          toggleCurseItem({ name: "ThighHighLatexHeels", group: "ItemBoots", forceAdd: true });
          toggleCurseItem({ name: "LatexBallMuzzleGag", group: "ItemMouth", forceAdd: true });
          toggleCurseItem({ name: "LatexPants1", group: "ClothLower", forceAdd: true });
          toggleCurseItem({ name: "BoxTieArmbinder", group: "ItemArms", forceAdd: true });
          break;
        case "hasCursedBlindfold":
          toggleCurseItem({ name: "FullBlindfold", group: "ItemHead", forceAdd: true });
          break;
        case "hasCursedHood":
          popChatSilent({ Tag: "HoodMigration" }, "System");
          break;
        case "hasCursedEarplugs":
          toggleCurseItem({ name: "HeavyDutyEarPlugs", group: "ItemEars", forceAdd: true });
          break;
        case "hasCursedDildogag":
          toggleCurseItem({ name: "DildoPlugGag", group: "ItemMouth", forceAdd: true });
          break;
        case "hasCursedPanties":
          toggleCurseItem({ name: "PantyStuffing", group: "ItemMouth", forceAdd: true });
          break;
        case "hasCursedGag":
          toggleCurseItem({ name: "BallGag", group: "ItemMouth", forceAdd: true });
          break;
       /* case "hasCursedMittens":
          toggleCurseItem({ name: "LeatherMittens", group: "ItemHands", forceAdd: true });
          break;*/
        case "hasCursedPaws":
          toggleCurseItem({ name: "PawMittens", group: "ItemHands", forceAdd: true });
          break;
        case "hasCursedScrews":
          toggleCurseItem({ name: "ScrewClamps", group: "ItemNipplesPiercings", forceAdd: true });
          break;
        case "hasCursedPony":
          toggleCurseItem({ name: "LatexCorset1", group: "ItemTorso", forceAdd: true });
          toggleCurseItem({ name: "LeatherLegCuffs", group: "ItemLegs", forceAdd: true });
          toggleCurseItem({ name: "ArmbinderJacket", group: "ItemArms", forceAdd: true });
          toggleCurseItem({ name: "SeamlessCatsuit", group: "Suit", forceAdd: true });
          toggleCurseItem({ name: "SeamlessCatsuit", group: "SuitLower", forceAdd: true });
          toggleCurseItem({ name: "Catsuit", group: "Gloves", forceAdd: true });
          toggleCurseItem({ name: "PonyBoots", group: "ItemBoots", forceAdd: true });
          toggleCurseItem({ name: "HarnessPonyBits", group: "ItemMouth", forceAdd: true });
          break;
        case "hasCursedRopes":
          toggleCurseItem({ name: "HempRope", group: "ItemFeet", forceAdd: true });
          toggleCurseItem({ name: "HempRope", group: "ItemLegs", forceAdd: true });
          toggleCurseItem({ name: "HempRope", group: "ItemArms", forceAdd: true });
          break;
        case "hasCursedMaid":
          toggleCurseItem({ name: "MaidOutfit1", group: "Cloth", forceAdd: true });
          toggleCurseItem({ name: "MaidHairband1", group: "Hat", forceAdd: true });
          break;
        case "hasCursedNakedness":
          procCursedNaked(true);
          break;
        default:
          break;
      }
    }
  });

  //Merges Enforced and Nicknames 
  CheckEnforceMigration();

  //Clean deprecated props
  const toDelete = ["punishmentColor", "shouldntOrgasm", "hasCursedBunny", "lastWardrobeLock", "cursedItems", "nicknames", "enforced", ...oldCurses];
  toDelete.forEach(prop => delete cursedConfig[prop]);

  //Cleans dupes and bad stuff
  cursedConfig.owners = cursedConfig.owners.filter((m, i) => cursedConfig.owners.indexOf(m) == i && !isNaN(m));
  cursedConfig.mistresses = cursedConfig.mistresses.filter((m, i) => cursedConfig.mistresses.indexOf(m) == i && !isNaN(m));
  cursedConfig.blacklist = cursedConfig.blacklist.filter((m, i) => cursedConfig.blacklist.indexOf(m) == i && !isNaN(m));
  cursedConfig.bannedWords = cursedConfig.bannedWords.filter((m, i) => cursedConfig.bannedWords.indexOf(m) == i);

  // Verify all optin commands exist in player object, and removes non-existing commands
  cursedConfig.optinCommands = cursedConfig.optinCommands.filter(COC =>
    cursedConfigInit.optinCommands.map(OC => OC.command).includes(COC.command)
  );
  cursedConfigInit.optinCommands.forEach(OC => { 
    if (!cursedConfig.optinCommands.find(COC => OC.command === COC.command)) { 
      cursedConfig.optinCommands.push(OC);
    }
  });
}