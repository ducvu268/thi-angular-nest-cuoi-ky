import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { IftaLabelModule } from 'primeng/iftalabel';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { TransactionDetailsService } from '../../core/services/transaction-details.service';
import { TransactionDetails, TransType } from '../../core/entities/transaction-details.entity';
import { AvatarModule } from 'primeng/avatar';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { Account } from '../../core/entities/account.entity';
import { SelectModule } from 'primeng/select';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AccountService } from '../../core/services/account.service';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    imports: [
        CommonModule,
        CardModule,
        ChartModule,
        ButtonModule,
        RippleModule,
        IconFieldModule,
        InputIconModule,
        IftaLabelModule,
        DropdownModule,
        CalendarModule,
        TableModule,
        PaginatorModule,
        FloatLabelModule,
        FormsModule,
        AvatarModule,
        ReactiveFormsModule,
        DialogModule,
        SelectModule,
        ToastModule,
        MessageModule,
        ConfirmDialogModule
    ],
    providers: [MessageService, ConfirmationService]
})
export class DashboardComponent implements OnInit {
    transactionDetails: TransactionDetails[];
    accountCurrent: Account;
    transactionForm: FormGroup;
    displayCreateDialog: boolean = false;
    isSubmitted: boolean = false;
    selectedTransType: TransType;
    transTypeOptions: { label: string, value: number }[];
    TransType = TransType;

    constructor(
        private accountService: AccountService,
        private transactionService: TransactionDetailsService,
        private router: Router,
        private formBuilder: FormBuilder,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) { }

    ngOnInit(): void {
        this.getAccountCurrentAndTransactionDetails();
        this.selectedTransType = TransType.DEPOSIT;
        this.transTypeOptions = Object.keys(TransType)
            .filter(key => isNaN(Number(key)))
            .map(key => ({
                label: key,
                value: TransType[key as keyof typeof TransType]
            }));
        this.transactionForm = this.formBuilder.group({
            transType: [TransType.DEPOSIT, Validators.required],
            transMoney: [null, Validators.required],
        });
    }

    getTransactionDetailsByAccountId() {
        this.transactionService.findAllByAccountId(this.accountCurrent._id).then(res => {
            this.transactionDetails = (res as TransactionDetails[]).reverse();
        }).catch(err => {
            console.log(err);
        });
    }

    getAccountCurrentAndTransactionDetails() {
        const account = localStorage.getItem('account');
        const parsedAccount = JSON.parse(account) as Account;
        this.accountService.findById(parsedAccount._id).then(res => {
            this.accountCurrent = res as Account;
            this.getTransactionDetailsByAccountId();
        }).catch(err => {
            console.log(err);
        });
    }

    logout() {
        this.router.navigate(['/login']);
    }

    updateProfile() {
        this.router.navigate(['/update-profile']);
    }

    openCreateTransactionDialog() {
        this.displayCreateDialog = true;
    }

    createTransaction() {
        this.isSubmitted = true;
        if (this.transactionForm.invalid) return;

        if (this.transactionForm.value.transMoney <= 0) {
            this.messageService.add({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Số tiền không hợp lệ'
            });
            return;
        }

        if (this.transactionForm.value.transMoney > this.accountCurrent.balance
            && this.transactionForm.value.transType === TransType.WITHDRAW) {
            this.messageService.add({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Số dư không đủ'
            });
            return;
        }

        if (this.transactionForm.value.transType === TransType.WITHDRAW) {
            this.transactionService.createWithdraw(this.accountCurrent._id, this.transactionForm.value.transMoney).then(
                res => {
                    this.getAccountCurrentAndTransactionDetails();
                    this.closeCreateTransactionDialog();
                    this.transactionForm.reset();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Thành công',
                        detail: 'Giao dịch thành công',
                    });
                }).catch(err => {
                    console.log(err);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Lỗi',
                        detail: 'Giao dịch thất bại',
                    });
                });
        } else {
            this.transactionService.createDeposit(this.accountCurrent._id, this.transactionForm.value.transMoney).then(
                res => {
                    this.getAccountCurrentAndTransactionDetails();
                    this.closeCreateTransactionDialog();
                    this.transactionForm.reset();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Thành công',
                        detail: 'Giao dịch thành công'
                    });
                }).catch(err => {
                    console.log(err);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Lỗi',
                        detail: 'Giao dịch thất bại'
                    });
                });
        }
    }

    closeCreateTransactionDialog() {
        this.displayCreateDialog = false;
        this.transactionForm.reset();
        this.isSubmitted = false;
    }

    onTransTypeChange(event: any) {
        console.log(event.value);
        if (event.value === 0) {
            this.getTransactionDetailsByAccountId();
        } else {
            this.transactionService.findAllByAccountId(this.accountCurrent._id).then(res => {
                this.transactionDetails = (res as TransactionDetails[]).reverse();
                var newList: TransactionDetails[] = [];
                newList = this.transactionDetails.filter(transaction => transaction.transType == event.value);
                this.transactionDetails = newList.reverse();
            }).catch(err => {
                console.log(err);
            });
        }
    }

    goToResetPassword() {
        this.router.navigate(['/reset-password'], { queryParams: { token: this.accountCurrent._id } });
    }

    confirmDeleteTransaction(transaction: TransactionDetails) {
        if (transaction === null || transaction === undefined) return;
        this.confirmationService.confirm({
            message: 'Bạn có chắc chắn muốn huỷ giao dịch này không?',
            accept: () => {
                this.deleteTransaction(transaction._id, transaction.transMoney);
            }
        });
    }

    deleteTransaction(transactionId: string, transMoney: number) {
        this.transactionService.deleteTransaction(transactionId, transMoney).then(
            res => {
                this.getAccountCurrentAndTransactionDetails();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Giao dịch đã được xóa'
                });
            }).catch(err => {
                console.log(err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Lỗi',
                    detail: 'Giao dịch không được xóa'
                });
            });
    }
}
