import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { AngularFirestore } from "@angular/fire/firestore";
import * as firebase from "firebase";

import { Observable } from 'rxjs';
import { tap, map, take } from 'rxjs/operators';

import { AuthService } from "../_services/auth.service";
import { AlertService } from "../_services/alert.service";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private afs: AngularFirestore, private auth: AuthService, private alertService: AlertService, private router: Router) { }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this.auth.currentUser.pipe(
            take(1),
            map(user => !!user),
            tap(loggedIn => {
                if (!loggedIn) {
                    this.alertService.sendAlert('You need to be logged in.');
                    this.router.navigate([''], {queryParams: {returnUrl: state.url}});
                } else {
                    firebase.database().ref(`/status/${this.auth.currentUserSnapshot.uid}`).set({
                        state: 'online',
                        lastChanged: firebase.database.ServerValue.TIMESTAMP,
                    });
                    this.afs.doc(`users/${this.auth.currentUserSnapshot.uid}`).set({
                        state: 'online',
                        lastChanged: firebase.firestore.FieldValue.serverTimestamp(),
                    }, {merge: true});
                }
            })
        );
    }

}
