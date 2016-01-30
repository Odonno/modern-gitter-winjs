using System.Threading.Tasks;
using Windows.Data.Xml.Dom;
using Windows.UI.Notifications;
using Modern.Gitter.Services.Abstract;

namespace Modern.Gitter.Services.Concrete
{
    public class NotificationService : ILocalNotificationService
    {
        #region Fields

        protected ToastNotifier ToastNotifier = ToastNotificationManager.CreateToastNotifier();

        #endregion


        #region Methods

        public void SendNotification(string title, string content, string id = null, string group = null)
        {
            var notification = CreateToastNotification(title, content, id);
            ToastNotifier.Show(notification);
        }

        public Task ClearNotificationGroupAsync(string group)
        {
            return new Task(() => { });
        }

        private ToastNotification CreateToastNotification(string title, string content, string id = null, string group = null)
        {
            // Create notification form
            XmlDocument toastXml;

            if (string.IsNullOrWhiteSpace(title))
            {
                toastXml = ToastNotificationManager.GetTemplateContent(ToastTemplateType.ToastText01);

                var toastTextElements = toastXml.GetElementsByTagName("text");
                toastTextElements[0].AppendChild(toastXml.CreateTextNode(content));
            }
            else
            {
                toastXml = ToastNotificationManager.GetTemplateContent(ToastTemplateType.ToastText02);

                var toastTextElements = toastXml.GetElementsByTagName("text");
                toastTextElements[0].AppendChild(toastXml.CreateTextNode(title));
                toastTextElements[1].AppendChild(toastXml.CreateTextNode(content));
            }

            // Add launch parameter
            if (!string.IsNullOrWhiteSpace(id))
            {
                IXmlNode toastNode = toastXml.SelectSingleNode("/toast");
                ((XmlElement)toastNode).SetAttribute("launch", "{\"type\":\"toast\", \"id\":\"" + id + "\"}");
            }

            // Return the notification from the template
            return new ToastNotification(toastXml);
        }

        #endregion
    }
}