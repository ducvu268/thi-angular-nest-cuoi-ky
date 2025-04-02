import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';
import { TransactionDetailsModule } from './transaction-details/transaction-details.module';
import { AuthModule } from './auth/auth.module';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

const mongooseModuleFactory = MongooseModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    uri: configService.get<string>("MONGODB_URL"),
    connectionFactory: (connection) => {
      connection.plugin(require('mongoose-autopopulate'));
      return connection;
    },
  }),
  inject: [ConfigService],
});

@Module({
  imports: [
    mongooseModuleFactory,
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
    }),
    AccountModule, 
    TransactionDetailsModule, 
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
