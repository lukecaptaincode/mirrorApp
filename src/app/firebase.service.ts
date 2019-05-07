import {Injectable} from '@angular/core';
import * as firebase from 'firebase';

@Injectable({
    providedIn: 'root'
})
export class FirebaseService {
    returnedData: any;
    constructor() {
    }

    /**
     * pushes data to firebase
     * @param ref - where to push
     * @param data - what to push
     */
    pushData(ref: string, data: any) {
        const dataPush = firebase.database().ref(ref);
        dataPush.update({data}).then(() => {
            console.log('success');
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
}
