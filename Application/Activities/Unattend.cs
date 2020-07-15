using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class Unattend
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Unit> Handle(Command request,
            CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.Id);
                if(activity == null)
                    throw new RestException(HttpStatusCode.NotFound, 
                                new {Activity = "Could Not find Activity"});

                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName ==
                                 _userAccessor.GetCurrentUsername());
                
                var attending = await _context.UserActivities.SingleOrDefaultAsync(x => x.AppUserId == user.Id 
                                        && x.ActivityId == activity.Id );
                if(attending == null)
                    return Unit.Value;
                if(attending.IsHost)
                    throw new RestException(HttpStatusCode.BadRequest, new {Attendance ="You cannot remove yourself as host"});

                _context.UserActivities.Remove(attending);
                ////logic for your handler
                var success = await _context.SaveChangesAsync() > 0;////sav changes returns int and checks if it it success fuk

                if (success) return Unit.Value;

                throw new Exception("Problem Saving Changes");
            }
        }
    }
}