import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id!: string;

  @Column({ type: 'varchar', length: 150, default: '' })
  nombre!: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email!: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  password!: string;

  @Column({ type: 'varchar', length: 50, default: 'user' })
  rol!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;
}
