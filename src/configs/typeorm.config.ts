import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [__dirname + process.env.ENTITIES],
  ssl: { rejectUnauthorized: false },
  synchronize: true,
};
