/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./user.ts" />

module Application.Models {
    export class PermissionChannel {
        public name: string;
        public description: string;
    }

    export class Channel {
        public id: string;
        public name: string;
        public topic: string;
    }
    
    export class NewChannel {
        public name: string;
        public permission: string;
        public owner: Owner;
    }
}