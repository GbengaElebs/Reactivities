using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Persistence;

namespace Application.Interfaces.Security
{
    public class IsHostRequirement : IAuthorizationRequirement
    {
    }

    public class IsHostRequirementHandler : AuthorizationHandler<IsHostRequirement>
    {
        private readonly DataContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public IsHostRequirementHandler(IHttpContextAccessor httpContextAccessor, DataContext context)
        {
            _httpContextAccessor = httpContextAccessor;
            _context = context;
        }
        ////we want to ensure only the host can edit or delete an activity
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirement requirement)
        {
            var currentUsername = _httpContextAccessor.HttpContext.User?.Claims?
                                .SingleOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
            
            var activityId = Guid.Parse(_httpContextAccessor.HttpContext.Request.RouteValues.
                                SingleOrDefault(x => x.Key == "id").Value.ToString());

            var activity = _context.Activities.FindAsync(activityId).Result;
            ////find the actitivy

            var host = activity.UserActivities.FirstOrDefault(x => x.IsHost);
            ///find the activity that the user is a host in

            if(host?.AppUser?.UserName == currentUsername)
                    context.Succeed(requirement);

            return Task.CompletedTask;
        }
    }
}