import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/index';

// Services
import { AuthService } from './_services/auth.service';
import { LoadingService } from './_services/loading.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription[] = [];
    public loading: boolean;

    public currentUser: any | null;

    public randomIcon1 = 0;
    public randomIcon2 = 10;

    constructor(public auth: AuthService,
                private loadingService: LoadingService) {
        this.subscriptions.push(
            this.auth.currentUser.subscribe(user => {
                this.currentUser = user;
            })
        );
    }

    ngOnInit() {
        this.subscriptions.push(
            this.loadingService.isLoading().subscribe(isLoading => {
                this.loading = isLoading;
            })
        );
        setInterval(() => {
            this.randomInt(0, 49);
        }, 4000);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    randomInt(min, max) {
        this.randomIcon1 = Math.floor(Math.random() * (max - min + 1) + min);
        this.randomIcon2 = Math.floor(Math.random() * (max - min + 1) + min);
    }

}
