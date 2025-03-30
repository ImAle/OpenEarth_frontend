export class UserCreation{
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  role: string;

  constructor(username: string, firstName: string, lastName: string, email: string, password: string, passwordConfirmation: string, role: string) {
    this.username = username;
    this.firstname = firstName;
    this.lastname = lastName;
    this.email = email;
    this.password = password;
    this.passwordConfirmation = passwordConfirmation;
    this.role = role;
  }
}
