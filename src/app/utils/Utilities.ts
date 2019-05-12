import {NgModule} from '@angular/core';
import {ToastController} from '@ionic/angular';
import {animate} from 'just-animate/lib/main';


@NgModule({
    declarations: [
        Utilities
    ],
    exports: [
        Utilities
    ]
})
export class Utilities {

    static randomStringId() {
        // Random no to string
        return Math.random().toString(36).substring(5);
    }

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

    /**
     * Takes in params and returns the html for an ion cards
     * @param title
     * @param subtitle
     * @param content
     */
    static dynamicCardFactory(title: string = null, subtitle: string = null, content: string = null) {
        // Ternary operators to create card elements when not null
        const contentElement = (content) ? '<ion-card-content>' + content + '</ion-card-content>' : '';
        const titleElement = (title) ? '<ion-card-title>' + title + '</ion-card-title>' : '';
        const subtitleElement = (subtitle) ? '<ion-card-subtitle>' + subtitle + '</ion-card-subtitle>' : '';
        // Return built card
        return '<ion-card id="' + subtitle + '" >' +
            ' <div class="card-arrow ion-text-center"><ion-icon name="arrow-dropright-circle"></ion-icon></div>' +
            '<ion-card-header>' +
            subtitleElement +
            titleElement +
            '</ion-card-header>' +
            contentElement +
            '</ion-card>';
    }

    /**
     * shows or hides the loading spinner
     * @param isLoading - Whether to show or hide the spinner
     */
    static loadingSpinner(isLoading: boolean) {
        const spinner = document.getElementById('square-loader');
        if (isLoading) {
            spinner.style.display = 'block';
        } else {
            spinner.style.display = 'none';
        }
    }

    /**
     * Toggles the custom modal based on the value of the opacity,
     * uses just animate to load the modal in and out
     */
    static toggleModal() {
        this.loadingSpinner(true);
        const modal = document.getElementById('customModal');
        const modalBackdrop = document.getElementById('modalBackDrop');
        // Most reliable way to compare the value of opacity
        if (window.getComputedStyle(modal).getPropertyValue('opacity') === '0') {
            const fadeIn = animate({
                targets: [modal, modalBackdrop],
                duration: 1000,
                web: {
                    opacity: [0, 1]
                }
            });
            modal.style.pointerEvents = 'all';
            modalBackdrop.style.pointerEvents = 'all';
            fadeIn.play();
        } else {
            const fadeOut = animate({
                targets: [modal, modalBackdrop],
                duration: 1000,
                web: {
                    opacity: [1, 0]
                }
            });
            modal.style.pointerEvents = 'none';
            modalBackdrop.style.pointerEvents = 'none';
            fadeOut.play();
        }
        this.loadingSpinner(false);

    }

}

