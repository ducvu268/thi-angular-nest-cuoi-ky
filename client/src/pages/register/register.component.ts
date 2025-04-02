import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { RouterModule } from '@angular/router';
import { AccountService } from '../../core/services/account.service';
import { RippleModule } from 'primeng/ripple';
import { Account } from '../../core/entities/account.entity';
import { message } from 'antd';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { IftaLabelModule } from 'primeng/iftalabel';

@Component({
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
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
        IftaLabelModule
    ]

})
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    isSubmitted = false;
    passwordMismatch = false;

    constructor(
        private accountService: AccountService,
        private formBuilder: FormBuilder,
        private router: Router,
    ) { }

    ngOnInit(): void {
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

    passwordConfirmValidator(form: AbstractControl) {
        const password = form.get('password')?.value;
        const passwordConfirm = form.get('passwordConfirm')?.value;
        this.passwordMismatch = password !== passwordConfirm;
        return password === passwordConfirm ? null : { passwordMismatch: true };
    }

    onSubmit() {
        this.isSubmitted = true;
        var account = new Account();
        account.name = this.registerForm.value.name;
        account.email = this.registerForm.value.email;
        account.password = this.registerForm.value.password;
        account.phone = this.registerForm.value.phone;
        account.balance = this.registerForm.value.balance;
        if (this.registerForm.valid) {
            this.accountService.register(account).then((res) => {
                console.log(res);
                message.success('Đăng ký thành công');
                this.router.navigate(['/login']);
            }).catch((err) => {
                console.log(err);
                message.error('Đăng ký thất bại');
            });
        } else {
            message.error('Đăng ký thất bại');
        }
    }
}
