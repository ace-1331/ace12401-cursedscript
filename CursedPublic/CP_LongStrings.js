//************************************ LONG STRINGS ************************************//
function InitHelpMsg() { 
    window.helpTxt = `<pre>Your calling ID: ${cursedConfig.commandChar + cursedConfig.slaveIdentifier}
    ${ChatRoomCharacter.map(el => el.Name).filter(n => n == cursedConfig.slaveIdentifier).length > 1 ? "WARNING: Potential clash with another character!" : ""}

    //WEARER FUNCTIONS//
    -help
    -issilent
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
    *NEW*-punishmentcolor ["#colorcode"]

    //PUBLIC FUNCTIONS//
    -help
    -enforce [on/off]
    -punish
    -edge
    -asylumtimeleft
    -draw [nb of cards] [players]
    -shuffle

    //MISTRESS FUNCTIONS//
    -kneel
    -mute
    -banword [on/off] [the word itself]
    -banbegging [on/off]
    -banfirstperson [on/off]
    -clearbannedwords
    -mistress [on/off] [a member number]
    -enforce [on/off] [a member number]
    -cursedclothes
    -cursedorgasms
    -cursedspeech
    -cursedlatex 
    *NEW*-cursedpony
    -cursedcollar
    -public 
    -deactivateonpresence
    -cursedmittens
    -cursedgag 
    -cursedblindfold
    -cursedhood
    -cursedearplugs
    -curseddildogag
    -cursedpanties
    -cursedscrews
    
    //OWNER FUNCTIONS//
    -cursedbelt
    -onlyonpresence 
    -enforceentrymessage 
    -entrymessage [sentence]
    -owner [on/off] [a member number]
    -asylum [nb of hours] 
    *NEW*-disablepunishments
    INTENSE VERSION: -forcedsay [sentence]
    INTENSE VERSION: -say [sentence]
    INTENSE VERSION: -fullblockchat
    *NEW*INTENSE VERSION: -enablesound
    *NEW*INTENSE VERSION: -sound ["oink", "meow", etc.]
    *NEW*INTENSE VERSION: -lockowner

    ---------
    Made by ace (12401) - Ace__#5558
    Official release: V${currentVersion} 
    </pre>`;
}
