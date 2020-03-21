//************************************ LONG STRINGS ************************************//
function InitHelpMsg() { 
    window.helpTxt = `<pre>Your calling ID: ${cursedConfig.commandChar + cursedConfig.slaveIdentifier}
    ${ChatRoomCharacter.map(el => el.Name).filter(n => n == cursedConfig.slaveIdentifier).length > 1 ? "WARNING: Potential clash with another character!" : ""}

    //WEARER FUNCTIONS//
    -help
    -issilent [on/off]
    -showstrikes
    -showmistresses
    -showowners
    -showenforced
    -showblacklist
    -blacklist [on/off] [a member number]
    -mistress [on/off] [a member number]
    -owner [on/off] [a member number]
    -changecommandchar [! / & / $ / #]
    -changeidentifier [new identifier]

    //PUBLIC FUNCTIONS//
    -help
    -enforce [on/off]
    -punish
    -edge
    -asylumtimeleft

    //MISTRESS FUNCTIONS//
    -mute [on/off]
    -banword [on/off] [the word itself]
    -banbegging [on/off]
    -banfirstperson [on/off]
    -clearbannedwords
    -mistress [on/off] [a member number]
    -enforce [on/off] [a member number]
    -cursedclothes [on/off]
    -cursedorgasms [on/off]
    -cursedspeech [on/off]
    -cursedlatex [on/off]
    -cursedcollar [on/off]
    -public [on/off]
    -deactivateonpresence [on/off]
    -cursedmittens [on/off]
    -cursedgag [on/off]
    -cursedblindfold [on/off]
    -cursedhood [on/off]
    -cursedearplugs [on/off]
    -curseddildogag [on/off]
    -cursedpanties [on/off]

    //OWNER FUNCTIONS//
    -cursedbelt [on/off]
    -onlyonpresence [on/off]
    -enforceentrymessage [on/off]
    -entrymessage [sentence]
    -owner [on/off] [a member number]
    -asylum [nb of hours] 
    DEACTIVATED BY DEF: -forcedsay [sentence]
    DEACTIVATED BY DEF: -say [sentence]
    DEACTIVATED BY DEF: -fullblockchat [on/off]

    ---------
    Made by ace (12401) - Ace__#5558
    Official release: V${currentVersion} 
    </pre>`;
}
