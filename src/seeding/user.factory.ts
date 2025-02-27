import { faker } from '@faker-js/faker';
import { setSeederFactory } from 'typeorm-extension';
import { User } from './../user/entities/user.entity';
import * as bcrypt from 'bcrypt';

export const UserFactory = setSeederFactory(User, async () => {
  const user = new User();
  const password = 'Admin1234';
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  user.name = faker.person.fullName();
  user.email = faker.internet.email();
  user.role = faker.helpers.arrayElement(['admin', 'member']) as
    | 'admin'
    | 'member';
  user.password = hashedPassword;
  return user;
});
