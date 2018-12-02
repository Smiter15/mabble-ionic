import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import * as firebase from 'firebase';

import { Subscription } from 'rxjs';

import { AuthService } from '../../../_services/auth.service';
import { AlertService } from '../../../_services/alert.service';
import { LoadingService } from '../../../_services/loading.service';

@Component({
    selector: 'app-join',
    templateUrl: './join.component.html',
    styleUrls: ['./join.component.scss']
})
export class JoinComponent implements OnInit, OnDestroy {

    private db = firebase.firestore();

    private subscriptions: Subscription[] = [];

    public onlineUsers: any;
    public onlineUserCount: number;

    public currentUser: any = null;
    public joinGameForm: FormGroup;

    constructor(private fb: FormBuilder,
                public auth: AuthService,
                public alertService: AlertService,
                private loadingService: LoadingService,
                private router: Router) { }

    ngOnInit() {
        this.subscriptions.push(
            this.auth.currentUser.subscribe(user => {
                this.currentUser = user;
            })
        );

        this.joinGameForm = this.fb.group({
            gameId: ['', [Validators.required]]
        });

        this.getOnlineUsers();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    getOnlineUsers() {
        this.db.collection('users').where('state', '==', 'online').onSnapshot(onlineUsers => {

            const tempOnlineUsers = [];
            onlineUsers.forEach(function(onlineUser) {
                tempOnlineUsers.push(onlineUser.data());
            });

            this.onlineUsers = tempOnlineUsers;
            this.onlineUserCount = onlineUsers.size;
        });
    }

    joinGame(gameId) {
        console.log('join game id', gameId);
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
                this.db.doc(`users/${this.currentUser.uid}`).set({
                    inWaiting: false,
                    currentGameId: gameId
                }, {merge: true}).then(() => {
                    console.log('added player through join', player);
                    this.loadingService.setLoading(false);
                    // send user to game
                    this.router.navigateByUrl('mabble/' + gameId);
                });
            });
        });
    }
/*
    joinGame() {
        this.db.collection(`mabble/ZNtkxBjM9akNP7JSgPro/games`).doc(this.joinGameForm.value.gameId).get().then(game => {
            if (game.exists) {
                this.loadingService.setLoading(true);
                console.log('game', game.data());
                if (Object.keys(game.data().players).length < game.data().noPlayers) {
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
                    this.db.collection(`mabble/ZNtkxBjM9akNP7JSgPro/games`).doc(this.joinGameForm.value.gameId).update({
                        players: players
                    }).then(() => {
                        console.log('added player through join', player);
                        this.loadingService.setLoading(false);
                        // send user to game
                        this.router.navigateByUrl('mabble/' + this.joinGameForm.value.gameId);
                    });
                } else {
                    this.loadingService.setLoading(false);
                    this.alertService.sendAlert('Game has finished!');
                }
            } else {
                this.loadingService.setLoading(false);
                console.log('No such document!');
                this.alertService.sendAlert('That game does not exist!');
            }
        });
    }
    */

}
