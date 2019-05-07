import {Component} from '@angular/core';
import {User} from './../user/User';
import {ToastController} from '@ionic/angular';
import {Utilities} from '../utils/Utilities';
import {NavigationExtras, Router} from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {
    toastr = new ToastController();
    user = new User();
    utils = Utilities;
    // Inputs
    emailInputValue: string;
    repeatEmailInputValue: string;
    passwordInputValue: string;
    repeatPasswordInputValue: string;
    formSubmitAction = 'login';

    /**
     * Constructor with router as param
     * @param router
     */
    constructor(private router: Router) {
        // Empty, nothing to build
    }

    /**
     * Takes in the user class response object and either displays a toast
     * to inform the user of errors or navigates to the main page and passese the user id
     * @param response the response object from the user class
     */
    private loginHandler(response: object) {
        if (response['error']) { // If error , show toast
            this.utils.displayToast(response['message'], 1000, this.toastr, 'danger');
        } else {
            // Add the userid to the navigation extras and pass the state
            const navigationExtras: NavigationExtras = {
                state: {
                    uId: response['uId']
                }
            };
            this.router.navigate(['main'], navigationExtras); // Angular router with param
        }
    }

    /**
     * Handles the form submission based on the passed action argument.
     * Calls the promise for the corresponding action from the user class, performs the correct action on resolution of the promise
     * If the promise is login or signup it calls the login handler, if its the reset email action it will always display
     * a toast telling the user the password was reset, regardless of whether or not it was reset, this is for security reasons.
     * All the calls are made a promises to ensure that the firebase has time to respond and actually populate the responses
     * so bad actors can't fish to see what emails have been used in siugn ups.
     * @param formSubmitAction  -is either; login , signup or reset password
     */
    public formSubmit(formSubmitAction: string) {

        if (formSubmitAction === 'login') { // Create promise for logging in, passing email and password.
            this.user.login(this.emailInputValue, this.passwordInputValue).then((resp: any) => {
                this.loginHandler(resp); // Call login handler
            });
        } else if (formSubmitAction === 'signup') { // Create promise for signup passing, email, repeat email, password and repeat password.
            this.user.createUser(this.emailInputValue, this.passwordInputValue, this.repeatEmailInputValue, this.repeatPasswordInputValue).then((resp: any) => {
                this.loginHandler(resp);
            });
        } else if (formSubmitAction === 'reset password') {
            this.user.resetPassword(this.emailInputValue).then((resp: any) => { // Pass email for reset and tell user it was reset.
                this.utils.displayToast('Reset email sent', 1000, this.toastr, 'warning');
                formSubmitAction = 'login'; // Change to load login form.
            });
        }

    }

    /**
     * Changes the form to corresponding action by setting the class var.
     * NOTE: This could have been done solely in the HTML file, however I did it hear for clarity
     * @param formToToggle -  is either; login , signup or reset password
     */
    public setFormSubmissionAction(formToToggle: string) {
        this.formSubmitAction = formToToggle;
    }


}
