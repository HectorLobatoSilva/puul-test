import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Task } from '../../task/entities/task.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'enum', enum: ['admin', 'member'] })
  role: string;

  @Column({ type: 'varchar', select: false })
  password: string;

  @ManyToMany(() => Task, (task) => task.asignedUsers)
  @JoinTable()
  tasks: Task[];
}
