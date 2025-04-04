import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';
import { TransactionDetailsModule } from './transaction-details/transaction-details.module';
import { AuthModule } from './auth/auth.module';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';

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

const mailerModuleFactory = MailerModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    transport: {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: configService.get<string>('MAIL_USER'),
        pass: configService.get<string>('MAIL_PASS'),
      },
    },
  }),
  inject: [ConfigService],
});

@Module({
  imports: [
    mongooseModuleFactory,
    mailerModuleFactory,
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
export class AppModule { }
