/// <reference path="../../typings/tsd.d.ts" />

module Application.Services {
    export class OAuthService {
        public refreshToken = '';

        constructor(private ConfigService: Application.Services.ConfigService) {
        }

        public initialize() {
            this.refreshToken = this.retrieveTokenFromVault();
        };

        public connect() {
            this.initialize();
            return new Promise((done, error) => {
                if (!this.refreshToken) {
                    this.authenticate().then(
                        token => this.grant(token).then(accessToken => {
                            let cred = new Windows.Security.Credentials
                                .PasswordCredential("OauthToken", "CurrentUser", accessToken.access_token);
                            this.refreshToken = accessToken.access_token;
                            let passwordVault = new Windows.Security.Credentials.PasswordVault();
                            passwordVault.add(cred);
                            done(this.refreshToken);
                        }));
                } else {
                    done(this.refreshToken);
                }
            });
        };

        private retrieveTokenFromVault() {
            let passwordVault = new Windows.Security.Credentials.PasswordVault();
            let storedToken;

            try {
                let credential = passwordVault.retrieve("OauthToken", "CurrentUser");
                storedToken = credential.password;
                // Uncomment this line to remove the token from the password vault so you'll have to log in again
                //passwordVault.remove(credential);
            } catch (e) {
                // no stored credentials
            }

            return storedToken;
        }

        private grant(token) {
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
                headers:
                {
                    "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
                }
            }).then(x => JSON.parse(x.response));
        };

        private authenticate() {
            return new Promise(function(complete, error) {
                let oauthUrl = this.ConfigService.authUri;
                let clientId = this.ConfigService.clientId;
                let redirectUrl = this.ConfigService.redirectUri;
                let requestUri = new Windows.Foundation.Uri(`${oauthUrl}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUrl)}&response_type=code&access_type=offline`);
                let callbackUri = new Windows.Foundation.Uri(redirectUrl);

                Windows.Security.Authentication.Web.WebAuthenticationBroker.
                    authenticateAsync(Windows.Security.Authentication.Web.
                        WebAuthenticationOptions.none, requestUri, callbackUri)
                    .done(result => {
                        if (result.responseStatus === 0) {
                            complete(result.responseData.replace('http://localhost/?code=', ''));
                        } else {
                            error(result);
                        }
                    });
            });
        }

        // Serialize a piece of data to a querystring
        private serializeData(data, encode?) {
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