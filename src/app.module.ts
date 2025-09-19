import { Logger, Module, OnApplicationBootstrap } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { InjectDataSource, TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './index'
import colors from 'colors'
import { DataSource } from 'typeorm'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      useFactory: typeORMConfig,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements OnApplicationBootstrap {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) { }

  async onApplicationBootstrap() {

    const logger = new Logger('Bootstrap')
    
    // URL connection
    const url = process.env.DATABASE_URL!;
    const dbUrl = new URL(url);
    const dbName = dbUrl.pathname.replace('/', '')

    logger.log(colors.bgGreen.black(`Connection successfully, database name: ${colors.bgYellow.bold(dbName)}`))
  }
}
