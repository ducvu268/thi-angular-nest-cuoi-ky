import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { lastValueFrom } from "rxjs";
import { env } from "../../enviroments/enviroment";
import { TransactionDetails } from "../entities/transaction-details.entity";

@Injectable({
    providedIn: 'root'
})
export class TransactionDetailsService {

    constructor(
        private httpClient: HttpClient
    ) { }

    findAll() {
        return lastValueFrom(this.httpClient.get(env.baseUrl + 'transaction-details'));
    }

    createDeposit(transactionDetails: TransactionDetails) {
        return lastValueFrom(this.httpClient.post(env.baseUrl + 'transaction-details/deposit', transactionDetails));
    }

    createWithdraw(transactionDetails: TransactionDetails) {
        return lastValueFrom(this.httpClient.post(env.baseUrl + 'transaction-details/withdraw', transactionDetails));
    }
}