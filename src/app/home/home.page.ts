import {Component} from '@angular/core';
import {User} from './../user/User';
import {ToastController} from '@ionic/angular';
import {Utilities} from '../utils/Utilities';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {
    toastr = new ToastController();
    utils = Utilities;
    user = new User();
    // Inputs
    emailInputValue: string;
    passwordInputValue: string;

    constructor() {

    }

    public login() {
        const response = User.validateUserInput(this.emailInputValue, this.passwordInputValue);
        if (response['error']) {
            this.utils.displayToast(response['message'], 1000, this.toastr, 'danger');
        } else {
            // TODO login
        }
    }

    /**
     * calls the function in the user class to creat a new user
     * @param email
     * @param repeatEmail
     * @param password
     * @param repeatPassword
     */
    public createUser(email: string, repeatEmail: string, password: string, repeatPassword) {
        const response = this.user.createUser(email, repeatEmail, password, repeatPassword);
        if (response['error']) {
            this.utils.displayToast(response['message'], 1000, this.toastr, 'danger');
        } else {
            // TODO login
        }
    }
}
