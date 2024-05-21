export class Player{
    userID : string;
    socketID: string;
    name: string;
    email: string;
    constructor(userID: string, socketID: string, name: string, email: string){
        this.userID = userID;
        this.socketID = socketID;
        this.name = name;
        this.email = email;
    }
}