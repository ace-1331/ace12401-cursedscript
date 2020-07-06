function InitStartup() {
    if (cursedConfig.hasIntenseVersion) {
        popChatSilent("Intense mode is on (risky).", "System");
    }
    /*
    //Resets Strikes when it has been a week
    if (cursedConfig.strikeStartTime + 604800000 < Date.now()) {
        popChatSilent("A new week has begun, your strikes have reset. (Might be a good time to check for updates!)", "System");
        cursedConfig.strikeStartTime = Date.now();
        cursedConfig.strikes = 0;
        cursedConfig.lastPunishmentAmount = 0;
    }
*/
    //Enables the hidden curse item to display who has the curse
    if (AssetFemale3DCG.filter(G => G.Group == "ItemHidden")[0] && AssetFemale3DCG.filter(G => G.Group == "ItemHidden")[0].Asset) {
        AssetFemale3DCG.filter(G => G.Group == "ItemHidden")[0].Asset.push({ Name: "Curse", Visible: false, Value: -1 });
        AssetFemale3DCG.filter(G => G.Group == "ItemHidden")[0].Asset.push({ Name: "Curse" + currentVersion, Visible: false, Value: -1 });
        AssetLoadAll();
        InventoryAdd(Player, "Curse", "ItemHidden");
        InventoryAdd(Player, "Curse" + currentVersion, "ItemHidden");
        // Always re-enable the version tip to promote staying up to date
        cursedConfig.seenTips = cursedConfig.seenTips.filter(ST => ST !== 49);
    }

    // Blindfolds
    if (cursedConfig.hasFullBlindMode) {
        Asset.forEach(A => A.Effect && A.Effect.find(E => E.includes("Blind")) ? A.Effect.push("BlindHeavy") : '');
    }
    
    // DC Prevention
    if (cursedConfig.hasIntenseVersion && cursedConfig.hasDCPrevention && !Player.CanWalk() && cursedConfig.lastChatroom) {
        const roomToGoTo = cursedConfig.lastChatroom;
        delete cursedConfig.lastChatroom;
        SendToRoom(roomToGoTo);
        NotifyOwners("DC prevention enabled, the wearer was sent back to the room she was previously locked in. If this is not a room you should be locked in, please disable the curse, relog and go into another room before reactivating the curse, avoid disturbing others.", true);
        TryPopTip(43);

      }
}