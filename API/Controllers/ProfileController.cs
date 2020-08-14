using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Profiles;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProfileController : BaseController
    {
        [HttpGet("{username}")]
        public async Task<ActionResult<Profile>> Get(string username)
        {
            return await Mediator.Send(new Details.Query{Username = username.ToLower()});
        }

        [HttpPut]
        public async Task<ActionResult<Unit>> Edit(Edit.Command command)
        {
            ///Create.Command because of the api controller attribut it helps us to map the correct header 
            return await Mediator.Send(new Edit.Command{displayName = command.displayName, bio = command.bio});
        }

        [HttpGet("{username}/activities")]
        public async Task<ActionResult<List<UserActivityDto>>> GetUserActivites(string username, string predicate)
        {
            return await Mediator.Send(new ListActivities.Query{Username = username.ToLower(), Predicate = predicate});
        }
    }
}