/** Function to check if a punishment must be applied, returns true if one has been applied, works in severity stages. More can be added, items can be changed, etc. */
function PunishmentCheck() { 
  let difference = cursedConfig.strikes - cursedConfig.lastPunishmentAmount;
  let r = false;
  if (difference > 15 && !cursedConfig.punishmentsDisabled) {
    //More restraints per stages, resets every week
    let stage = cursedConfig.strikes / 15;
    if (stage >= 5) {
      //Restraints
      if (itemIsAllowed("PantyStuffing", "ItemMouth")) {
        InventoryWear(Player, "PantyStuffing", "ItemMouth", cursedConfig.punishmentColor, 15);
        r = true;
      }
      if (itemIsAllowed("HarnessBallGag", "ItemMouth2")) {
        InventoryWear(Player, "HarnessBallGag", "ItemMouth2", cursedConfig.punishmentColor, 15);
        r = true;
      }
      if (itemIsAllowed("SteelMuzzleGag", "ItemMouth3")) {
        InventoryWear(Player, "SteelMuzzleGag", "ItemMouth3", cursedConfig.punishmentColor, 15);
        r = true;
      }
    }
    if (stage >= 4) {
      //Restraints
      if (itemIsAllowed("FullBlindfold", "ItemHead")) {
        InventoryWear(Player, "FullBlindfold", "ItemHead", cursedConfig.punishmentColor, 15);
        r = true;
      }
    }
    if (stage >= 3) {
      //Restraints
      if (itemIsAllowed("Chains", "ItemArms")) {
        InventoryWear(Player, "Chains", "ItemArms", cursedConfig.punishmentColor, 15);
        r = true;
      }
    }
    if (stage >= 2) {
      //Restraints
      if (itemIsAllowed("Chains", "ItemFeet")) {
        InventoryWear(Player, "Chains", "ItemFeet", cursedConfig.punishmentColor, 15);
        r = true;
      }
    }
    if (stage >= 1) {
      //Restraints
      if (itemIsAllowed("Chains", "ItemLegs")) {
        InventoryWear(Player, "Chains", "ItemLegs", cursedConfig.punishmentColor, 15);
        r = true;
      }
    }
    if (r) {
      TryPopTip(41);
      SendChat("The curse on " + Player.Name + " punishes her.");
    }
    cursedConfig.lastPunishmentAmount = cursedConfig.strikes;
  }
  return r;
}