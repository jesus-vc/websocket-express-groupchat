# A groupchat leveraging websockets and express.

## I made the following feature enhancements to the source code:

1. Prevent duplicate usernames.
    - Created and implemented the  Room.uniqueUsername(username) class method in ./Room.js.

2. Enabled a user to fetch a joke from an 3rd-party API. The joke is shared privately with the requesting user in the appropriate chatroom. 
    - Created and implemented the  ChatUser.handleJoke(username) class method in ./ChatUser.js.


## Instructions:

    - Run 'node server.js' to start application.

    - Window prompt requires a unique username to continue.

    - Type '/joke' into the text field to get a joke. Joke is sent only to the requesting user.