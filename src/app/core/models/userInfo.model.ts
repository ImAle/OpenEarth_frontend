export class UserInfo {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  picture: string;
  creationDate: Date;

  constructor(id: string, username: string, firstName: string, lastName: string, picture: string, creationDate: Date) {
    this.id = id;
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.picture = picture;
    this.creationDate = creationDate;
  }
}
