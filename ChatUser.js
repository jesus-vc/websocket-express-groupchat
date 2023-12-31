/** Functionality related to chatting. */

// Room is an abstraction of a chat channel
const Room = require("./Room");

const getJoke = require("./services/getJokeService");

/** ChatUser is a individual connection from client -> server to chat. */

class ChatUser {
  /** make chat: store connection-device, rooom */

  constructor(send, roomName) {
    this._send = send; // "send" function for this user
    this.room = Room.get(roomName); // room user will be in
    this.name = null; // becomes the username of the visitor

    console.log(`created chat in ${this.room.name}`);
  }

  /** send msgs to this client using underlying connection-send-function */

  send(data) {
    try {
      this._send(data);
    } catch {
      // If trying to send to a user fails, ignore it
    }
  }

  /** handle joining: add to room members, announce join */

  handleJoin(name) {
    if (this.room.uniqueUsername(name)) {
      this.name = name;
      this.room.join(this);
      this.room.broadcast({
        type: "note",
        text: `${this.name} joined "${this.room.name}".`,
      });
    } else {
      //PEER should I have created and called a User class method to send this message
      // rather than sending it directly here?
      this.send(JSON.stringify({ type: "duplicateUser" }));
    }
  }

  /** handle a chat: broadcast to room. */

  handleChat(text) {
    this.room.broadcast({
      name: this.name,
      type: "chat",
      text: text,
    });
  }

  /** Handle a joke: only respond to requester. */

  async handleJoke(username) {
    const joke = await getJoke();
    this.room.privateMessage(username, {
      type: "note",
      text: `Hello, ${this.name}. Here is your private joke: ${joke}.`,
    });
  }

  /** Handle a listing room users: only respond to requester. */

  handleUserList(username) {
    const usersArray = [];
    for (let member of this.room.members) {
      usersArray.push(member.name);
    }
    const usersList = usersArray.join(", ");
    this.room.privateMessage(username, {
      type: "note",
      text: `Members in current room: ${usersList}.`,
    });
  }

  /** Handle messages from client:
   *
   * - {type: "join", name: username} : join
   * - {type: "chat", text: msg }     : chat
   */

  handleMessage(jsonData) {
    let msg = JSON.parse(jsonData);

    if (msg.type === "join") {
      this.handleJoin(msg.name);
    } else if (msg.type === "chat") {
      this.handleChat(msg.text);
    } else if (msg.type === "getJoke") {
      this.handleJoke(msg.name);
    } else if (msg.type === "getUserList") {
      this.handleUserList(msg.name);
    } else throw new Error(`bad message: ${msg.type}`);
  }

  /** Connection was closed: leave room, announce exit to others */

  handleClose() {
    this.room.leave(this);
    this.room.broadcast({
      type: "note",
      text: `${this.name} left ${this.room.name}.`,
    });
  }
}

module.exports = ChatUser;
