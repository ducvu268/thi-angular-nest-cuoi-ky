import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../../core/services/account.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
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
import { PasswordModule } from 'primeng/password';
import { Account } from '../../core/entities/account.entity';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
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
        DialogModule,
        PasswordModule
    ],
    styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
    formResetPassword: FormGroup;
    isSubmitted = false;
    loading = false;
    resetSuccess = false;
    token: string;
    accountCurrent: Account;

    constructor(
        private formBuilder: FormBuilder,
        private accountService: AccountService,
        private messageService: MessageService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        // Lấy token từ URL
        this.route.queryParams.subscribe(params => {
            this.token = params['token'];
            if (!this.token) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Lỗi',
                    detail: 'Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.'
                });
                setTimeout(() => {
                    this.router.navigate(['/forgot-password']);
                }, 2000);
            }
        });

        this.initForm();
    }

    initForm(): void {
        this.formResetPassword = this.formBuilder.group({
            password: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', [Validators.required]]
        }, {
            validators: this.passwordMatchValidator
        });
    }

    // Kiểm tra mật khẩu và xác nhận mật khẩu có khớp nhau
    passwordMatchValidator(form: FormGroup) {
        const password = form.get('password').value;
        const confirmPassword = form.get('confirmPassword').value;

        if (password === confirmPassword) {
            return null;
        }

        return { passwordsMismatch: true };
    }

    submitResetPassword(): void {
        this.isSubmitted = true;

        if (this.formResetPassword.invalid) {
            return;
        }

        this.loading = true;
        const password = this.formResetPassword.value.password;

        this.accountService.resetPassword(this.token, password).then(
            (res) => {
                this.loading = false;
                this.resetSuccess = true;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Mật khẩu của bạn đã được đặt lại thành công. Vui lòng đăng nhập lại.'
                });
                setTimeout(() => {
                    this.goToLogin();
                }, 5000);
            },
            (err) => {
                console.log(err);
                this.loading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Lỗi',
                    detail: 'Không thể đặt lại mật khẩu. Vui lòng thử lại sau.'
                });
            }
        );
    }

    goToLogin(): void {
        this.router.navigate(['/login']);
    }
}