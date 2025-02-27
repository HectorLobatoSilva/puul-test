import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Task } from './../task/entities/task.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  filterTask(user: User) {
    const completedTasks =
      user.tasks?.filter((task) => task.state === 'completed') || [];
    const inProgressTask =
      user.tasks?.find((task) => task.state === 'active') || [];
    const totalCost = completedTasks.reduce(
      (sum, task) => sum + task.costPerTask,
      0,
    );
    const totalCompletedTask = completedTasks.length;

    const { tasks, ...userWhitOutTask } = user;

    return {
      ...userWhitOutTask,
      completedTasks,
      inProgressTask,
      totalCompletedTask,
      totalCost,
    };
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user: User = new User();
    const hashedPassword = await this.hashPassword(createUserDto.password);
    Object.assign(user, { ...createUserDto, password: hashedPassword });
    return this.userRepository.save(user);
  }

  async findAll(filters?: {
    filterByName?: string;
    filterByEmail?: string;
    filterByRole?: string;
  }) {
    const query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.tasks', 'task');

    if (filters?.filterByName) {
      query.andWhere('user.name LIKE :name', {
        name: `%${filters.filterByName}%`,
      });
    }

    if (filters?.filterByEmail) {
      query.andWhere('user.email LIKE :email', {
        email: `%${filters.filterByEmail}%`,
      });
    }

    if (filters?.filterByRole) {
      query.andWhere('user.role = :role', { role: filters.filterByRole });
    }

    const users = await query.getMany();

    return users.map((user) => this.filterTask(user));
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['tasks'],
    });

    if (!user) return null;

    return this.filterTask(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const newUser: User = new User();
    Object.assign(newUser, { ...updateUserDto, id });
    return this.userRepository.save(newUser);
  }

  async remove(id: number) {
    return this.userRepository.delete(id);
  }
}
