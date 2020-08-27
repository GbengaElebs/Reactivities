using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Application.User;
using Interfaces.Security;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace Application.Interfaces.Security
{
    public class FaceBookAccessor : IFaceBookAcessor
    {
        private readonly HttpClient _httpclient;
        private readonly IOptions<FaceBookAppSettings> _config;
        public FaceBookAccessor(IOptions<FaceBookAppSettings> config)
        {
            _config = config;
            _httpclient = new HttpClient {
                BaseAddress = new System.Uri("https://graph.facebook.com")
            };
            _httpclient.DefaultRequestHeaders
                .Accept
                .Add(new MediaTypeWithQualityHeaderValue("application/json"));
        }

        public async Task<FaceBookUserInfo> FaceBookLogin(string accessToken)
        {
            var verifyToken = await _httpclient.GetAsync($"debug_token?input_token={accessToken}&access_token={_config.Value.AppId}|{_config.Value.AppSecret}");
            if(!verifyToken.IsSuccessStatusCode)
                return null;
            
            var result = await GetAsync<FaceBookUserInfo>(accessToken, "me","fields=name, email,picture.width(100).height(100)");

            return result;
        }

        public async Task<T> GetAsync<T>(string accessToken, string endpoint, string args)
        {
            var response = await _httpclient.GetAsync($"{endpoint}?access_token={accessToken}&{args}");

            if(!response.IsSuccessStatusCode)
                return default(T);

            var result = await response.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<T>(result);
        }
    }
}