/**
 * Sets the currently active dictionary. Defaults to EN if not found
 * @param {string} language - Dictionary to use 
 */
function SetDictionary(language) { 
    switch (language) {
        case "FR":
            _.setTranslation({ ...cursedEN, ...cursedFR });
            break;
        default:
            _.setTranslation(cursedEN);
            break;
    }
}

/**
 * Sets the curse back to the wearer's dictionary
 * @param {number} - Member number for which to set the dictionary for, defaults to EN
 */
function SetMemberDictionary(MemberNumber) { 
    SetDictionary((cursedConfig.translation.find(EL => EL.MN == MemberNumber) || {}).lang);
}

/**
 * Sets the requested dictionary for a given member
 * @param {number} MemberNumber - User for which to set the language
 * @param {string} lang - Dictionary to use 
 */
function DictionaryRequest(MemberNumber, lang) { 
    let translation = cursedConfig.translation.filter(EL => EL.MN != MemberNumber);
    cursedConfig.translation = [...translation, {MN: MemberNumber, lang}];
}

/** 
 * Gets a requested tag from the dictionary 
 * @param {object} txt - The Tag/Param object
 */
function CT(txt) { 
    return _(txt.Tag, ...(txt.Param || []));
}