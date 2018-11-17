import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Material
import { MaterialModule } from './material.module';

// Angular Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireMessagingModule } from '@angular/fire/messaging';

// Components
import { AppComponent } from './app.component';
import { AlertComponent } from './alert/alert.component';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

import { ChatComponent } from './chat/chat.component';
import { ChatInputComponent } from './chat/components/chat-input/chat-input.component';
import { ChatMessageComponent } from './chat/components/chat-message/chat-message.component';

import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserProfileEditComponent } from './user-profile-edit/user-profile-edit.component';

import { MabbleComponent } from './mabble/mabble.component';
import { CreateComponent } from './mabble/components/create/create.component';
import { JoinComponent } from './mabble/components/join/join.component';
import { PlayAgainComponent } from './mabble/components/play-again/play-again.component';

// Routes
import { AppRoutingModule } from './app-routing.module';

import { environment } from '../environments/environment';

import { NgxLoadingModule } from 'ngx-loading';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        AngularFirestoreModule.enablePersistence(),
        AngularFireDatabaseModule,
        AngularFireStorageModule,
        AngularFireMessagingModule,
        AppRoutingModule,
        NgxLoadingModule,
        BrowserAnimationsModule
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        LoginComponent,
        RegisterComponent,
        UserProfileComponent,
        ChatComponent,
        ChatInputComponent,
        ChatMessageComponent,
        UserProfileEditComponent,
        MabbleComponent,
        CreateComponent,
        JoinComponent,
        PlayAgainComponent
    ],
    entryComponents: [AlertComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }
