using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class Edit
    {
        public class Command : IRequest
        {
            public string displayName { get; set; }
            public string bio { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.displayName).NotEmpty();
            }
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
                var user = await _context.Users.SingleOrDefaultAsync(x =>
                x.UserName == _userAccessor.GetCurrentUsername());
                                
                user.Bio = request.bio;
                user.DisplayName = request.displayName;

                var success = await _context.SaveChangesAsync() > 0;////sav changes returns int and checks if it it success fuk

                if (success) return Unit.Value;

                throw new Exception("Problem Saving Changes");
            }
        }

    }
}