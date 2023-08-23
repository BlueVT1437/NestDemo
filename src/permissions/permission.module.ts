import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { Permission } from './permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Permission])],
  controllers: [],
  providers: [PermissionService],
	exports: [PermissionService]
})
export class PermissionModule {}
