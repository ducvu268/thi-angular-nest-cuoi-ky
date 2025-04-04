import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../core/services/account.service';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { RippleModule } from 'primeng/ripple';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { IftaLabelModule } from 'primeng/iftalabel';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    providers: [MessageService],
    imports: [
        ReactiveFormsModule,
        InputTextModule,
        ButtonModule,
        CardModule,
        CommonModule,
        PasswordModule,
        CheckboxModule,
        RippleModule,
        ReactiveFormsModule,
        IconFieldModule,
        InputIconModule,
        IftaLabelModule,
        MessageModule,
        ToastModule
    ],
})
export class LoginComponent implements OnInit {
    formLogin: FormGroup;
    isSubmitted = false;

    constructor(
        private accountService: AccountService,
        private formBuilder: FormBuilder,
        private router: Router,
        private messageService: MessageService
    ) { }

    ngOnInit(): void {
        this.formLogin = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],
        });
    }

    login() {
        this.isSubmitted = true;
        if (this.formLogin.invalid) return;
        const email = this.formLogin.value.email;
        const password = this.formLogin.value.password;
        this.accountService.login(email, password).then((res) => {
            localStorage.setItem('account', JSON.stringify(res));
            this.router.navigate(['/dashboard']);
        }).catch((err) => {
            this.messageService.add({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Email hoặc mật khẩu không chính xác',
            });
        });
    }
}
