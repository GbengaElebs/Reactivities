using System.Linq;
using Application.Interfaces;
using AutoMapper;
using Domain;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class FollowingResolver : IValueResolver<UserActivities, AttendeeDto, bool>
    {
        private readonly IUserAccessor _userAccessor;
        private readonly DataContext _context;
        public FollowingResolver(DataContext context, IUserAccessor userAccessor)
        {
            _context = context;
            _userAccessor = userAccessor;

        }
        public bool Resolve(UserActivities source, AttendeeDto destination, bool destMember, ResolutionContext context)
        {
            var currentUser = _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername()).Result;
            if(currentUser.Followings.Any(x => x.TargetId == source.AppUserId))
                    return true;

            return false;
        }
    }
}