import {auth} from 'firebase';
import {NgModule} from '@angular/core';


@NgModule({
    declarations: [
        User
    ],
    exports: [
        User
    ]
})
export class User {
    /**
     * validates the user inputs before login or registration
     * @param email
     * @param repeatEmail
     * @param password
     * @param repeatPassword
     * @param isRegistration
     * @return object - returns validation object
     */
    public static validateUserInput(email: string, password: string, repeatEmail: string = '',
                                    repeatPassword: string = '', isRegistration: boolean = false): object {
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
        const userValidationResponse = User.validateUserInput(email, repeatEmail, password, repeatPassword, true);
        if (!userValidationResponse['error']) { // If the error object is false, attempt to creat the user
            auth().createUserWithEmailAndPassword(email, password).catch((error: any) => {
                if (error) { // Firebase error and error handling
                    // Handle Errors here.
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    if (errorCode === 'auth/weak-password') {
                        return {'error': true, 'message': 'Password is too weak'};
                    } else {
                        return {'error': true, 'message': errorMessage};
                    }
                } else { // Success
                    alert('MAJOR ZEST');
                }
            });
        } else { // Else return the error object to the front end with message
            return userValidationResponse;
        }
    }

}
