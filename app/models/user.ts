/// <reference path="../../typings/tsd.d.ts" />

module Application.Models {
    export class User {
        public id: string;
        public username: string;
        public displayName: string;
        public url: string;
        public avatarUrlSmall: string;
        public avatarUrlMedium: string;
    }
    
    export class Owner {
        public id: string;
        public name: string;
        public image: string;
        public org: boolean;
    }
}