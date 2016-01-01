angular.module('modern-gitter')
    .service('OAuthService', function (ConfigService) {
        // based on the code of Timmy Kokke (https://github.com/sorskoot/UWP-OAuth-demo)
        var oauthService = this;

        oauthService.refreshToken = '';

        oauthService.initialize = function () {
            oauthService.refreshToken = retrieveTokenFromVault();
        };

        oauthService.connect = function () {
            oauthService.initialize();
            return new Promise((done, error) => {
                if (!oauthService.refreshToken) {
                    authenticate().then(
                        token => grant(token).then(accessToken => {
                            let cred = new Windows.Security.Credentials
                                .PasswordCredential("OauthToken", "CurrentUser", accessToken.access_token);
                            oauthService.refreshToken = accessToken.access_token;
                            let passwordVault = new Windows.Security.Credentials.PasswordVault();
                            passwordVault.add(cred);
                            done(oauthService.refreshToken);
                        }));
                } else {
                    done(oauthService.refreshToken);
                }
            });
        };

        function retrieveTokenFromVault() {
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

        function grant(token) {
            let oauthUrl = ConfigService.tokenUri;
            let clientId = ConfigService.clientId;
            let clientSecret = ConfigService.clientSecret;
            let redirectUrl = ConfigService.redirectUri;

            return WinJS.xhr({
                type: "post",
                url: oauthUrl,
                data: serializeData({
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

        function authenticate() {
            return new Promise(function (complete, error) {
                let oauthUrl = ConfigService.authUri;
                let clientId = ConfigService.clientId;
                let redirectUrl = ConfigService.redirectUri;
                let requestUri = Windows.Foundation.Uri(`${oauthUrl}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUrl) }&response_type=code&access_type=offline`);
                let callbackUri = Windows.Foundation.Uri(redirectUrl);

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
        function serializeData(data, encode) {
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
                    buffer.push(`${encodeURIComponent(name) } = ${encodeURIComponent((value == null) ? "" : value) }`);
                } else {
                    buffer.push(`${name}=${value == null ? "" : value}`);
                }
            }

            // Serialize the buffer and clean it up for transportation
            return buffer.join("&").replace(/%20/g, "+");
        }

        return oauthService;
    });