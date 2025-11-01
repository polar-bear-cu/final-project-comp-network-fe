export interface UserInterface {
  userid: string;
  username: string;
  friendList: UserInterface[];
}

export interface ActiveUser {
  userid: string;
  username: string;
}
