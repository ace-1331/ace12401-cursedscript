/** Function to check if a punishment must be applied, returns true if one has been applied, works in severity stages. More can be added, items can be changed, etc. */
function PunishmentCheck() { 
  let difference = cursedConfig.strikes - cursedConfig.lastPunishmentAmount;
  let r = false;
  if (difference > 15 && !cursedConfig.punishmentsDisabled) {
    //More restraints per stages, resets every week
    r = WearPunishment(1, "Chains", "ItemLegs") || r;
    r = WearPunishment(2, "Chains", "ItemFeet") || r;
    r = WearPunishment(3, "Chains", "ItemArms") || r;
    r = WearPunishment(4, "FullBlindfold", "ItemHead") || r;
    r = WearPunishment(5, "PantyStuffing", "ItemMouth") || r;
    r = WearPunishment(5, "HarnessBallGag", "ItemMouth2") || r;
    r = WearPunishment(5, "SteelMuzzleGag", "ItemMouth3") || r;
    if (r) {
      TryPopTip(41);
      SendChat("The curse on " + Player.Name + " punishes her.");
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
  let currentStage = cursedConfig.strikes / 15;
  if (stage >= currentStage) {
    if (itemIsAllowed(name, group)) {
      InventoryWear(Player, name, group, GetColorSlot(group), 15);
      return true;
    }
  }
  return false;
}