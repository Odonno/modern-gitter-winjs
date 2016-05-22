/// <reference path="../typings/tsd.d.ts" />

abstract class BackgroundTask {
    // properties
    protected cancel: boolean;
    protected cancelReason: any;
    protected backgroundTaskInstance: any;
    protected settings = Windows.Storage.ApplicationData.current.localSettings;

    constructor() {
        this.backgroundTaskInstance = Windows.UI.WebUI.WebUIBackgroundTaskInstance.current;
        this.backgroundTaskInstance.addEventListener("canceled", this.oncanceled);
    }

    // public methods
    public abstract canExecute(): boolean;
    public abstract execute();

    // private methods (background task instance)
    protected oncanceled(cancelEventArg) {
        this.cancel = true;
        this.cancelReason = cancelEventArg;
    }

    protected onclose(reason: string) {
        // record information in LocalSettings to communicate with the app
        let key = this.backgroundTaskInstance.task.taskId.toString();
        this.settings.values[key] = reason;

        // background task must call close when it is done
        close();
    }

    // private methods (others)
    protected retrieveTokenFromVault(): string {
        let passwordVault = new Windows.Security.Credentials.PasswordVault();
        let storedToken;

        try {
            let credential = passwordVault.retrieve("OauthToken", "CurrentUser");
            storedToken = credential.password;
        } catch (e) {
            // no stored credentials
        }

        return storedToken;
    }
}

class NotificationActionTask extends BackgroundTask {
    // properties
    private token: string;

    // public methods
    public canExecute(): boolean {
        if (this.cancel) {
            this.onclose("Canceled");
            return false;
        }

        // you need to be authenticated first to use Gitter API
        this.token = this.retrieveTokenFromVault();

        if (!this.token) {
            this.onclose("Failed");
            return false;
        }
        
        return true;
    }

    public execute() {
        if (!this.canExecute()) {
            return;
        }

        let details = this.backgroundTaskInstance.triggerDetails;
        if (details) {
            let args = details.argument;
            let userInput = details.userInput;

            // retrieve room id and text message
            let roomId: string = this.getQueryValue(args, 'roomId');
            let text: string = userInput['message'];

            // send the message
            this.sendMessage(roomId, text)
                .then(success => {
                    this.onclose("Succeeded");
                });
        }
    }

    // private methods
    private getQueryValue(query: string, key: string) {
        let vars = query.split('&');
        for (let i = 0; i < vars.length; i++) {
            let pair = vars[i].split('=');
            if (pair[0] == key) {
                return pair[1];
            }
        }
    }

    private sendMessage(roomId: string, text: string) {
        return WinJS.xhr({
            type: 'POST',
            url: "https://api.gitter.im/v1/rooms/" + roomId + "/chatMessages",
            data: JSON.stringify({ text: text }),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this.token
            }
        })
    }
}

// import WinJS
importScripts("/dist/winjs/js/base.js");

// execute background task
let backgroundTask = new NotificationActionTask();
backgroundTask.execute();