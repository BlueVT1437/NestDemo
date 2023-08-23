import { Role } from 'src/roles/role.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'permissions' })
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  permission: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  @JoinTable({
    name: 'role_permissions',
    joinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
    },
  })
  roles?: Role[];
}
