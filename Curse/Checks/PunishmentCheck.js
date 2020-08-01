/** Function to check if a punishment must be applied, returns true if one has been applied, works in severity stages. More can be added, items can be changed, etc. */
function PunishmentCheck() { 
  // We check if a restraint is invalid
  for (i = cursedConfig.punishmentRestraints.length - 1; i >= 0; i--) { 
    if (!Asset.find(A => A.Name === cursedConfig.punishmentRestraints[i].name && A.Group.Name === cursedConfig.punishmentRestraints[i].group)) { 
      delete cursedConfig.punishmentRestraints[i];
      popChatSilent({ Tag: "ErrorInvalidPunishment"}, "System");
    }
  }
  
  cursedConfig.punishmentRestraints = cursedConfig.punishmentRestraints.filter(PR => PR);
  
  // Check if we need to punish
  const difference = cursedConfig.strikes - cursedConfig.lastPunishmentAmount;
  const stageFactor = cursedConfig.strictness * 15;
  let r = false;
  if (difference > stageFactor && !cursedConfig.punishmentsDisabled) {
    //More restraints per stages, resets every week
    cursedConfig.punishmentRestraints.forEach(PR => { 
        r = WearPunishment(PR.stage, PR.name, PR.group) || r;
    });
    if (r) {
      TryPopTip(41);
      SendChat({ Tag: "PunishmentTriggered"});
    }
    cursedConfig.lastPunishmentAmount = cursedConfig.strikes;
  }
  return r;
}

/** Wears a restraint as part of a punishment 
 * @param {number} stage - stage required for it to be applied
 * @param {string} name - Name of the restraint
 * @param {string} group - Name of the item group
 * @returns {boolean} If the restraint was applied
*/
function WearPunishment(stage, name, group) { 
  const stageFactor = cursedConfig.strictness * 15;
  let currentStage = cursedConfig.strikes / stageFactor;
  if (stage <= currentStage) {
    if (itemIsAllowed(name, group)) {
      InventoryWear(Player, name, group, GetColorSlot(group), 15);
      return true;
    }
  }
  return false;
}