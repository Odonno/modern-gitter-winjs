using Modern.Gitter.Services.Abstract;
using Modern.Gitter.Services.Concrete;
using GitterSharp.Model;
using GitterSharp.Services;
using System;
using System.Linq;
using System.Threading.Tasks;
using Windows.ApplicationModel.Background;
using Windows.Security.Credentials;

namespace modern_gitter_tasks
{
    public sealed class UnreadItemsNotificationsBackgroundTask : IBackgroundTask
    {
        #region Fields

        private BackgroundTaskDeferral _deferral;

        #endregion


        #region Services

        private readonly ILocalNotificationService _localNotificationService;
        private readonly IGitterApiService _gitterApiService;
        private readonly IApplicationStorageService _applicationStorageService;

        #endregion


        #region Constructor

        public UnreadItemsNotificationsBackgroundTask()
        {
            _localNotificationService = new NotificationService();
            _gitterApiService = new GitterApiService();
            _applicationStorageService = new ApplicationStorageService();
        }

        #endregion


        #region Methods

        public async void Run(IBackgroundTaskInstance taskInstance)
        {
            _deferral = taskInstance.GetDeferral();
            await Do();
        }

        private async Task Do()
        {
            try
            {
                // You need to be authenticated first to get current notifications
                _gitterApiService.Token = RetrieveTokenFromVault();

                // Retrieve rooms that user want notifications
                var notifyableRooms = (await _gitterApiService.GetRoomsAsync()).Where(room => !room.DisabledNotifications);

                // Add notifications for unread messages
                foreach (var room in notifyableRooms)
                {
                    // Show notifications (if possible)
                    CreateNotification(room);
                }
            }
            finally
            {
                _deferral.Complete();
            }
        }

        private string RetrieveTokenFromVault()
        {
            var passwordVault = new PasswordVault();
            string storedToken = null;

            try
            {
                var credential = passwordVault.Retrieve("OauthToken", "CurrentUser");
                storedToken = credential.Password;
            }
            catch (Exception e)
            {
                // No stored credentials
            }

            return storedToken;
        }

        private void CreateNotification(Room room)
        {
            string id = room.Name;

            // Detect if there is no new notification to launch (no unread messages)
            if (_applicationStorageService.Exists(id))
            {
                // Reset notification id for the future
                if (room.UnreadItems == 0)
                    _applicationStorageService.Remove(id);

                return;
            }

            if (room.UnreadItems > 0)
            {
                // Show notifications (toast notifications)
                _localNotificationService.SendNotification("New messages", $"{room.Name}: {room.UnreadItems} unread messages", id, room.Name);
                _applicationStorageService.Save(id, room.UnreadItems);
            }
        }

        #endregion
    }
}
