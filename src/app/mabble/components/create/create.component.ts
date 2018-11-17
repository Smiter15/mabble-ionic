import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AngularFirestore } from '@angular/fire/firestore';

import { Subscription } from 'rxjs';

import { AuthService } from '../../../_services/auth.service';
import { LoadingService } from '../../../_services/loading.service';

import * as deck6 from 'src/app/mabble/decks/deck6.default.js';

@Component({
    selector: 'app-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription[] = [];

    public currentUser: any = null;
    public createGameForm: FormGroup;

    public noPlayersList = [
        {value: 2, viewValue: '2'},
        {value: 3, viewValue: '3'},
        {value: 4, viewValue: '4'}
    ];

    constructor(private fb: FormBuilder,
                private afs: AngularFirestore,
                public auth: AuthService,
                private loadingService: LoadingService,
                private router: Router) { }

    ngOnInit() {
        this.subscriptions.push(
            this.auth.currentUser.subscribe(user => {
                this.currentUser = user;
            })
        );

        this.createGameForm = this.fb.group({
            noPlayers: ['', [Validators.required]],
            noImages: [{value: '6', disabled: true}, []]
        });
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    createGame() {
        this.loadingService.setLoading(true);
        const player = {};
        player[this.currentUser.uid] = {
            score: 0,
            displayName: this.currentUser.displayName,
            photoURL: this.currentUser.photoURL,
            uid: this.currentUser.uid,
            playerClass: null,
            imageClass: null
        };
        const game = {
            deck6: deck6.deck6, // dynamic in future
            // theme: 'wildlife' // TODO
            createdAt: new Date(),
            creator: this.currentUser.uid,
            started: false,
            finished: false,
            winnerName: null,
            winnerImageURL: null,
            noPlayers: this.createGameForm.value.noPlayers,
            playingCard: null,
            players: player,
            playAgainVotes: 0,
            nextGameURL: null
        };
        this.afs.collection(`mabble/ZNtkxBjM9akNP7JSgPro/games`).add(game).then(game => {
            // add user to game
            console.log('created game ', game);
            console.log('added player through create', player);
            this.loadingService.setLoading(false);
            // send user to game
            this.router.navigateByUrl(`mabble/${game.id}`);
        });
    }

}
