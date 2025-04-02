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

    login(email: string, password: string) {
        return lastValueFrom(this.httpClient.post(env.baseUrl + 'auth/login', { email, password }));
    }

    register(account: Account) {
        return lastValueFrom(this.httpClient.post(env.baseUrl + 'auth/register', account));
    }
}
