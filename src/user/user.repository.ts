import { Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';

const users = [...Array(20)].map((_, id) => UserEntity.randomWithId(id));

@Injectable()
export class UserRepository {
  getUserByUsername(username: string) {
    return users.find((user) => user.username === username);
  }
}
