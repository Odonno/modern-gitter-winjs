using Modern.Gitter.Services.Abstract;
using Modern.Gitter.Services.Concrete;
using GitterSharp.Model;
using GitterSharp.Services;
using System.Linq;
using System.Threading.Tasks;
using Windows.ApplicationModel.Background;
using Windows.Security.Credentials;
using System;

namespace modern_gitter_tasks
{
    public sealed class UnreadMentionsNotificationsBackgroundTask : IBackgroundTask
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

        public UnreadMentionsNotificationsBackgroundTask()
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

                // Retrieve user id of current user
                string userId = await RetrieveUserIdAsync(_gitterApiService.Token);

                // Add notifications for unread messages
                foreach (var room in notifyableRooms)
                {
                    // Show notifications (if possible)
                    await CreateNotificationAsync(userId, room);
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

        private async Task<string> RetrieveUserIdAsync(string token)
        {
            // Retrieve current user
            var currentUser = await _gitterApiService.GetCurrentUserAsync();
            return currentUser.Id;
        }

        private async Task CreateNotificationAsync(string userId, Room room)
        {
            // Retrieve id of messages that contains a mention
            var unreadItems = await _gitterApiService.RetrieveUnreadChatMessagesAsync(userId, room.Id);

            // Retrieve each message that contains mentions
            foreach (string mention in unreadItems.Mentions)
            {
                var message = await _gitterApiService.GetSingleRoomMessageAsync(room.Id, mention);

                string id = $"{room.Name}_mention_{message.Id}";
                if (!_applicationStorageService.Exists(id))
                {
                    // Show notifications (toast notifications)
                    _localNotificationService.SendNotification($"{message.User.Username} mentioned you", message.Text, id, room.Name);
                    _applicationStorageService.Save(id, room.UnreadMentions);
                }
            }
        }

        #endregion
    }
}
