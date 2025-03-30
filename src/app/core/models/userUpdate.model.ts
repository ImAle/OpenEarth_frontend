export class userUpdate {
  username: string;
  password: string;
  passwordConfirmation: string;

  constructor(username: string, password: string, passwordConfirmation: string) {
    this.username = username;
    this.password = password;
    this.passwordConfirmation = passwordConfirmation;
  }
}
