function PunishmentCheck() { 
    let difference = cursedConfig.strikes - cursedConfig.lastPunishmentAmount;
    let r = false;
    if (difference > 15 && !cursedConfig.punishmentsDisabled) {
        //More restraints per stages, resets every week
        let stage = cursedConfig.strikes / 15;
        if (stage >= 5) {
            //Restraints
            if (InventoryGet(Player, "ItemMouth") == null) {
                InventoryWear(Player, "PantyStuffing", "ItemMouth", cursedConfig.punishmentColor, 15);
                InventoryWear(Player, "HarnessBallGag", "ItemMouth2", cursedConfig.punishmentColor, 15);
                InventoryWear(Player, "SteelMuzzleGag", "ItemMouth3", cursedConfig.punishmentColor, 15);
                r = true;
            }
        }
        if (stage >= 4) {
            //Restraints
            if (InventoryGet(Player, "ItemHead") == null) {
                InventoryWear(Player, "FullBlindfold", "ItemHead", cursedConfig.punishmentColor, 15);
                r = true;
            }
        }
        if (stage >= 3) {
            //Restraints
            if (InventoryGet(Player, "ItemArms") == null) {
                InventoryWear(Player, "Chains", "ItemArms", cursedConfig.punishmentColor, 15);
                r = true;
            }
        }
        if (stage >= 2) {
            //Restraints
            if (InventoryGet(Player, "ItemFeet") == null) {
                InventoryWear(Player, "Chains", "ItemFeet", cursedConfig.punishmentColor, 15);
                r = true;
            }
        }
        if (stage >= 1) {
            //Restraints
            if (InventoryGet(Player, "ItemLegs") == null) {
                InventoryWear(Player, "Chains", "ItemLegs", cursedConfig.punishmentColor, 15);
                r = true;
            }
        }
        if (r) {
            SendChat("The curse on " + Player.Name + " punishes her.");
        }
        cursedConfig.lastPunishmentAmount = cursedConfig.strikes;
    }
    return r;
}