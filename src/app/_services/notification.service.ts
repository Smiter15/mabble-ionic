import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireMessaging } from '@angular/fire/messaging';

import { mergeMapTo } from 'rxjs/operators';
import { take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs'

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    currentMessage = new BehaviorSubject(null);

    constructor(
        private afs: AngularFirestore,
        private angularFireAuth: AngularFireAuth,
        private angularFireMessaging: AngularFireMessaging) {
        this.angularFireMessaging.messaging.subscribe(
            (notification) => {
                notification.onMessage = notification.onMessage.bind(notification);
                notification.onTokenRefresh = notification.onTokenRefresh.bind(notification);
            }
        )
    }

    /**
     * update token in firebase database
     *
     * @param userId userId as a key
     * @param token token as a value
     */
    updateToken(userId, token) {
        // we can change this function to request our backend service
        this.afs.collection(`fcmTokens`).doc(userId).set({'token': token});
    }

    /**
     * request permission for notification from firebase cloud messaging
     *
     * @param userId userId
     */
    requestPermission(userId) {
        this.angularFireMessaging.requestToken.subscribe((token) => {
            console.log(token);
            this.updateToken(userId, token);
        }, (err) => {
            console.error('Unable to get permission to notify.', err);
        });
    }

    /**
     * hook method when new notification received in foreground
     */
    receiveNotification() {
        this.angularFireMessaging.messages.subscribe((payload) => {
            console.log("new notification received. ", payload);
            this.currentMessage.next(payload);
        });
    }
}
