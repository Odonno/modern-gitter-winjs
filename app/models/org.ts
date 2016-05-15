/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./room.ts" />

module Application.Models {
    export class Org {
        public id: string;
        public name: string;
        public avatar_url: string;
        public room: Room;
    }
}