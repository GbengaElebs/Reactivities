using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Edit
    {

        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public string Title { get; set; }
            public string Description { get; set; }
            public string Category { get; set; }
            public DateTime? DateTime { get; set; } ////specify that it is optional
            public string City { get; set; }
            public string Venue { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(Command request,
            CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.Id);

                if (activity == null)
                    throw new Exception("Could Not find Activity");

                activity.Title = request.Title ?? activity.Title;
                activity.Description = request.Description ?? activity.Description;
                activity.Category = request.Category ?? activity.Category;
                activity.DateTime = request.DateTime ?? activity.DateTime;
                activity.City = request.City ?? activity.City;
                activity.Venue = request.Venue ?? activity.Venue;

                var success = await _context.SaveChangesAsync() > 0;////sav changes returns int and checks if it it success fuk

                if (success) return Unit.Value;

                throw new Exception("Problem Saving Changes");
            }
        }
    }
}