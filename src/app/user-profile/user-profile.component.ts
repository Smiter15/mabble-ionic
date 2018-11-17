import { Component } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { AuthService } from "../_services/auth.service";

import * as firebase from 'firebase';

import { Subscription } from "rxjs";

import { User } from "../_interfaces/user.interface";

import { LoadingService } from "../_services/loading.service";

@Component({
    selector: 'user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent {

    private db = firebase.firestore();

    public currentUser: any = null;
    public user: User;
    private subscriptions: Subscription[] = [];

    constructor(
        private auth: AuthService,
        private loadingService: LoadingService,
        private route: ActivatedRoute
    ) {
        this.loadingService.setLoading(true);
    }

    ngOnInit() {
        this.subscriptions.push(
            this.auth.currentUser.subscribe(user => {
                this.currentUser = user;
                this.loadingService.setLoading(false);
            })
        );

        this.subscriptions.push(
            this.route.params.subscribe( params => {
                const userId = params['userId'];
                this.db.doc(`users/${userId}`).get().then(user => {
                    this.user = user.data();
                });
            })
        );
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

}
