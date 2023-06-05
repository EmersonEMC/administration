import { IUser } from '../interfaces/user.interface';

export class User implements IUser {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  token?: string;

  constructor(user?: IUser) {
    Object.assign(this, user);
  }
}
