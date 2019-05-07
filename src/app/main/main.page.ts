import {Component, OnInit} from '@angular/core';
import {ToastController, AlertController} from '@ionic/angular';
import {Utilities} from '../utils/Utilities';
import {FirebaseService} from '../firebase.service';
import {Storage} from '@ionic/storage';
import {animate} from '../../../node_modules/just-animate/lib/all';
import {Router, ActivatedRoute, NavigationExtras} from '@angular/router';

@Component({
    selector: 'app-main',
    templateUrl: './main.page.html',
    styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
    toastr = new ToastController();
    utils = Utilities;
    mirrorCode: string;
    mirrorName: string;
    codeIsValid = true;
    firebaseService = new FirebaseService();
    mirrors: any [] = [];
    userId: string;

    constructor(public alertController: AlertController, private storage: Storage,
                private router: Router, private route: ActivatedRoute) {
        this.getMirrorsFromStorage().then((response: any) => {
            this.mirrors = response;
            for (let i = 0; i < this.mirrors.length; i++) {
                document.getElementById('mirror-list').innerHTML +=
                    this.utils.dynamicCardFactory(
                        this.mirrors[i]['name'],
                        this.mirrors[i]['id']);
            }
            // For each ion-card generated assign an on click listener to go to the mirrors page
            const cardArray = document.getElementsByTagName('ion-card');
            for (let i = 0; i < cardArray.length; i++) {
                const cardId = cardArray[i].id;
                cardArray[i].addEventListener('click', () => {
                    this.goToMirrorHandler(cardId);
                    const timeline = animate({
                        targets: cardArray[i],
                        duration: 1000,
                        web: {
                            transform: ['scale(1)', 'scale(1.01)', 'scale(1)']
                        }
                    });

                    timeline.play();
                });
            }
        });
        // Get the userId from the passed state
        this.route.queryParams.subscribe(params => {
            this.userId = this.router.getCurrentNavigation().extras.state.uId;
        });
    }

    ngOnInit() {
    }

    /**
     * Get all mirrors form local storage and load them to a class object
     */
    getMirrorsFromStorage() {
        return new Promise((response) => {
            this.storage.get('mirrors').then((val) => {
                response(val);
            }).catch((err) => {
                console.log('No mirrors ' + err);
            });
        });
    }

    addMirror() {
        this.firebaseService.getData(this.mirrorCode + '/isLive').then((response: any) => {
            if (!response) {
                this.utils.displayToast('Mirror does not exist', 1000, this.toastr, 'danger');
            } else {
                this.buildMirrorCard();
            }
        });
    }

    /**
     * Checks to make sure mirror code input is valid, is used as onchange function for mirror
     * code input. Enables and disables the add mirror button depending of the validity of the
     * code.
     */
    mirrorCodeCheck() {
        // Create var for input element to avoid repeating calls to front end
        const mirrorCodeInput = document.querySelector('#mirroCodeInput') as HTMLElement;
        const onlyAlphaNumericRegex = new RegExp(/^[a-z0-9]+$/i); // Only alpha numerics in mirror code
        mirrorCodeInput.style.borderRadius = '6px';
        if (this.mirrorCode.length < 12 || !onlyAlphaNumericRegex.test(this.mirrorCode)) {
            mirrorCodeInput.style.border = '1px solid RED';
            mirrorCodeInput.style.backgroundColor = 'rgba(255,0,0,0.2)';
            this.codeIsValid = true;
        } else {
            mirrorCodeInput.style.border = '1px solid GREEN';
            mirrorCodeInput.style.backgroundColor = 'rgba(51,204,0,0.2)';
            this.codeIsValid = false;
        }
    }

    goToMirrorHandler(id: string) {
        // Add the userid to the navigation extras and pass the state
        const navigationExtras: NavigationExtras = {
            state: {
                uId: this.userId,
                mirrorId: id
            }
        };
        this.router.navigate(['mirror'], navigationExtras); // Angular router with param

    }

    /**
     * Builds the mirror card using and alert to get the mirrors name and then building the card
     * adding it to the ui and then saving the data.
     */
    async buildMirrorCard() {
        const alert = await this.alertController.create({
            header: 'Enter mirror name',
            inputs: [
                {
                    name: 'mirrorName',
                    type: 'text',
                    placeholder: 'Mirror name'
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                }, {
                    text: 'Ok',
                    cssClass: 'dark',
                    handler: data => {
                        document.getElementById('mirror-list').innerHTML +=
                            this.utils.dynamicCardFactory(
                                data.mirrorName,
                                this.mirrorCode
                            );
                        this.utils.displayToast('Mirror added!', 1000, this.toastr, 'success');
                        if (!this.mirrors) {
                            this.mirrors = [{'name': data.mirrorName, 'id': this.mirrorCode}];
                        } else {
                            this.mirrors.push({'name': data.mirrorName, 'id': this.mirrorCode});
                        }
                        this.storage.set('mirrors', this.mirrors);
                    }
                }
            ]
        });

        await alert.present();
    }

}
