//************************************ LONG STRINGS ************************************//
function InitHelpMsg() { 
    window.helpTxt = `<pre>Your calling ID: ${cursedConfig.commandChar + cursedConfig.slaveIdentifier}
    ${ChatRoomCharacter.map(el => el.Name).filter(n => n == cursedConfig.slaveIdentifier).length > 1 ? "WARNING: Potential clash with another character!" : ""}
    
    //WEARER FUNCTIONS//
    
    >>> Information <<<
    -help
    *NEW*-speechreport
    -showstrikes
    -showmistresses
    -showowners
    -showenforced
    -showblacklist
    -shownicknames
    *NEW*-configreport
    
    >>> Config Commands <<<
    -issilent
    -blacklist [on/off] [a member number]
    -mistress [on/off] [a member number]
    -owner [on/off] [a member number]
    -changecommandchar [! / & / $ / #]
    -changeidentifier [new identifier]
    *NEW*-punishmentcolor ["#colorcode"]
    *NEW*-forwardall

    >>> Other Commands <<<
    *NEW*INTENSE V:-nickname [Number] [Name]
    *NEW*INTENSE V:-deletenickname [Number] [Name]
    -draw [nb of cards] [players]
    -shuffle
    
    //PUBLIC FUNCTIONS//
    -help
    -enforce [on/off]
    -punish
    -edge
    -asylumtimeleft
    *NEW*INTENSE V:-nickname [Name]
    *NEW*INTENSE V:-blocknickname
    *NEW*INTENSE V:-allownickname
    
    //MISTRESS FUNCTIONS//
    >>> Basic Commands<<<
    -kneel
    *NEW*-cursereport
    *NEW*-showstrikes
    *NEW*-changestrikes [+/- nb strikes]
    -enforce [on/off] [a member number]
    -mistress [on/off] [a member number]
    -public
    -deactivateonpresence
    *NEW*INTENSE V:-mnickname [Number] [Name]
    *NEW*INTENSE V:-deletenickname [Number]
    
    >>>Speech Commands<<<
    -mute
    -cursedspeech
    -banword [on/off] [the word itself]
    -banbegging [on/off]
    -banfirstperson [on/off]
    -clearbannedwords
    
    >>>Curses<<<
    -cursedclothes
    -cursedorgasms
    -cursedlatex 
    -cursedpony
    -cursedcollar
    -cursedmittens
    -cursedgag 
    -cursedblindfold
    -cursedhood
    -cursedearplugs
    -curseddildogag
    -cursedpanties
    -cursedscrews
    
    
    //OWNER FUNCTIONS//
    >>>Basic Commands<<<
    *NEW*-disablepunishments
    -onlyonpresence
    -asylum [nb of hours]
    *NEW*-restrainplay
    -owner [on/off] [a member number]
    *NEW*INTENSE V:-onickname [Number] [Name]
    *NEW*INTENSE VERSION: -lockowner
    *NEW*INTENSE VERSION: -maid
    
    >>>Speech Commands<<<
    -enforceentrymessage 
    -entrymessage [sentence]
    INTENSE V: -forcedsay [sentence]
    INTENSE V: -say [sentence]
    INTENSE V: -fullblockchat
    *NEW*INTENSE V: -enablesound
    *NEW*INTENSE V: -sound ["oink", "meow", ...]
    
    >>>Curses<<<
    -cursedbelt
    ---------
    More on nicknames:
    https://github.com/ace-1331/
    ace12401-cursedscript/wiki/Nicknames
    ---------
    Made by ace (12401) - Ace__#5558
    Official release: V${currentVersion} 
    </pre>`;
}
