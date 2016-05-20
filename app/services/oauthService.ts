/// <reference path="../../typings/tsd.d.ts" />

module Application.Services {
    export class OAuthService {
        // properties
        public refreshToken: string;

        constructor(private ConfigService: ConfigService) {
            this.refreshToken = this.retrieveTokenFromVault();
        }

        // public methods
        public connect(): Promise<string> {
            return new Promise((done, error) => {
                if (!this.refreshToken) {
                    this.authenticate()
                        .then(token => this.grant(token)
                            .then(accessToken => {
                                let credentials = new Windows.Security.Credentials.PasswordCredential("OauthToken", "CurrentUser", accessToken.access_token);
                                let passwordVault = new Windows.Security.Credentials.PasswordVault();
                                passwordVault.add(credentials);

                                this.refreshToken = accessToken.access_token;

                                done(this.refreshToken);
                            }));
                } else {
                    done(this.refreshToken);
                }
            });
        };

        public disconnect() {
            let passwordVault = new Windows.Security.Credentials.PasswordVault();
            let credential = passwordVault.retrieve("OauthToken", "CurrentUser");

            // remove the token from the password vault so you'll have to log in again
            passwordVault.remove(credential);
            this.refreshToken = undefined;
        }

        // private methods
        private retrieveTokenFromVault(): string {
            let passwordVault = new Windows.Security.Credentials.PasswordVault();
            let storedToken: string;

            try {
                let credential = passwordVault.retrieve("OauthToken", "CurrentUser");
                storedToken = credential.password;
            } catch (e) {
                // no stored credentials
            }

            return storedToken;
        }

        private grant(token: string) {
            let oauthUrl = this.ConfigService.tokenUri;
            let clientId = this.ConfigService.clientId;
            let clientSecret = this.ConfigService.clientSecret;
            let redirectUrl = this.ConfigService.redirectUri;

            return WinJS.xhr({
                type: "post",
                url: oauthUrl,
                data: this.serializeData({
                    code: token,
                    client_id: clientId,
                    client_secret: clientSecret,
                    redirect_uri: redirectUrl,
                    grant_type: 'authorization_code'
                }),
                headers: {
                    "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
                }
            }).then(x => JSON.parse(x.response));
        };

        private authenticate(): Promise<string> {
            return new Promise((complete, error) => {
                let oauthUrl = this.ConfigService.authUri;
                let clientId = this.ConfigService.clientId;
                let redirectUrl = this.ConfigService.redirectUri;
                let requestUri = new Windows.Foundation.Uri(`${oauthUrl}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUrl)}&response_type=code&access_type=offline`);
                let callbackUri = new Windows.Foundation.Uri(redirectUrl);

                Windows.Security.Authentication.Web.WebAuthenticationBroker.
                    authenticateAsync(Windows.Security.Authentication.Web.WebAuthenticationOptions.none, requestUri, callbackUri)
                    .done(result => {
                        if (result.responseStatus === 0) {
                            complete(result.responseData.replace('http://localhost/?code=', ''));
                        } else {
                            error(result);
                        }
                    });
            });
        }

        private serializeData(data, encode?) {
            // Serialize a piece of data to a querystring

            if (typeof data !== 'object') {
                return ((data == null) ? "" : data.toString());
            }
            let buffer = [];

            // Serialize each key in the object
            for (let name in data) {
                if (!data.hasOwnProperty(name)) {
                    continue;
                }
                let value = data[name];
                if (!!encode) {
                    buffer.push(`${encodeURIComponent(name)} = ${encodeURIComponent((value == null) ? "" : value)}`);
                } else {
                    buffer.push(`${name}=${value == null ? "" : value}`);
                }
            }

            // Serialize the buffer and clean it up for transportation
            return buffer.join("&").replace(/%20/g, "+");
        }
    }
}