import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AccountService } from '../../core/services/account.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { IftaLabelModule } from 'primeng/iftalabel';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  providers: [
    MessageService,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    RouterModule,
    RippleModule,
    IconFieldModule,
    InputIconModule,
    IftaLabelModule,
    MessageModule,
    ToastModule,
    DialogModule
  ],    
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  formForgotPassword: FormGroup;
  isSubmitted = false;
  loading = false;
  requestSent = false;

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.formForgotPassword = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  submitForgotPassword(): void {
    this.isSubmitted = true;

    if (this.formForgotPassword.invalid) {
      return;
    }

    this.loading = true;
    const email = this.formForgotPassword.value.email;

    this.accountService.forgotPassword(email).then(
      (res) => {
        this.loading = false;
        this.requestSent = true;
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Hướng dẫn đặt lại mật khẩu đã được gửi đến email của bạn.'
        });
      },
      (err) => {
        console.log(err);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể gửi yêu cầu đặt lại mật khẩu. Vui lòng thử lại sau.'
        });
      }
    );
  }

  backToLogin(): void {
    this.router.navigate(['/login']);
  }
}