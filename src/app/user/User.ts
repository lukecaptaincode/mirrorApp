import {auth} from 'firebase';
import {NgModule} from '@angular/core';
import {NavigationExtras, Router} from '@angular/router';
import {Storage} from '@ionic/storage';
import {Utilities} from '../utils/Utilities';
import {ToastController} from '@ionic/angular';

@NgModule({
    declarations: [
        User
    ],
    exports: [
        User
    ]
})
export class User {
    utils = Utilities;
    toastr = new ToastController();

    constructor(private storage: Storage, private router: Router) {
    }

    /**
     * validates the user inputs before login or registration
     * @param email
     * @param repeatEmail
     * @param password
     * @param repeatPassword
     * @param isRegistration
     * @return object - returns validation object
     */
    public static validateUserInput(email: string, password: string, repeatEmail: string = '', repeatPassword: string = '', isRegistration: boolean = false): object {
        // Validation Regex
        const emailRegexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        const minimumPasswordRegexp = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/); // Min 8, 1 letter, 1 Num
        const lowPasswordRegexp = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/); // Min 8, 1 letter, 1 num, 1 special
        const mediumPasswordRegexp = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/); // Min 8, 1 upper , 1 lower, 1 num
        const strongPasswordRegexp = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/); // Min 8, 1 upper, 1 lower, 1 num, 1 special
        // Check all is matching for sign up
        if (isRegistration && (email !== repeatEmail || password !== repeatPassword)) {
            const message = (email !== repeatEmail) ? 'Emails must match' : 'passwords must match';
            return {'error': true, 'message': message};
        }
        if (!emailRegexp.test(email)) {
            return {'error': true, 'message': 'Email is invalid'};
        }
        if (!minimumPasswordRegexp.test(password) && !lowPasswordRegexp.test(password) && !mediumPasswordRegexp.test(password)
            && !strongPasswordRegexp.test(password)) {
            return {'error': true, 'message': 'Password is invalid'};
        }
        return {'error': false, 'message': ''};
    }

    /**
     * Takes all user inputs and passes them to the validation method, upon response IF successful, returns
     * an object with success message else returns the error message.
     * @param email
     * @param repeatEmail
     * @param password
     * @param repeatPassword
     */
    public createUser(email: string, password: string, repeatEmail: string, repeatPassword: string) {
        return new Promise((response: any) => {
                const userValidationResponse = User.validateUserInput(email, password, repeatEmail, repeatPassword, true);
                if (!userValidationResponse['error']) { // If the error object is false, attempt to creat the user
                    auth().createUserWithEmailAndPassword(email, password).catch((error: any) => {
                        if (error) { // Firebase error and error handling
                            // Handle Errors here.
                            const errorCode = error.code;
                            const errorMessage = error.message;
                            if (errorCode === 'auth/weak-password') {
                                response({'error': true, 'message': 'Password is too weak'});
                            } else {
                                response({'error': true, 'message': errorMessage});
                            }

                        } else { // Success
                            response({'error': false, 'message': ''});
                        }
                    });
                } else { // Else return the error object to the front end with message
                    response(userValidationResponse);
                }
            }
        )
            ;
    }

    /**
     * Take the email and password and logs a request with firebase to see if the user exists returns the request as a promise
     * @param email
     * @param password
     * @return Promise - the request as promise
     */
    public login(email: string, password: string) {
        return new Promise((response: any) => {
            const userValidationResponse = User.validateUserInput(email, password);
            if (!userValidationResponse['error']) {
                auth().signInWithEmailAndPassword(email, password).then((firebaseUser) => {
                    response({'error': false, 'message': 'log in success', 'uId': firebaseUser['user']['uid']}); // If the user exists return true with the uID
                }).catch((error: any) => {
                    if (error) { // Firebase error and error handling
                        const errorMessage = error.message;
                        response({'error': true, 'message': errorMessage});
                    }
                });
            } else { // Else return the error object to the front end with message
                response(userValidationResponse);
            }
        });
    }

    /**
     * Calls the sendPasswordResetEmail (function from firebase) and returns it
     * as a promise to later resolve. This promise will always resolve to true
     * to obfuscate information form bad actors
     * @param email - email to reset
     * @return Promise - the promise that will always resolve true
     */
    public resetPassword(email: string) {
        return new Promise((response: any) => { // Return the request as a Promise
            auth().sendPasswordResetEmail(email).then((resp: any) => { // Start the request
                response({'isReset': true}); // On any response, return true
            }).catch((resp: any) => {
                response({'isReset': true}); // On error, return true
            });
        });
    }

    /**
     * Returns a promise that logs the user out when resolved or throws an error
     * @return Promise - the logout promise
     */
    public logout() {
        return new Promise((response: any) => {
            this.storage.set('uId', null).then(() => {
                auth().signOut().then(function () {
                    response(true);
                }, function (error) {
                    response(false);
                });
            });
        });

    }

    /**
     * Returns a promise that checks the session to see if the user is logged in using
     * the stored uID.
     */
    public sessionCheck() {
        return new Promise((response: any) => {
            this.storage.get('uId').then((val) => {
                // If the user id is null, undefined or empty, log them out
                if (val == null || val === undefined || val.trim() === '') {
                    this.callLogout();
                } else {
                    // Else return the uid
                    console.log('uId is:' + val);
                    response(val);

                }
            }).catch(() => {
                // If error logout
                this.callLogout();
            });
        });

    }

    /**
     * calls the logout logic then navigates to login page
     */
    public callLogout() {
        const navigationExtras: NavigationExtras = {};
        this.logout().then((response: boolean) => {
            if (response) {
                this.utils.displayToast('Logged out', 1000, this.toastr, 'success');
            } else {
                this.utils.displayToast('Error logging out', 1000, this.toastr, 'warning');
            }
            this.router.navigate(['/'], navigationExtras);
        });
    }
}
