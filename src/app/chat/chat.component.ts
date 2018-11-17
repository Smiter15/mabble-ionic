import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { Observable, Subscription } from "rxjs/index";

import { ChatService } from "../_services/chat.service";

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

    @ViewChild('scrollContainer') private SC: ElementRef;

    private subscriptions: Subscription[] = [];
    public messages: Observable<any>;

    constructor(private chatService: ChatService) {

        this.subscriptions.push(
            this.chatService.selectedChatRoomMessages.subscribe(messages => {
                this.messages = messages;
            })
        );
    }

    ngOnInit() {
        this.scrollToBottom();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    private scrollToBottom(): void {
        try {
            this.SC.nativeElement.scrollTop = this.SC.nativeElement.scrollHeight;
        } catch(err) { }
    }

}
