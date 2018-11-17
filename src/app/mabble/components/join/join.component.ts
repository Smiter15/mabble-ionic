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

    private subscriptions: Subscription[] = [];

    public currentUser: any = null;
    public joinGameForm: FormGroup;

    private db = firebase.firestore();

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
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

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

}
