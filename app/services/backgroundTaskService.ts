/// <reference path="../../typings/tsd.d.ts" />

module Application.Services {
    export class BackgroundTaskService {
        // properties
        private tasks = [];
        public currentVersion: string;
        
        // constructor
        constructor(FeatureToggleService: Application.Services.FeatureToggleService) {
            if (FeatureToggleService.isJsBackgroundTasks()) {
                this.tasks = [
                    {
                        entryPoint: 'background\\unreadItemsNotifications.js',
                        name: 'unreadItemsNotifications'
                    },
                    {
                        entryPoint: 'background\\unreadMentionsNotifications.js',
                        name: 'unreadMentionsNotifications'
                    }
                ];
                this.currentVersion = 'v0.2-js';
            } else {
                this.tasks = [
                    {
                        entryPoint: 'modern_gitter_tasks.UnreadItemsNotificationsBackgroundTask',
                        name: 'UnreadItemsNotificationsBackgroundTask'
                    },
                    {
                        entryPoint: 'modern_gitter_tasks.UnreadMentionsNotificationsBackgroundTask',
                        name: 'UnreadMentionsNotificationsBackgroundTask'
                    }
                ];
                this.currentVersion = 'v0.1';
            }
        }
        
        // private methods
        private register(taskEntryPoint: string, taskName: string, trigger, condition, cancelOnConditionLoss?: boolean) {
            if (this.isRegistered(taskName)) {
                return;
            }
            
            // ask to register new background task
            Windows.ApplicationModel.Background.BackgroundExecutionManager.requestAccessAsync();

            // create new background task
            var builder = new Windows.ApplicationModel.Background.BackgroundTaskBuilder();

            builder.name = taskName;
            builder.taskEntryPoint = taskEntryPoint;
            builder.setTrigger(trigger);

            if (condition !== null) {
                builder.addCondition(condition);

                if (cancelOnConditionLoss) {
                    // if the condition changes while the background task is executing then it will be canceled
                    builder.cancelOnConditionLoss = cancelOnConditionLoss;
                }
            }

            // register the new background task
            var task = builder.register();
        };

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
                var entryPoint = this.tasks[i].entryPoint;
                var taskName = this.tasks[i].name;
                var trigger = new Windows.ApplicationModel.Background.TimeTrigger(15, false);
                var condition = new Windows.ApplicationModel.Background.SystemCondition(Windows.ApplicationModel.Background.SystemConditionType.internetAvailable);

                this.register(entryPoint, taskName, trigger, condition);
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