using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces.Security
{
    public class UserAccessor : IUserAccessor
    {
        private readonly IHttpContextAccessor _httpContextAccesspr;
        public UserAccessor(IHttpContextAccessor httpContextAccesspr)
        {
            _httpContextAccesspr = httpContextAccesspr;

        }
        public string GetCurrentUsername()
        {
            var userName = _httpContextAccesspr.HttpContext.User?.Claims?.FirstOrDefault(x =>
            x.Type == ClaimTypes.NameIdentifier)?.Value;

            return userName;
        }
    }
}