export class registerUserModel {
  constructor(fullName, email, password) {
    this.Username = fullName?.trim();
    this.Email = email?.toLowerCase();
    this.Password = password;
  }
}
