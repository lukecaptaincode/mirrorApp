import {NgModule} from '@angular/core';
import {ToastController} from '@ionic/angular';

@NgModule({
    declarations: [
        Utilities
    ],
    exports: [
        Utilities
    ]
})
export class Utilities {

    /**
     * Takes in message text, duration, type, toast controller and then displays a toast message with the error
     * @param message
     * @param duration
     * @param toastController
     * @param type
     */
    static async displayToast(message: string, duration: number, toastController: ToastController, type: string) {
        const toast = await toastController.create({
            message: message,
            duration: duration,
            color: type
        });
        toast.present();
    }
}

