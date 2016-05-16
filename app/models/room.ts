/// <reference path="../../typings/tsd.d.ts" />

module Application.Models {
    export class Room {
        public id: string;
        public name: string;
        public topic: string;
        public uri: string;
        public oneToOne: boolean;

        /**
         * Other user in one to one room
         */
        public user: User;

        /**
         * All users in the room
         */
        public users: User[];

        public userCount: number;
        public unreadItems: number;
        public mentions: number;
        public lastAccessTime: Date;
        public favourite: number;
        public lurk: boolean;
        public url: string;
        public githubType: string;
        public tags: string[];

        private _image: string;
        /**
         * Image created based on room/user info
         */
        get image(): string {
            return this._image;
        }
        set image(value: string){
            this._image = value;
        }
    }
}