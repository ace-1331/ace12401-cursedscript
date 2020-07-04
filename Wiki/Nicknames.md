# Nickname 
The nickname functionality may appear to be complex at first, but it is quite intuitive once the commands are understood.

Nicknames are names the wearer will see on their screen. The actions will also reflect the name they see.

At the core, anyone can send a command to block themselves from being given a nickname. Otherwise, anyone can give themselves a nickname for the wearer to see. The priority goes as follows: wearer (0), public (1), mistress (2), owner(3), club owner (4), blocked (5).  The wearer, their mistresses and owners can give any member number a nickname, however, the priority level indicates who can delete or change it. However, anyone has top priority over their own name excluding the wearer.

Note: blacklisted member numbers cannot have their nickname displayed.

In other words, here are all the use cases:

- If an owner sets a nickname for #12401 with the command "onickname", only another owner can change/delete it or #12401 themselves.

- If an owner sets a nickname for #12401 with the command "mnickname", mistresses, owners and #12401 can change/delete it.

- If a mistress sets a nickname for #12401 with the command "mnickname", mistresses, owners and #12401 can change it.

- If #12401 sets their own nickname with the command "nickname", #12401 , mistress and owners can change/delete it

- If the wearer sets a nickname for #12401 with the command "nickname", the wearer, mistresses, owners and #12401 can change/delete it

- If #12401 blocks their nickname with the command "blocknickname", no one but themselves can allow their name to be given a nickname again with the command "allownickname"

# Enforced system:
The enforced system now functions in a similar way than the nickname system. You can toggle new titles for a given member number which allows for custom titles other than miss/mistress. You can also toggle respect on the nickname to prevent cases where the nickname contains a title to cause issues. 

This makes it possible to have Player X be enforced as Mistress X only and player Y to be enforced as Slave Y for example