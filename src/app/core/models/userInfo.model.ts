export class UserInfoModel {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  picture: string;

  constructor(id: string, username: string, firstName: string, lastName: string, picture: string) {
    this.id = id;
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.picture = picture;
  }
}
