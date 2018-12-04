import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

    public friends = [];

    public onlineUsers: any;
    public onlineUserCount: number;

    public currentUser: any = null;

    constructor(public auth: AuthService,
                public alertService: AlertService,
                private loadingService: LoadingService,
                private router: Router) { }

    ngOnInit() {
        this.subscriptions.push(
            this.auth.currentUser.subscribe(user => {
                this.currentUser = user;
                this.getFriends();
            })
        );
        this.getOnlineUsers(); // display everyone online who is not current user and not friends of current user
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    getFriends() {
        if (this.currentUser.friends.length > 0) {
            const promises = [];
            for (let i = 0; i < this.currentUser.friends.length; i++) {
                promises.push(this.db.collection('users').doc(this.currentUser.friends[i]).get());
            }
            const tempFriends = [];
            Promise.all(promises).then(friends => {
                for (let i = 0; i < friends.length; i++) {
                    tempFriends.push(friends[i].data());
                }
                // TODO order array of obj friends
                // by online status
                // in game
                // waiting in game
                this.friends = tempFriends;
            });
        }
    }

    addFriend(userId) {
        this.currentUser.friends.push(userId);
        this.db.doc(`users/${this.currentUser.uid}`).set({
            friends: this.currentUser.friends
        }, {merge: true});
    }

    removeFriend(userId) {
        this.currentUser.friends.splice(this.currentUser.friends.indexOf(userId), 1);
        this.db.doc(`users/${this.currentUser.uid}`).set({
            friends: this.currentUser.friends
        }, {merge: true}).then(() => {
            this.friends = this.currentUser.friends;
        });
    }

    checkFriend(userId) {
        return this.friends.find(f => f.uid === userId);
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
        this.db.collection(`games`).doc(gameId).get().then(game => {
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
            this.db.collection(`games`).doc(gameId).update({
                players: players
            }).then(() => {
                this.db.doc(`users/${this.currentUser.uid}`).set({
                    inWaiting: false,
                    currentGameId: gameId
                }, {merge: true}).then(() => {
                    console.log('added player through join', player);
                    this.loadingService.setLoading(false);
                    this.router.navigateByUrl('mabble/' + gameId);
                });
            });
        });
    }

}
