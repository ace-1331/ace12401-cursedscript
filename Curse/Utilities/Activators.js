//************************************  Curse Activations ************************************//
/** Toggles a curse on any given item */
function procGenericItem(item, group) {
    //Makes sure the player has the items
    if (!cursedConfig.genericProcs.includes(group)) {
        cursedConfig.genericProcs.push(group);
        if (Player.BlockItems.filter(it => it.Name == item && it.Group == group).length !== 0) {
            popChatSilent("You currently have a curse activated for which the item is blocked, the curse will not apply the following item, please disable the curse using the item or unblock the item: " + item + " " + group, "System");
        }
        if (item != "" && itemIsAllowed(item, group)) {
            InventoryWear(Player, item, group, GetColorSlot(group));
            cursedConfig.toUpdate.push(group);
            cursedConfig.mustRefresh = true;
            popChatSilent(`${(Asset.find(A => A.Name == item) || {}).Description} was restored. (${(AssetGroup.find(G => G.Name == group) || {}).Description})`);
        } else if (item == "" && itemNeedsRemoving(group)) {
            InventoryRemove(Player, group);
            cursedConfig.toUpdate.push(group);
            cursedConfig.mustRefresh = true;
            popChatSilent(`${(Asset.find(A => A.Name == item) || {}).Description} was removed. (${(AssetGroup.find(G => G.Name == group) || {}).Description})`);
        }
    } else {
        popChatSilent("Error P04: The curse was deactivated because it tried to apply more than one curse to the same group. Please report this issues and how it happened. Adjust your settings accordingly to prevent this error. (Please disable conflicting curses)", "Error");
        cursedConfig.isRunning = false;
    }
}

/** Triggers cursed naked */
function procCursedNaked() {
    ["Cloth", "ClothLower", "ClothAccessory", "Suit", "SuitLower", "Bra", "Panties", "Socks", "Shoes", "Hat", "Gloves"]
        .forEach(group => {
            toggleCurseItem({ name: "", group, forceAdd: true });
        });
}

/** Triggers cursed vibrators */
function procCursedOrgasm() {
    //Turns them to max
    if (
        InventoryGet(Player, "ItemDevices")
        && InventoryGet(Player, "ItemDevices").Asset.Effect.includes("Egged")
    ) {
        let property = InventoryGet(Player, "ItemDevices").Property || {};
        property.Intensity = 3;
        if (!property.Effect) property.Effect = []
        property.Effect = [...property.Effect, "Egged", "Vibrating"];
        property.Effect = property.Effect.filter((e, i) => property.Effect.indexOf(e) === i);
        InventoryGet(Player, "ItemDevices").Property = property;
        cursedConfig.toUpdate.push("ItemDevices");
    }
    if (
        InventoryGet(Player, "ItemFeet")
        && InventoryGet(Player, "ItemFeet").Asset.Effect.includes("Egged")
    ) {
        let property = InventoryGet(Player, "ItemFeet").Property || {};
        property.Intensity = 3;
        if (!property.Effect) property.Effect = []
        property.Effect = [...property.Effect, "Egged", "Vibrating"];
        property.Effect = property.Effect.filter((e, i) => property.Effect.indexOf(e) === i);
        InventoryGet(Player, "ItemFeet").Property = property;
        cursedConfig.toUpdate.push("ItemFeet");
    }
    if (
        InventoryGet(Player, "ItemButt")
        && InventoryGet(Player, "ItemButt").Asset.Effect.includes("Egged")
    ) {
        let property = InventoryGet(Player, "ItemButt").Property || {};
        property.Intensity = 3;
        property.InflateLevel = 4;
        if (!property.Effect) property.Effect = []
        property.Effect = [...property.Effect, "Egged", "Vibrating"];
        property.Effect = property.Effect.filter((e, i) => property.Effect.indexOf(e) === i);
        InventoryGet(Player, "ItemButt").Property = property;
        cursedConfig.toUpdate.push("ItemButt");
    }
    if (
        InventoryGet(Player, "ItemNipplesPiercings")
        && InventoryGet(Player, "ItemNipplesPiercings").Asset.Effect.includes("Egged")
    ) {
        let property = InventoryGet(Player, "ItemNipplesPiercings").Property || {};
        property.Intensity = 3;
        if (!property.Effect) property.Effect = []
        property.Effect = [...property.Effect, "Egged", "Vibrating"];
        property.Effect = property.Effect.filter((e, i) => property.Effect.indexOf(e) === i);
        InventoryGet(Player, "ItemNipplesPiercings").Property = property;
        cursedConfig.toUpdate.push("ItemNipplesPiercings");
    }
    if (
        InventoryGet(Player, "ItemVulvaPiercings")
        && InventoryGet(Player, "ItemVulvaPiercings").Asset.Effect.includes("Egged")
    ) {
        let property = InventoryGet(Player, "ItemVulvaPiercings").Property || {};
        property.Intensity = 3;
        if (!property.Effect) property.Effect = []
        property.Effect = [...property.Effect, "Egged", "Vibrating"];
        property.Effect = property.Effect.filter((e, i) => property.Effect.indexOf(e) === i);
        InventoryGet(Player, "ItemVulvaPiercings").Property = property;
        cursedConfig.toUpdate.push("ItemVulvaPiercings");
    }
    if (
        InventoryGet(Player, "ItemNipples")
        && InventoryGet(Player, "ItemNipples").Asset.Effect.includes("Egged")
    ) {
        let property = InventoryGet(Player, "ItemNipples").Property || {};
        property.Intensity = 3;
        if (!property.Effect) property.Effect = []
        property.Effect = [...property.Effect, "Egged", "Vibrating"];
        property.Effect = property.Effect.filter((e, i) => property.Effect.indexOf(e) === i);
        InventoryGet(Player, "ItemNipples").Property = property;
        cursedConfig.toUpdate.push("ItemNipples");
    }
    if (
        InventoryGet(Player, "ItemVulva")
        && InventoryGet(Player, "ItemVulva").Asset.Effect.includes("Egged")
    ) {
        let property = InventoryGet(Player, "ItemVulva").Property || {};
        property.Intensity = 3;
        property.InflateLevel = 4;
        if (!property.Effect) property.Effect = []
        property.Effect = [...property.Effect, "Egged", "Vibrating"];
        property.Effect = property.Effect.filter((e, i) => property.Effect.indexOf(e) === i);
        InventoryGet(Player, "ItemVulva").Property = property;
        cursedConfig.toUpdate.push("ItemVulva");
    }
    cursedConfig.mustRefresh = true;
}

/** Async function that will check if a character kneels within 30 seconds */
async function checkKneeling(sender) {
    // Kneel on enforced
    if (ChatRoomCharacter.map(char => char.MemberNumber.toString()).includes(sender)) {
        let startDate = Date.now();
        popChatSilent("Reminder: You must be on your knees when you first see someone in this room.(Someone is enforced)", "System");
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
        SendChat(Player.Name + " angers the curse on her as she forgets to kneel.");
        cursedConfig.strikes += 5;
        KneelAttempt();
    }
}