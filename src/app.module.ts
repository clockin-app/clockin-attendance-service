import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceModule } from './modules/attendance.module.js';
import { AttendanceRecord } from './entities/attendance-record.entity.js';
import { AttendancePhoto } from './entities/attendance-photo.entity.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'),
        database: config.get<string>('DB_NAME'),
        entities: [AttendanceRecord, AttendancePhoto],
        synchronize: config.get<string>('NODE_ENV') !== 'production',
      }),
    }),
    AttendanceModule,
  ],
})
export class AppModule {}
