import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '@user/entities/user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'int' })
  estimatedHours: number;

  @Column({ type: 'date' })
  deadline: string; // TODO: Check for a date type

  @Column({ type: 'enum', enum: ['active', 'completed'] })
  state: string;

  @Column({ type: 'int' })
  costPerTask: number;

  @ManyToMany(() => User)
  @JoinTable()
  asignedUsers: number[];
}
