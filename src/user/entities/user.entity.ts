export class UserEntity {
  id: number;
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;

  constructor(data: UserEntity) {
    Object.assign(this, data);
  }
}
