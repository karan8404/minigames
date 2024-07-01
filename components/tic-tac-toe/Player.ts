export class Player {
  socketID: string;
  name: string;
  email: string;
  constructor(socketID: string, name: string, email: string) {
    this.socketID = socketID;
    this.name = name;
    this.email = email;
  }
}
