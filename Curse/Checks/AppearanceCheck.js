/** 
 * Function that checks the current appearance of a character to patch in the rule items (curses)
 * IMPORTANT: Returns true if character needs refresh when using something else than an activator 
 */
function AppearanceCheck() {
    var isActivated = !(cursedConfig.mistressIsHere && cursedConfig.disaledOnMistress)
        && (
            (cursedConfig.enabledOnMistress && cursedConfig.ownerIsHere)
            || !cursedConfig.enabledOnMistress
        );
    let r = false;
    if (isActivated) {
        cursedConfig.genericProcs = [];

        //Checks if settings are respected
        //Cursed collar
        if (
            cursedConfig.hasCursedKneel
            && Player.CanKneel()
            && !Player.Pose.includes("Kneel")
        ) {
            SendChat("The cursed collar on " + Player.Name + "'s neck gives her an extreme shock, forcing her to get on her knees.");
            KneelAttempt();
            cursedConfig.strikes++;
        }

        //Locked appearance (now all curse items)
        cursedConfig.cursedAppearance.forEach(({ name, group }) => {
            var item = Player.Appearance.filter(el => el.Asset.Group.Name == group && el.Asset.Name == name);
            if (
                itemIsAllowed(Player, group) && item.length == 0 && name != ""
            ) {
                procGenericItem(name, group);
                SendChat(`The curse on ${Player.Name} restores her cursed item(s).`);
                cursedConfig.strikes += 3;
            } else if (name == "" && itemNeedsRemoving(group)) {
                InventoryRemove(Player, group);
                SendChat(`The curse on ${Player.Name} removes unallowed item(s).`);
            }
        });

        //Cursed Orgasms
        if (
            cursedConfig.hasCursedOrgasm
            &&
            (
                InventoryGet(Player, "ItemButt")
                && InventoryGet(Player, "ItemButt").Asset.Effect.includes("Egged")
                && (!InventoryGet(Player, "ItemButt").Property ||
                    InventoryGet(Player, "ItemButt").Property.Intensity != 3)
            ) || (
                InventoryGet(Player, "ItemVulva")
                && InventoryGet(Player, "ItemVulva").Asset.Effect.includes("Egged")
                && (!InventoryGet(Player, "ItemVulva").Property || InventoryGet(Player, "ItemVulva").Property.Intensity != 3)
            ) || (
                InventoryGet(Player, "ItemNipples")
                && InventoryGet(Player, "ItemNipples").Asset.Effect.includes("Egged")
                && (!InventoryGet(Player, "ItemNipples").Property || InventoryGet(Player, "ItemNipples").Property.Intensity != 3)
            ) || (
                InventoryGet(Player, "ItemVulvaPiercings")
                && InventoryGet(Player, "ItemVulvaPiercings").Asset.Effect.includes("Egged")
                && (!InventoryGet(Player, "ItemVulvaPiercings").Property || InventoryGet(Player, "ItemVulvaPiercings").Property.Intensity != 3)
            ) || (
                InventoryGet(Player, "ItemNipplesPiercings")
                && InventoryGet(Player, "ItemNipplesPiercings").Asset.Effect.includes("Egged")
                && (!InventoryGet(Player, "ItemNipplesPiercings").Property || InventoryGet(Player, "ItemNipplesPiercings").Property.Intensity != 3)
            ) || (
                InventoryGet(Player, "ItemDevices")
                && InventoryGet(Player, "ItemDevices").Asset.Effect.includes("Egged")
                && (!InventoryGet(Player, "ItemDevices").Property || InventoryGet(Player, "ItemDevices").Property.Intensity != 3)
            ) || (
                InventoryGet(Player, "ItemFeet")
                && InventoryGet(Player, "ItemFeet").Asset.Effect.includes("Egged")
                && (!InventoryGet(Player, "ItemFeet").Property || InventoryGet(Player, "ItemFeet").Property.Intensity != 3)
            )
        ) {

            SendChat("The curse on " + Player.Name + " brings the vibrators back to their maximum intensity.");
            procCursedOrgasm();
            cursedConfig.strikes++;
        }
    }
    return r;
}