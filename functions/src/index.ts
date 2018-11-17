const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// Since this code will be running in the Cloud Functions enviornment
// we call initialize Firestore without any arguments because it
// detects authentication from the environment.
const firestore = admin.firestore();

// Create a new function which is triggered on changes to /status/{uid}
// Note: This is a Realtime Database trigger, *not* Cloud Firestore.
exports.onUserStatusChange = functions.database.ref('/status/{uid}').onUpdate(
    (change, context) => {
        // Get the data written to Realtime Database
        const eventStatus = change.after.val();

        // Then use other event data to create a reference to the
        // corresponding Firestore document.
        const userFirestoreRef = firestore.doc(`users/${context.params.uid}`);

        // It is likely that the Realtime Database change that triggered
        // this event has already been overwritten by a fast change in
        // online / offline status, so we'll re-read the current data
        // and compare the timestamps.
        return change.after.ref.once('value').then((statusSnapshot) => {
            const status = statusSnapshot.val();
            console.log(status, eventStatus);
            // If the current timestamp for this data is newer than
            // the data that triggered this event, we exit this function.
            if (status.lastChanged > eventStatus.lastChanged) {
                return null;
            }

            // Otherwise, we convert the last_changed field to a Date
            eventStatus.lastChanged = new Date(eventStatus.lastChanged);

            // ... and write it to Firestore.
            return userFirestoreRef.set(eventStatus, {merge: true});
        });
    });
