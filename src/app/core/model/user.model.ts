export class User {
    constructor(
        private email: string,
        private name: string,
        private schoolid: number,
        private schoolName: string,
        private usertype: string,
        private _token: string,
        private _tokenExpirationDate: Date
    ) { }

    get token() {
        if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
            return null;
        }
        return this._token;
    }
}