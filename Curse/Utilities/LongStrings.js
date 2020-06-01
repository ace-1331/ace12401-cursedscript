//************************************ LONG STRINGS ************************************//
/** Long strings for Help, now turned into a function */


function helpMsg( helpType ) 
switch (helpType) {
case "wearer":
return `Your calling ID: ${cursedConfig.commandChar + cursedConfig.slaveIdentifier}
    ${ChatRoomCharacter.map(el => {return { Name: el.Name, isCursed: el.isCursed }}).filter(n => n.Name == cursedConfig.slaveIdentifier && n.isCursed).length > 1
    ? "WARNING: Potential clash with another character!" : ""}

    >>WEARER FUNCTION>>

    >>> Information >>>
    -help
    -showstrikes
    -showblacklist
    -listsentences

    >>> Config Commands >>>
    *NEW*-hidedisplay
    *NEW*-restraintvanish
    -isclassic
    -issilent
    -blacklist [a member number]
    -mistress [a member number]
    -owner [a member number]
    -commandchar [! / & / $ / #]
    -identifier [new identifier]
    -punishmentcolor ["#colorcode"]
    -forwardall
    -savecolors
    -wardrobev2

    >>> Other Commands >>>
    -draw [nb of cards] [players]
    -shuffle

    >>>INTENSE V>>> -allowcapture
    -talk [target id] [sentence id]
    -nickname [Number] [Name]
    -deletenickname [Number] [Name]`;
        
  case "clubowner":
    return `
    >>CLUB OWNER FUNCTIONS>>
    >>>Configuration Commands>>>
    INTENSE VERSION: -lockowner
    *NEW*INTENSE VERSION: -locknewlover`;
        
  case "owner":
    return `
    >>OWNER FUNCTIONS>>
    >>>Basic Commands>>>
    -asylum [nb of hours]
    -owner [a member number]

    >>>Configuration Commands>>>
    -guestnotes
    -readnotes
    -disablepunishments
    -onlyonpresence
    -restrainplay
    -fullpublic
    -afk
    -note
    *NEW*-reminderinterval [seconds]
    *NEW*-clearallreminders

    >>>Speech Commands>>>
    -enforceentrymessage
    -entrymessage [sentence]

    >>>Curses>>>
    -belt
    *NEW*-reminders
    *NEW*-togglereminder [reminder]

    >>>INTENSE V>>> -onickname [Number] [Name]
    -leash
    -lockowner
    -maid
    *NEW* -maid
    -restrainedspeech
    -self [I, this slave, etc.]
    -target [id] [target]
    -sentence [id] [sentence]
    -listsentences
     -forcedsay [sentence]
     -say [sentence]
     -fullmute
     -enablesound
     -sound ["oink", "meow", ...]`;      
        
 case "mistress":
    return `
    >>MISTRESS FUNCTIONS>>
    >>> Basic Commands>>>
    -kneel
    -cursereport
    -showstrikes
    -changestrikes [+/- nb strikes]
    -enforce [a member number]
    -mistress [a member number]
    -public
    -deactivateonpresence
    -savecolors

    >>>Speech Commands>>>
    -mute
    -cursedspeech
    -banword [the word itself]
    -banbegging [on/off]
    -banfirstperson [on/off]
    -clearwords
    -contractions
    
    >>>Curses>>>
    -naked
    -vibes
    -latex
    -pony
    -collar
    -mittens
    -paws
    -gag
    -blindfold
    -hood
    -earplugs
    -dildogag
    -panties
    -screws
    -rope
    -maiduniform
    -doublegag
    >>>INTENSE V>>>
    -mnickname [Number] [Name]
    -deletenickname [Number]`;  
        
  case "private":
    return `
    >>OWNER AND WEARER FUNCTIONS>>
    >>> Information >>>
    -speechreport
    - showmistresses
    - showowners
    - showenforced
    - shownicknames
    - configreport`;
        
  case "public":
    return `
    >>PUBLIC FUNCTIONS>>
    -help
    -respect
    -punish
    -edge
    -asylumtimeleft
    -readnote
    *NEW*-sendnote
    >>>INTENSE V>>> -nickname [Name]
    -blocknickname
    -allownickname
    -capture
    ---------
    More on various features:
    https://github.com/ace-1331/
    ace12401-cursedscript/wiki
    ---------
    Made by ace (12401) - Ace__#5558
    Official release: V${currentVersion}`;
        
  default:
  break;
}
