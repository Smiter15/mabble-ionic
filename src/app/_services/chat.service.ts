import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { AngularFirestore } from '@angular/fire/firestore';

import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class ChatService {

    public chatRooms: Observable<any>;
    public changeChatRoom: BehaviorSubject<string | null> = new BehaviorSubject(null);
    public selectedChatRoom: Observable<any>;
    public selectedChatRoomMessages: Observable<any>;

    constructor(private afs: AngularFirestore,
                private auth: AuthService) {

        this.selectedChatRoom = this.afs.doc(`chatrooms/sat6rzgnkA3Xq2GIKSf2`).valueChanges();

        this.selectedChatRoomMessages = this.afs.collection(`chatrooms/sat6rzgnkA3Xq2GIKSf2/messages`, ref => {
            return ref.orderBy('createdAt', 'desc').limit(100);
        }).valueChanges().pipe(
            map(arr => arr.reverse())
        );

        this.chatRooms = afs.collection('chatrooms').valueChanges();
    }

    public sendMessage(text: string): void {
        const message = {
            message: text,
            createdAt: new Date(),
            sender: this.auth.currentUserSnapshot
        };
        this.afs.collection(`chatrooms/sat6rzgnkA3Xq2GIKSf2/messages`).add(message);
    }

}
