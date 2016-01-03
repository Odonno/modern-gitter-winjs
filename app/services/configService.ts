/// <reference path="../../typings/tsd.d.ts" />

module Application.Services {
    export class ConfigService {
        public baseUrl = "https://api.gitter.im/v1/";
        public tokenUri = "https://gitter.im/login/oauth/token";
        public clientId = "0f3fc414587a8d31a1514e005fa157168ad8efdb";
        public clientSecret = "55c361ef1de79ffef1a49a1a0bff1a7a0140799c";
        public redirectUri = "http://localhost";
        public authUri = "https://gitter.im/login/oauth/authorize";

        public messagesLimit = 50;
    }
}