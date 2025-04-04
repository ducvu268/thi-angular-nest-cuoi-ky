import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AccountService } from 'src/account/account.service';
import { Account } from 'src/account/schemas/account.schema';
import { compare } from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountService: AccountService,
    private readonly mailService: MailerService
  ) { }

  async login(email: string, password: string): Promise<Account> {
    const account = await this.accountService.getAccountByEmail(email);
    if (!account) {
      throw new UnauthorizedException('Invalid email');
    }
    const isPasswordValid = await compare(password, account.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return account;
  }

  async register(account: Account): Promise<Account> {
    return this.accountService.createAccount(account);
  }

  async sendEmail(email: string, newTempPassword: string): Promise<void> {
    try {
      await this.mailService.sendMail({
        to: email,
        subject: 'Thông báo cập nhật mật khẩu',
        template: 'application-approved',
        html: '<p>Mật khẩu tạm thời của bạn là: ' + newTempPassword + '</p>',
        context: {
          content: 'Mật khẩu tạm thời của bạn là: ' + newTempPassword,
        },
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Lỗi gửi email');
    }
  }

  async forgotPassword(email: string): Promise<Account> {
    const account = await this.accountService.getAccountByEmail(email);
    if (!account) {
      throw new BadRequestException('Tài khoản không tồn tại');
    }
    const newPassword = Math.random().toString(36).substring(2, 15);
    // send email to account
    await this.sendEmail(email, newPassword);
    // date temp password
    return this.accountService.updatePasswordOfAccount(account._id.toString(), newPassword);
  }

  async resetPassword(accountId: string, newPassword: string): Promise<Account> {
    const account = await this.accountService.getAccountById(accountId);
    if (!account) {
      throw new BadRequestException('Tài khoản không tồn tại');
    }
    return this.accountService.updatePasswordOfAccount(accountId, newPassword);
  }
}
