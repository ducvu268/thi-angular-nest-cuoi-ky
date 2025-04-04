import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { lastValueFrom } from "rxjs";
import { env } from "../../enviroments/enviroment";

@Injectable({
    providedIn: 'root'
})
export class TransactionDetailsService {

    constructor(
        private httpClient: HttpClient
    ) { }

    findAllByAccountId(accountId: string) {
        return lastValueFrom(this.httpClient.get(env.baseUrl + 'transaction-details/account/' + accountId));
    }

    createDeposit(accountId: string, amount: number) {
        return lastValueFrom(this.httpClient.post(env.baseUrl + 'transaction-details/deposit', {
            "accountId": accountId,
            "amount": amount
        }));
    }

    createWithdraw(accountId: string, amount: number) {
        return lastValueFrom(this.httpClient.post(env.baseUrl + 'transaction-details/withdraw', {
            "accountId": accountId,
            "amount": amount
        }));
    }

    deleteTransaction(transactionId: string, transMoney: number) {
        return lastValueFrom(this.httpClient.delete(env.baseUrl + 'transaction-details/' + transactionId, {
            params: { transMoney: transMoney }
        }));
    }
}