using System.Linq;
using Windows.Storage;
using Modern.Gitter.Services.Abstract;

namespace Modern.Gitter.Services.Concrete
{
    public class ApplicationStorageService : IApplicationStorageService
    {
        public object Retrieve(string key)
        {
            return ApplicationData.Current.LocalSettings.Values[key];
        }

        public void Save(string key, object value)
        {
            ApplicationData.Current.LocalSettings.Values[key] = value;
        }

        public bool Exists(string key)
        {
            return ApplicationData.Current.LocalSettings.Values.Any(setting => setting.Key == key);
        }

        public void Remove(string key)
        {
            ApplicationData.Current.LocalSettings.Values.Remove(key);
        }
    }
}
