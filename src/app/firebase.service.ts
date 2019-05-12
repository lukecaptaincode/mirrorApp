import {Injectable} from '@angular/core';
import * as firebase from 'firebase';

@Injectable({
    providedIn: 'root'
})
export class FirebaseService {
    returnedData: any;

    /**
     * pushes data to firebase
     * @param ref - where to push
     * @param data - what to push
     * @return promise - returns a promise that will resolve when the push completes
     */
    pushData(ref: string, data: any) {
        return new Promise((response: any) => {
            const dataPush = firebase.database().ref(ref);
            dataPush.update({data}).then(() => {
                response(true);
            }).catch((error: any) => {
                response(false);
            });
        });

    }

    /**
     * Gets data from firebase using the passed ref
     * @param ref
     */
    getData(ref: string) {
        return new Promise((response: any) => {
            firebase.database().ref(ref).once('value').then((snapshot) => {
                response(snapshot.val());
            });
        });
    }

    /**
     * deletes data based on ref
     * @param ref
     * @param key - the item key to remove
     */
    deleteData(ref: string, key: string) {
        return new Promise((response: any) => {
            firebase.database().ref(ref).child(key).remove().then((snap) => {
                response(snap);
            });
        });
    }
}
