import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  getUserByUsernameAndPassword(username: string, password: string) {
    const user = this.userRepository.getUserByUsername(username);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

  getRandomUser() {
    return this.userRepository.getRandomUser();
  }
}
