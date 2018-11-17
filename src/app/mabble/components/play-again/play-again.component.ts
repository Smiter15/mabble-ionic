import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFirestore } from '@angular/fire/firestore';

import { AuthService } from '../../../_services/auth.service';
import { LoadingService } from '../../../_services/loading.service';

import * as deck6 from 'src/app/mabble/decks/deck6.default.js';

@Component({
    selector: 'app-play-again',
    templateUrl: './play-again.component.html',
    styleUrls: ['./play-again.component.scss']
})
export class PlayAgainComponent implements OnInit {

    constructor(private afs: AngularFirestore,
                public auth: AuthService,
                private loadingService: LoadingService,
                private router: Router) { }

    ngOnInit() {}

    public create(previousGame, previousGameId) {
        Object.keys(previousGame.players).forEach(key => {
            previousGame.players[key].score = 0;
            previousGame.players[key].playerClass = null;
        });
        this.loadingService.setLoading(true);
        const game = {
            deck6: deck6.deck6, // dynamic in future
            // theme: 'wildlife' // TODO
            createdAt: new Date(),
            creator: previousGame.creator,
            started: false,
            finished: false,
            winnerName: null,
            winnerImageURL: null,
            noPlayers: previousGame.noPlayers,
            playingCard: null,
            players: previousGame.players,
            playAgainVotes: 0,
            nextGameURL: null
        };
        this.afs.collection(`mabble/ZNtkxBjM9akNP7JSgPro/games`).add(game).then(game => {
            // add user to game
            console.log('created game from play again', game);
            this.afs.doc(`mabble/ZNtkxBjM9akNP7JSgPro/games/${previousGameId}`).update({
                nextGameURL: `mabble/${game.id}`
            }).then(() => {
                this.loadingService.setLoading(false);
                // send user to game
                this.router.navigateByUrl(`mabble/${game.id}`);
            });
        });
    }

}
