/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./room.ts" />

module Application.Models {
    export class Repository {
        public id: string;
        public name: string;
        public uri: string;
        public private: boolean;
        public room: Room;
    }
}