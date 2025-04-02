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
import { TransactionDetails } from '../../core/entities/transaction-details.entity';
import { AvatarModule } from 'primeng/avatar';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';        
import { DialogModule } from 'primeng/dialog';
import { AccountService } from '../../core/services/account.service';
import { Account } from '../../core/entities/account.entity';

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
        DialogModule
    ]
})
export class DashboardComponent implements OnInit {
    transactionDetails: TransactionDetails[];
    transactionByAccountName: string;
    transactionForm: FormGroup;
    displayCreateDialog: boolean = false;
    accounts: any[] = [];
    transactionTypes: any[] = [];

    constructor(
        private accountService: AccountService,
        private transactionService: TransactionDetailsService,
        private router: Router,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit(): void {
        this.getTransactionDetails();
        this.getAccounts();
        this.getTransactionTypes();
        this.transactionForm = this.formBuilder.group({
            accountId: [null, Validators.required],
            transactionType: [null, Validators.required],
            amount: [null, Validators.required],
            description: [null, Validators.required]
        });
    }

    getTransactionDetails() {
        this.transactionService.findAll().then(res => {
            this.transactionDetails = res as TransactionDetails[];
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
        console.log(this.transactionForm.value);
    }

    closeCreateTransactionDialog() {
        this.displayCreateDialog = false;
    }

    getAccounts() {
        this.accountService.findAll().then(res => {
            this.accounts = res as Account[];
        }).catch(err => {
            console.log(err);
        });
    }

    getTransactionTypes() {
        this.transactionService.findAll().then(res => {
            this.transactionTypes = res as TransactionDetails[];
        }).catch(err => {
            console.log(err);
        }); 
    }
}
