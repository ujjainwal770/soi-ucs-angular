export const _CONST = {
    defaultPageSizeArray: [10, 25, 50, 100],
    zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
    sixty: 60, twoHundred: 200,
    hour: 23.99999,
    minutes: 60,
    seconds: 60,
    milliSeconds: 1000,
    minAge: 13,
    maxAge: 120,
    MAX_SMALL_WIDTH: 400,
    MEDIUM_WIDTH: 500,
    MAX_MEDIUM_WIDTH: 700,
    BULK_UPLOAD_DELAY_MS: 3000,
    RESEND_INVITATION_DELAY_SEC : 30,
    /**
     * match status -> 0 = No value entered, 1 = matched and 2 = Not matched.
     * If you change the regex then make sure this should be also synced in custom.validators.ts->validatePassword().
     */
    passwordHints: {
        // Must contain at least 8 characters.
        minLength: { matchStatus: 0, regex: new RegExp(/[^]{8,}$/), matIcon: "circle" },

        // Must contain at least one upper case.
        uppercase: { matchStatus: 0, regex: new RegExp(/(?=.*[A-Z])/), matIcon: "circle" },

        // Must contain at least one lower case.
        lowercase: { matchStatus: 0, regex: new RegExp(/(?=.*[a-z])/), matIcon: "circle" },

        // Must contain at least one number.
        number: { matchStatus: 0, regex: new RegExp(/(?=.*[\d])/), matIcon: "circle" },

        //Must contain at least one special character.
        specialChar: { matchStatus: 0, regex: new RegExp(/^(?=.*[\[{(!@#$%&*\-+_=^<>:\;|\'\",\\.\/?)}\]])[A-Za-z\d\[{(!@#$%&*\-+_=^<>:\;|\'\",\\.\/?)}\]]{0,}$/), matIcon: "circle" }
    },

    specialChars: '\[{(!@#$%&*\-+_=^<>:\;|\'\",\\.\/?)}\]' as const
}