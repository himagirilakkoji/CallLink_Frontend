export class loginUserModel {
  constructor(email, password) {
    this.Email = email?.toLowerCase();
    this.Password = password;
  }
}