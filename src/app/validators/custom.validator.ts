import { AbstractControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';

export function MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}

export function validatePassword(control: AbstractControl) {
    if (control.value === '' || control.value === null) return null;
    let val = (control.value) ? control.value : window.event;

    // If you change the regex then make sure this should be also synced in app.constants.ts->passwordHints.
    let filter = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\[{(!@#$%&*\-+_=^<>:\;|\'\",\\.\/?)}\]])[A-Za-z\d\[{(!@#$%&*\-+_=^<>:\;|\'\",\\.\/?)}\]]{8,}$/;
    if (!filter.test(val)) {
        return { isValidated: true };
    }
    return null;
}

export function isNumericOnly(control: AbstractControl) {
    if (control.value === '' || control.value === null) return null;
    let val = (control.value) ? control.value : window.event;
    let filter = /^(0|[0-9][0-9]*)$/;
    if (!filter.test(val)) {
        return { isValidated: true };
    }
    return null;
}

export function removeSpaces(control: AbstractControl) {
    if (control && control.value && !control.value.replace(/\s/g, '').length) {
        control.setValue('');
    }
    return null;
}


export function validateCharHyphenLength(control: AbstractControl) {
    if (control.value === '' || control.value === null) return null;
    let val = (control.value) ? control.value : window.event;
    let filter = /^[a-zA-Z-]{1,20}$/;
    if (!filter.test(val)) {
        return { isValidated: true };
    }
    return null;
}