import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";

import * as firebase from 'firebase';

import { Subscription } from "rxjs/index";

// Services
import { AuthService } from "./_services/auth.service";
import { LoadingService } from "./_services/loading.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{

    private db = firebase.firestore();

    private subscriptions: Subscription[] = [];
    public loading: boolean;

    public currentUser: any | null;
    public onlineUsers: any;
    public onlineUserCount: number;

    constructor(public auth: AuthService,
                private loadingService: LoadingService,
                private router: Router,) {
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

        this.getOnlineUsers();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    getOnlineUsers() {
        this.db.collection('users').where('state', '==', 'online').onSnapshot(onlineUsers => {

            let tempOnlineUsers = [];
            onlineUsers.forEach(function(onlineUser) {
                tempOnlineUsers.push(onlineUser.data());
            });

            this.onlineUsers = tempOnlineUsers;
            this.onlineUserCount = onlineUsers.size;
        })
    }

    joinGame(gameId) {
        this.db.collection(`mabble/ZNtkxBjM9akNP7JSgPro/games`).doc(gameId).get().then(game => {
            this.loadingService.setLoading(true);
            console.log('game', game.data());
            const players = game.data().players;
            let player = {};
            player = {
                score: 0,
                displayName: this.currentUser.displayName,
                photoURL: this.currentUser.photoURL,
                uid: this.currentUser.uid,
                playerClass: null,
                imageClass: null
            };
            players[this.currentUser.uid] = player;
            this.db.collection(`mabble/ZNtkxBjM9akNP7JSgPro/games`).doc(gameId).update({
                players: players
            }).then(() => {
                console.log('added player through join', player);
                this.loadingService.setLoading(false);
                // send user to game
                this.router.navigateByUrl('mabble/' + gameId);
            });
        });
    }

}
