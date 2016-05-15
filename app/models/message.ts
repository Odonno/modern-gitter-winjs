/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./user.ts" />

module Application.Models {
    export class Message {
        public id: string;
        public text: string;
        public html: string;
        public sent: Date;
        public editedAt: Date;
        public fromUser: User;
        public unread: boolean;
        public readBy: number;
        public urls: string[];
        public mentions: Mention[];
        public issues: Issue[];
        public meta: any;
    }
    
    export class Mention {
        public screenName: string;
        public userId: string;
    }
    
    export class Issue {
        public number: number;
    }
    
    export enum MessageOperation {
        Created = 1,
        Updated,
        Deleted,
        ReadBy
    }
}