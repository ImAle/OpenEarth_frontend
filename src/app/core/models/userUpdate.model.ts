export class UserUpdate {
  password: string;
  passwordConfirmation: string;


  constructor(password: string, passwordConfirmation: string) {
    this.password = password;
    this.passwordConfirmation = passwordConfirmation;
  }
}
