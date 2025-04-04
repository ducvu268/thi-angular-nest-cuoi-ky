import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RouterModule, Router } from '@angular/router';
import { AccountService } from '../../core/services/account.service';
import { RippleModule } from 'primeng/ripple';
import { Account } from '../../core/entities/account.entity';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { IftaLabelModule } from 'primeng/iftalabel';
import { MessageModule } from 'primeng/message';
import {  MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';

@Component({
    selector: 'app-update-profile',
    templateUrl: './update_profile.component.html',
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
        ToastModule,
        DialogModule,
        MessageModule
    ],
    styleUrls: ['./update_profile.component.scss']
})
export class UpdateProfileComponent implements OnInit {
    formProfile: FormGroup;
    accountCurrent: Account;
    isSubmitted = false;
    loading = false;

    constructor(
        private formBuilder: FormBuilder,
        private accountService: AccountService,
        private messageService: MessageService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.initForm();
        this.loadAccountCurrentAndTransactionDetails();
    }

    initForm(): void {
        this.formProfile = this.formBuilder.group({
            name: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', [Validators.pattern('^[0-9]{10}$')]],
        });
    }

    loadAccountCurrentAndTransactionDetails() {
        this.loading = true;
        const account = localStorage.getItem('account');
        const parsedAccount = JSON.parse(account) as Account;
        this.accountService.findById(parsedAccount._id).then(
            (res) => {
                this.accountCurrent = res as Account;
                // Populate form with user data
                this.formProfile.patchValue({
                    name: this.accountCurrent.name,
                    email: this.accountCurrent.email,
                    phone: this.accountCurrent.phone || '',
                });
                this.loading = false;
            }).catch(
                (err) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Lỗi',
                        detail: 'Không thể tải thông tin người dùng. Vui lòng thử lại sau.'
                    });
                });
    }

    updateProfile(): void {
        this.isSubmitted = true;

        if (this.formProfile.invalid) {
            return;
        }

        this.loading = true;
        const account = this.accountCurrent;
        account.name = this.formProfile.value.name;
        account.email = this.formProfile.value.email;
        account.phone = this.formProfile.value.phone;

        this.accountService.updateAccountCurrent(account).then(
            (res) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Cập nhật thông tin thành công!'
                });
                this.loading = false;
                setTimeout(() => {
                    this.onBack();
                }, 500);
            },
            (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Lỗi',
                    detail: 'Đã xảy ra lỗi khi cập nhật thông tin. Vui lòng thử lại.'
                });
                this.loading = false;
            }
        );
    }

    onBack(): void {
        this.router.navigate(['/dashboard']);
    }
}