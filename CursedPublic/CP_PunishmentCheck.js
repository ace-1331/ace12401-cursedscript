function PunishmentCheck() { 
    let difference = cursedConfig.strikes - cursedConfig.lastPunishmentAmount;
    if (difference > 10 && !cursedConfig.punishmentsDisabled) {
        //More restraints per stages, resets every week
        let stage = cursedConfig.strikes / 10;
        if (stage >= 5) {
            //Restraints
            if (InventoryGet(Player, "ItemMouth") == null) {
                InventoryAdd(Player, "PantyStuffing", "ItemMouth");
                InventoryAdd(Player, "HarnessBallGag", "ItemMouth2");
                InventoryAdd(Player, "SteelMuzzleGag", "ItemMouth3");
                InventoryWear(Player, "PantyStuffing", "ItemMouth", cursedConfig.punishmentColor, 15);
                InventoryWear(Player, "HarnessBallGag", "ItemMouth2", cursedConfig.punishmentColor, 15);
                InventoryWear(Player, "SteelMuzzleGag", "ItemMouth3", cursedConfig.punishmentColor, 15);
            }
        }
        if (stage >= 4) {
            //Restraints
            if (InventoryGet(Player, "ItemHead") == null) {
                InventoryAdd(Player, "FullBlindfold", "ItemHead");
                InventoryWear(Player, "FullBlindfold", "ItemHead", cursedConfig.punishmentColor, 15);
            }
        }
        if (stage >= 3) {
            //Restraints
            if (InventoryGet(Player, "ItemArms") == null) {
                InventoryAdd(Player, "Chains", "ItemArms");
                InventoryWear(Player, "Chains", "ItemArms", cursedConfig.punishmentColor, 15);
            }
        }
        if (stage >= 2) {
            //Restraints
            if (InventoryGet(Player, "ItemFeet") == null) {
                InventoryAdd(Player, "Chains", "ItemFeet");
                InventoryWear(Player, "Chains", "ItemFeet", cursedConfig.punishmentColor, 15);
            }
        }
        if (stage >= 1) {
            //Restraints
            if (InventoryGet(Player, "ItemLegs") == null) {
                InventoryAdd(Player, "Chains", "ItemLegs");
                InventoryWear(Player, "Chains", "ItemLegs", cursedConfig.punishmentColor, 15);
            }
        }
        SendChat("The curse on " + Player.Name + " punishes her.");
        cursedConfig.lastPunishmentAmount = cursedConfig.strikes;
    }
}