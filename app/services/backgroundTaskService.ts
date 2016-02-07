/// <reference path="../../typings/tsd.d.ts" />

module Application.Services {
    export class BackgroundTaskService {
        // properties
        private tasks = [];
        public currentVersion: string;
        
        // constructor
        constructor(FeatureToggleService: Application.Services.FeatureToggleService) {
            this.tasks = [
                {
                    entryPoint: 'background\\unreadItemsNotifications.js',
                    name: 'unreadItemsNotifications',
                    trigger: new Windows.ApplicationModel.Background.TimeTrigger(15, false),
                    condition: new Windows.ApplicationModel.Background.SystemCondition(Windows.ApplicationModel.Background.SystemConditionType.internetAvailable)
                },
                {
                    entryPoint: 'background\\unreadMentionsNotifications.js',
                    name: 'unreadMentionsNotifications',
                    trigger: new Windows.ApplicationModel.Background.TimeTrigger(15, false),
                    condition: new Windows.ApplicationModel.Background.SystemCondition(Windows.ApplicationModel.Background.SystemConditionType.internetAvailable)
                },
                {
                    entryPoint: 'background\\notificationAction.js',
                    name: 'notificationAction',
                    trigger: new Windows.ApplicationModel.Background.ToastNotificationActionTrigger(),
                    condition: new Windows.ApplicationModel.Background.SystemCondition(Windows.ApplicationModel.Background.SystemConditionType.internetAvailable)
                }
            ];
            this.currentVersion = 'v0.6';
        }
        
        // private methods
        private register(taskEntryPoint: string, taskName: string, trigger, condition, cancelOnConditionLoss?: boolean) {
            if (this.isRegistered(taskName)) {
                console.error('task already registered...');
                return;
            }
            
            // ask to register new background task
            Windows.ApplicationModel.Background.BackgroundExecutionManager.requestAccessAsync().then(function(status) {
                if (status === Windows.ApplicationModel.Background.BackgroundAccessStatus.denied ||
                    status === Windows.ApplicationModel.Background.BackgroundAccessStatus.unspecified) {
                    console.error('task do not have access...');
                    return;
                }
                
                // create new background task
                var builder = new Windows.ApplicationModel.Background.BackgroundTaskBuilder();

                builder.name = taskName;
                builder.taskEntryPoint = taskEntryPoint;
                builder.setTrigger(trigger);

                if (condition) {
                    builder.addCondition(condition);

                    if (cancelOnConditionLoss) {
                        // if the condition changes while the background task is executing then it will be canceled
                        builder.cancelOnConditionLoss = cancelOnConditionLoss;
                    }
                }

                // register the new background task
                var task = builder.register();
            });
        }

        private unregister(taskName: string) {
            // loop through all background tasks and search for the one to unregister
            var iteration = Windows.ApplicationModel.Background.BackgroundTaskRegistration.allTasks.first();
            var hasCurrent = iteration.hasCurrent;
            while (hasCurrent) {
                var current = iteration.current.value;
                if (current.name === taskName) {
                    current.unregister(true);
                }
                hasCurrent = iteration.moveNext();
            }
        }
        
        // public methods
        public registerAll() {
            for (var i = 0; i < this.tasks.length; i++) {
                this.register(this.tasks[i].entryPoint, this.tasks[i].name, this.tasks[i].trigger, this.tasks[i].condition);
            }
        }

        public unregisterAll() {
            for (var i = 0; i < this.tasks.length; i++) {
                this.unregister(this.tasks[i].name);
            }
        }

        public isRegistered(taskName: string) {
            var taskRegistered = false;
            var iteration = Windows.ApplicationModel.Background.BackgroundTaskRegistration.allTasks.first();

            while (iteration.hasCurrent) {
                var task = iteration.current.value;

                if (task.name === taskName) {
                    taskRegistered = true;
                    break;
                }

                iteration.moveNext();
            }
        }
    }
}