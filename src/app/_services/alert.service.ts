import { Injectable } from '@angular/core';

// Material UI
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material';

@Injectable({
    providedIn: 'root'
})
export class AlertService {

    vp: MatSnackBarVerticalPosition = 'top';

    constructor(public snackBar: MatSnackBar) { }

    sendAlert(message) {
        this.snackBar.open(message, 'ok', {
            duration: 5000,
            verticalPosition: this.vp,
            panelClass: 'notification'
        });
    }

}
