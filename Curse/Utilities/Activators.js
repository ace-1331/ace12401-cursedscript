//************************************  Curse Activations ************************************//
/** Toggles a curse on any given item 
 * @param {string} item - the item name from the asset file
 * @param {string} group - the item group from the asset file
 * @param {object} property - the item properties saved
*/
function procGenericItem(item, group, property) {
  //Removes curses on invalid items
  if (item && !Asset.find(A => A.Name === item && A.Group.Name === group)) {
    cursedConfig.cursedAppearance = cursedConfig.cursedAppearance.filter(item => item.group != group);
    popChatSilent({ Tag: "InvalidCurse" }, "System");
    return;
  }

  //Makes sure the player has the items
  if (!Array.isArray(cursedConfig.genericProcs)) cursedConfig.genericProcs = [];
  if (!cursedConfig.genericProcs.includes(group)) {
    cursedConfig.genericProcs.push(group);
    if (Player.BlockItems.filter(it => it.Name == item && it.Group == group).length !== 0) {
      popChatSilent({ Tag: "BlockedCurse", Param: [item, group] }, "System");
      cursedConfig.cursedAppearance = cursedConfig.cursedAppearance.filter(item => item.group != group);
    }
    if (item != "" && itemIsAllowed(item, group)) {
      InventoryWear(Player, item, group, GetColorSlot(group));
      InventoryGet(Player, group).Property = property;
      cursedConfig.toUpdate.push(group);
      cursedConfig.mustRefresh = true;
      popChatSilent({
        Tag: "RestoredItem",
        Param: [
          (Asset.find(A => A.Name == item) || {}).Description,
          (AssetGroup.find(G => G.Name == group) || {}).Description
        ]
      });
    } else if (item == "" && itemNeedsRemoving(group)) {
      InventoryRemove(Player, group);
      cursedConfig.toUpdate.push(group);
      cursedConfig.mustRefresh = true;
      popChatSilent({
        Tag: "RemovedItem",
        Param: [
          (Asset.find(A => A.Name == item) || {}).Description,
          (AssetGroup.find(G => G.Name == group) || {}).Description
        ]
      });
    }
  } else {
    popChatSilent({ Tag: "Error P04" }, "Error");
    cursedConfig.isRunning = false;
  }
}

/** Triggers cursed naked 
 * @param {boolean} isAdd - whether this is to add or remove clothes
*/
function procCursedNaked(isAdd) {
  ["Cloth", "ClothLower", "ClothAccessory", "Suit", "SuitLower", "Bra", "Panties", "Socks", "Shoes", "Hat", "Gloves"]
    .forEach(group => {
      toggleCurseItem({ name: "", group, [isAdd ? "forceAdd" : "forceRemove"]: true, isSilent: true });
    });
  SendChat({ Tag: (isAdd ? "ClothesArise" : "ClothesLift") });
}

/** Triggers cursed vibrators 
 * @param {string} group - the item group from the asset file for which to trigger max vibes
*/
function procCursedOrgasm(group) {
  //Turns them to max
  if (
    InventoryGet(Player, group)
    && Array.isArray(InventoryGet(Player, group).Asset.Effect)
    && InventoryGet(Player, group).Asset.Effect.includes("Egged")
  ) {
    let property = InventoryGet(Player, group).Property || {};
    property.Intensity = (cursedConfig.vibratorIntensity != null ? cursedConfig.vibratorIntensity : 3);
    if (!property.Effect) property.Effect = [];
    property.Effect = [...property.Effect, "Egged", "Vibrating"];
    property.Effect = property.Effect.filter((e, i) => property.Effect.indexOf(e) === i);
    InventoryGet(Player, group).Property = property;
    cursedConfig.toUpdate.push(group);
    cursedConfig.mustRefresh = true;
  }
}

/** Async function that will check if a character kneels within 30 seconds 
 * @param {string} sender - the member for which kneeling is required
*/
async function checkKneeling(sender) {
  // Kneel on enforced
  if (ChatRoomCharacter.map(char => char.MemberNumber.toString()).includes(sender)) {
    let startDate = Date.now();
    popChatSilent({ Tag: "WarnEnforce" }, "System");
    while (Date.now() < startDate + 30000) {
      if (Player.Pose.includes("Kneel") || Player.Pose.includes("ForceKneel")) {
        return;
      }
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  // When timer is over
  if (
    ChatRoomCharacter.map(char => char.MemberNumber.toString()).includes(sender)
    && Player.CanKneel()
  ) {
    SendChat({ Tag: "KneelAnger" });
    TriggerPunishment(1);
    KneelAttempt();
  }
}


/** Tries to make the wearer kneel */
function KneelAttempt() {
  if (Player.CanKneel() && !Player.Pose.includes("Kneel")) {
    CharacterSetActivePose(Player, (Player.ActivePose == null) ? "Kneel" : null);
    cursedConfig.mustRefresh = true;
  }
}

//Common Expression Triggers
function triggerInPain() {
  CharacterSetFacialExpression(Player, "Blush", "High");
  CharacterSetFacialExpression(Player, "Eyebrows", "Soft");
  CharacterSetFacialExpression(Player, "Fluids", "TearsHigh");
  CharacterSetFacialExpression(Player, "Mouth", "Sad");
  CharacterSetFacialExpression(Player, "Eyes", "Closed", 5);
}

function triggerInPleasure() {
  CharacterSetFacialExpression(Player, "Blush", "High");
  CharacterSetFacialExpression(Player, "Eyebrows", "Soft");
  CharacterSetFacialExpression(Player, "Fluids", "DroolMessy");
  CharacterSetFacialExpression(Player, "Mouth", "Ahegao");
  CharacterSetFacialExpression(Player, "Eyes", "VeryLewd");
}

/**
 * Toggles a cursed item on/off
 * @param {{name: string, group: string, forceAdd?: boolean, forceRemove?: boolean, isSilent?: boolean, dateOfRemoval?: number}} - Object containing all optional params
 * @returns true if the group does not exist
 */
function toggleCurseItem({ name, group, property, forceAdd, forceRemove, isSilent, dateOfRemoval }) {
  TryPopTip(16);
  let txtGroup = (AssetGroup.find(G => G.Name == group) || {}).Description || "items";

  if (group == "na") return true;

  let item = cursedConfig.cursedAppearance.filter(A => A.name == name && A.group == group)[0];
  cursedConfig.cursedAppearance = cursedConfig.cursedAppearance.filter(item => item.group != group);

  if ((!item || item.name != name) && (!forceRemove || forceAdd)) {
    cursedConfig.cursedAppearance.push({ name, group, dateOfRemoval, property });
    SaveColorSlot(group);
    procGenericItem(name, group, property);
    isSilent || SendChat({ Tag: "CurseArise", Param: [txtGroup.toLowerCase()] });
  } else if (!forceAdd) {
    isSilent || SendChat({ Tag: "CurseLift", Param: [txtGroup.toLowerCase()] });
    if (cursedConfig.hasRestraintVanish)
      restraintVanish(group);
  }
}

/**
 * Function to convert text parameter to a working item group
 * @param {string} group - the group as it would be typed
 * @param {number} permission - the permission level where (3 clubowner, 2 owners, 1 mistress)
 * @returns {string} The item group from AssetGroup
 */
function textToGroup(group, permission) {
  if (!permission) permission = 1;

  if (permission >= 1) {
    switch (group.toLowerCase()) {
      case "arms":
      case "arm":
        return "ItemArms";
      case "cloth":
        return "Cloth";
      case "clothaccessory":
      case "clothesaccessory":
        return "ClothAccessory";
      case "necklace":
        return "Necklace";
      case "suit":
        return "Suit";
      case "clothlower":
      case "lowercloth":
        return "ClothLower";
      case "suitlower":
      case "lowersuit":
        return "SuitLower";
      case "bra":
        return "Bra";
      case "panties":
        return "Panties";
      case "sock":
      case "socks":
        return "Socks";
      case "shoe":
      case "shoes":
        return "Shoes";
      case "hat":
        return "Hat";
        case "mask":
          return "Mask";
      case "gloves":
        return "Gloves";
      case "glasses":
        return "Glasses";
      case "tail":
      case "tailstrap":
      case "tailstraps":
        return "TailStraps";
      case "wing":
      case "wings":
        return "Wings";
      case "legs":
      case "leg":
        return "ItemLegs";
      case "vulva":
      case "pussy":
        return "ItemVulva";
      case "vulvapiercing":
      case "piercingvulva":
      case "piercingsvulva":
      case "vulvapiercings":
        return "ItemVulvaPiercings";
      case "butt":
        return "ItemButt";
      case "torso":
        return "ItemTorso";
      case "nipple":
      case "nipples":
        return "ItemNipples";
      case "nipplepiercing":
      case "nipplespiercing":
      case "nipplepiercings":
      case "nipplespiercings":
      case "piercingnipple":
      case "piercingnipples":
      case "piercingsnipple":
      case "piercingsnipples":
        return "ItemNipplesPiercings";
      case "breast":
      case "breasts":
        return "ItemBreast";
      case "hands":
      case "hand":
        return "ItemHands";
      case "gag":
      case "mouth":
      case "gag1":
      case "mouth1":
        return "ItemMouth";
      case "mouth2":
      case "gag2":
        return "ItemMouth2";
      case "mouth3":
      case "gag3":
        return "ItemMouth3";
      case "hood":
      case "hoods":
        return "ItemHood";
      case "nose":
        return "ItemNose";
      case "head":
      case "eye":
      case "eyes":
        return "ItemHead";
      case "ear":
      case "ears":
        return "ItemEars";
      case "boot":
      case "boots":
        return "ItemBoots";
      case "foot":
      case "feet":
        return "ItemFeet";
      case "device":
      case "devices":
        return "ItemDevices";
      case "misc":
      case "tray":
      case "maidtray":
        return "ItemMisc";
      /* 
      Need different implementation
      case "addon":
          return "ItemAddon";
      case "hidden":
      case "strap":
      case "straps":
          return "ItemHidden";*/
    }
  }
  if (permission >= 2) {
    switch (group.toLowerCase()) {
      case "hairaccessory":
      case "hairaccessory1":
        return "HairAccessory1";
      case "hairaccessory2":
        return "HairAccessory2";
      case "hairback":
        return "HairBack";
      case "hairfront":
        return "HairFront";
      case "pelvis":
        return "ItemPelvis";
      case "neckaccessory":
      case "neckaccessorie":
      case "neckaccessories":
        return "ItemNeckAccessories";
      case "neckrestraint":
      case "neckrestraints":
        return "ItemNeckRestraints";
    }
  }
  if (permission >= 3) {
    switch (group.toLowerCase()) {
      /*
              Need different implementation
              case "height":
                  return "Height";
              case "bodyupper":
              case "upperbody":
                  return "BodyUpper";
              case "bodylower":
              case "lowerbody":
                  return "BodyLower";
                  */
      case "collar":
        return "ItemNeck";
    }
  }
  return "na";
}

/** Keeps desired settings constantly. DO NOT CLOG THIS, LOOPS CONSTANTLY */
function AdjustSettings() {
  //Fixes empty name in case of weird mess up
  if (cursedConfig.slaveIdentifier == "")
    cursedConfig.slaveIdentifier = Player.Name;

  // Remove self own
  cursedConfig.mistresses = cursedConfig.mistresses.filter(M => M != Player.MemberNumber);
  cursedConfig.owners = cursedConfig.owners.filter(M => M != Player.MemberNumber);


  //Verifies if a mistress is here
  if (cursedConfig.disaledOnMistress || cursedConfig.enabledOnMistress) {
    cursedConfig.mistressIsHere = false;
    [...cursedConfig.mistresses, ...cursedConfig.owners].forEach(miss =>
      ChatRoomCharacter.map(char => char.MemberNumber.toString()).includes(miss)
        ? cursedConfig.mistressIsHere = true : ""
    );
  }

  //Verifies if an owner is here
  if (cursedConfig.enabledOnMistress) {
    cursedConfig.ownerIsHere = false;
    cursedConfig.owners.forEach(miss =>
      ChatRoomCharacter.map(char => char.MemberNumber.toString()).includes(miss)
        ? cursedConfig.ownerIsHere = true : ""
    );
  }

  // Sens dep char settings
  if (cursedConfig.hasForcedSensDep && cursedConfig.hasIntenseVersion) {
    Player.GameplaySettings.SensDepChatLog = "SensDepTotal";
    // Player.GameplaySettings.BlindDisableExamine = true;
  }

  // Meter off char settings
  if (cursedConfig.hasForcedMeterOff && cursedConfig.hasIntenseVersion) {
    if (Player.ArousalSettings.Active != "NoMeter" || Player.ArousalSettings.Active != "Inactive") {
      Player.ArousalSettings.Active = "NoMeter";
    }
  }

  // Meter locked char settings
  if (cursedConfig.hasForcedMeterLocked && cursedConfig.hasIntenseVersion) {
    Player.ArousalSettings.Active = "Automatic";
  }
  
  // No resist
  if (cursedConfig.hasNoResist) { 
    ActivityOrgasmGameResistCount = 1000000;
  }
  
  // Safeword off
  if (cursedConfig.hasNoEasyEscape && cursedConfig.hasIntenseVersion) {
    Player.GameplaySettings.EnableSafeword = false;
  }
  
  // Relog restraints to true
  if (cursedConfig.forcedRestraintsSetting) {
    Player.GameplaySettings.DisableAutoRemoveLogin = true;
  }
  
  //Making sure all names are up-to-date
  //Try catch in case the updated player is no longer there (extreme edge case)
  try {
    //Save real name, restores if curse is not running
    ChatRoomCharacter.forEach(char => {
      let user = cursedConfig.charData.find(c => c.Number == char.MemberNumber);
      if (!user || !user.SavedName || !user.Nickname) return;
      let NameToDisplay = cursedConfig.hasIntenseVersion && cursedConfig.isRunning && ChatRoomSpace != "LARP" && !cursedConfig.blacklist.includes(char.MemberNumber.toString()) && !Player.BlackList.includes(char.MemberNumber) && !Player.GhostList.includes(char.MemberNumber) ? user.Nickname : user.SavedName;
      char.Name = NameToDisplay;
      char.DisplayName = NameToDisplay;
      if (user.Nickname == user.SavedName) {
        user.RespectNickname = false;
      }
    });
  } catch (err) { console.error("Curse: failed to update a name", err); }
}

/** 
 * Triggers a punishment to be processed (strikes, report, etc.) 
 * @param {string} ID - The ID of the punishment
 * @param {string[]} [options] - Various params for the punishment text 
*/
function TriggerPunishment(ID, options) {
  if (cursedConfig.onRestart) {
    return;
  }
  let { Name, Value } = cursedPunishments.find(P => P.ID === ID) || {};
  if (Array.isArray(options)) {
    options.forEach((O, Idx) => Name = Name.replace(`%PARAM${Idx}%`, O));
  }
  if (!cursedConfig.punishmentsDisabled) {
    cursedConfig.strikes += Value;
  }
  const existingReport = cursedConfig.transgressions.find(T => T.Name == Name);
  if (existingReport) {
    existingReport.Count++;
    return;
  }
  cursedConfig.transgressions.push({ Name, Count: 1 });
}