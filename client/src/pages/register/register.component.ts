import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { AccountService } from '../../core/services/account.service';
import { RippleModule } from 'primeng/ripple';
import { Account } from '../../core/entities/account.entity';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { IftaLabelModule } from 'primeng/iftalabel';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { PasswordModule } from 'primeng/password';

@Component({
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    providers: [
        MessageService,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        InputTextModule,
        ButtonModule,
        MessageModule,
        RouterModule,
        RippleModule,
        IconFieldModule,
        InputIconModule,
        IftaLabelModule,
        ReactiveFormsModule,
        ToastModule,
        DialogModule,
        PasswordModule
    ]

})
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    isSubmitted = false;
    isRegisterSuccess = false;

    constructor(
        private accountService: AccountService,
        private formBuilder: FormBuilder,
        private router: Router,
        private messageService: MessageService,
    ) { }

    ngOnInit(): void {
        this.isRegisterSuccess = false;
        this.registerForm = this.formBuilder.group(
            {
                name: ['', Validators.required],
                email: ['', [Validators.required, Validators.email]],
                password: ['', [Validators.required, Validators.minLength(8)]],
                passwordConfirm: ['', [Validators.required]],
                phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
                balance: [0, Validators.required],
            },
        );
    }

    onSubmit() {
        this.isSubmitted = true;
        var account = new Account();
        account.name = this.registerForm.value.name;
        account.email = this.registerForm.value.email;
        account.password = this.registerForm.value.password;
        account.phone = this.registerForm.value.phone;
        account.balance = this.registerForm.value.balance;

        if (this.registerForm.invalid) return;
        if (this.registerForm.value.password !== this.registerForm.value.passwordConfirm) {
            this.messageService.add({
                severity: 'error',
                summary: 'Thất bại',
                detail: 'Mật khẩu không khớp',
            });
            return;
        }
        this.accountService.register(account).then((res) => {
            this.registerForm.reset();
            this.isRegisterSuccess = true;
        }).catch((err) => {
            console.log(err);
            this.messageService.add({
                severity: 'error',
                summary: 'Thất bại',
                detail: 'Đăng ký thất bại',
            });
        });

    }

    goToLogin() {
        this.router.navigate(['/login']);
    }
}
