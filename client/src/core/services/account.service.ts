import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { lastValueFrom } from "rxjs";
import { env } from "../../enviroments/enviroment";
import { Account } from "../entities/account.entity";

@Injectable({
    providedIn: 'root'
})
export class AccountService {

    constructor(
        private httpClient: HttpClient
    ) { }

    findAll() {
        return lastValueFrom(this.httpClient.get(env.baseUrl + 'account'));
    }

    findById(id: string) {
        return lastValueFrom(this.httpClient.get(env.baseUrl + 'account/' + id));
    }

    login(email: string, password: string) {
        return lastValueFrom(this.httpClient.post(env.baseUrl + 'auth/login', { email, password }));
    }

    register(account: Account) {
        return lastValueFrom(this.httpClient.post(env.baseUrl + 'auth/register', account));
    }

    updateAccountCurrent(account: Account) {
        return lastValueFrom(this.httpClient.patch(env.baseUrl + 'account/update/' + account._id, account));
    }

    forgotPassword(email: string) {
        return lastValueFrom(this.httpClient.post(env.baseUrl + 'auth/forgot-password', { email }));
    }

    resetPassword(accountId: string, newPassword: string) {
        return lastValueFrom(this.httpClient.post(env.baseUrl + 'auth/reset-password', { accountId, newPassword }));
    }
}
