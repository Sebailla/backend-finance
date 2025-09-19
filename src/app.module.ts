import { Module, OnApplicationBootstrap } from '@nestjs/common';
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
    // Saco la URL de la conexión
    const url = process.env.DATABASE_URL!;
    const dbUrl = new URL(url);
    const dbName = dbUrl.pathname.replace('/', '');
    console.log(
      colors.bgGreen.black(
        `✅ Connection successfully established to the database name: ${colors.bgYellow.bold(dbName)}`
      )
    );
  }
}
