//************************************ LONG STRINGS ************************************//
/** Finds commands available and shows help messages */

function HelpMsg(sender, isClubOwner, isOwner, isMistress){
 
    let msgList =[];
    let helpTxt;
    if (isClubOwner) {
        msgList.push("clubowner", "owner", "private", "mistress", "public", "all");
        helpTxt = "Club Owner Commands >>> ";
    }
    else if(isOwner) {
        msgList.push("owner", "private", "public", "all");
        helpTxt = "Owner Commands >>> ";
    }
    else if(isMistress){
        msgList.push("mistress", "all");
    }
    else if(sender == Player.MemberNumber){
        msgList.push("wearer", "private");
        helpTxt = "Wearer Commands >>> ";
    }
    else if(cursedConfig.hasPublicAccess){
        if(cursedConfig.hasFullPublic){msgList.push("mistress");}
        msgList.push("public", "all");
        helpTxt = "Public Commands >>> ";
    }

    else{
        msgList.push("all");
        helpTxt = "Commands Available >>> "
    }
    let helpStart = `Calling ID: $){cursedConfig.commandChar + cursedConfig.slaveIdentifier}
    ${ChatRoomCharacter.map(el => {return { Name: el.Name, isCursed: el.isCursed }}).filter(n => n.Name == cursedConfig.slaveIdentifier && n.isCursed).length > 1
    ? "WARNING: Potential clash with another character!" : ""}`;
    sendWhisper(sender, helpStart);
    sendWhisper(sender, helpTxt);

    msgList.forEach(section => {
        var helpmsg = FindBlock(section);
     
        sendWhisper(sender, helpmsg);
        
    });
    
    sendWhisper(sender,  `
    More on various features:
    https://github.com/ace-1331/
    ace12401-cursedscript/wiki
    ---------
    Made by ace (12401) - Ace__#5558
    Official release: V${currentVersion}
    `);
}

function FindBlock(section) {
    switch(section){
        case "wearer":
            return `>>> Information <<<
            -help
            -showstrikes
            -showblacklist
            -listsentences
        
            >>> Config Commands <<<
            *NEW*-eatcommands
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
 
            -wardrobev2
            INTENSE V:-capture
        
            >>>Speech Commands<<<
            INTENSE:-talk [target id] [sentence id]
            >>> Other Commands <<<
            INTENSE V:-nickname [Number] [Name]
            INTENSE V:-deletenickname [Number] [Name]
            -draw [nb of cards] [players]
            -shuffle`;

        case "public":
            return`
            -help
            -respect
            -punish
            -edge
            -asylumtimeleft
            -readnote
            -sendnote
            INTENSE V:-nickname [Name]
            INTENSE V:-blocknickname
            INTENSE V:-allownickname
            INTENSE V:-capture`;

        case "mistress":
            return`  >>> Basic Commands<<<
            -kneel
            -cursereport
            -showstrikes
            -changestrikes [+/- nb strikes]
            -enforce [a member number]
            -mistress [a member number]
            -public
            -deactivateonpresence
   
            INTENSE V:-mnickname [Number] [Name]
            INTENSE V:-deletenickname [Number]
        
            >>>Speech Commands<<<
            *NEW*-dolltalk
            -mute
            -cursedspeech
            -banword [the word itself]
            -banbegging [on/off]
            -banfirstperson [on/off]
            -clearwords
            -contractions
            
            >>>Curses<<<
            *NEW*-curseitem [group]
        
            -vibes
            -collar`;

        case "private":
            return `>>> Information <<<
            -speechreport
            -showmistresses
            -showowners
            -showenforced
            -shownicknames
            -configreport`;
            
        case "owner":
            return`
            >>>Basic Commands<<<
            -asylum [nb of hours]
            -owner [a member number]
            INTENSE V:-onickname [Number] [Name]
        
            >>>Configuration Commands<<<
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
            INTENSE VERSION: -leash
            INTENSE VERSION: -maid
            *NEW*INTENSE VERSION: -sensdep
        
            >>>Speech Commands<<<
            -enforceentrymessage
            -entrymessage [sentence]
            INTENSE V:-restrainedspeech
            INTENSE V:-self [I, this slave, etc.]
            INTENSE V:-target [id] [target]
            INTENSE V:-sentence [id] [sentence]
            INTENSE V:-listsentences
            INTENSE V: -forcedsay [sentence]
            INTENSE V: -say [sentence]
            INTENSE V: -fullmute
            INTENSE V: -enablesound
            INTENSE V: -sound ["oink", "meow", ...]
        
            >>>Curses<<<
           
            *NEW*-clearcurses
            -reminders
            -togglereminder [reminder]`;

        case "clubowner":
            return ` >>>Configuration Commands<<<
            INTENSE VERSION: -lockowner
            *NEW*INTENSE VERSION: -locknewlover`;
       
        default:
            return `
            To use the curse on me, ask me about the commands... there are more available depending on your permissions [blacklist, public, mistress, owner]. 
            Commands are called with ${commandCall}, like "${commandCall} respect"
           To learn all the commands or use it for yourself, check out this repository: https://github.com/ace-1331/ace12401-cursedscript/wiki/Functions `;

    }

}
