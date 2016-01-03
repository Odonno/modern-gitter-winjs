/// <reference path="../../typings/tsd.d.ts" />

angular.module('modern-gitter')
    .service('ConfigService', function () {
        var configService = this;

        configService.baseUrl = "https://api.gitter.im/v1/";
        configService.tokenUri = "https://gitter.im/login/oauth/token";
        configService.clientId = "0f3fc414587a8d31a1514e005fa157168ad8efdb";
        configService.clientSecret = "55c361ef1de79ffef1a49a1a0bff1a7a0140799c";
        configService.redirectUri = "http://localhost";
        configService.authUri = "https://gitter.im/login/oauth/authorize";

        configService.messagesLimit = 50;

        return configService;
    });