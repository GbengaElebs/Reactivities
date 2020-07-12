using System.Threading.Tasks;
using Application.User;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [AllowAnonymous]
    public class UserController : BaseController
    {
        [HttpPost("login")]
        public async Task<ActionResult<User>> Login(Login.Query query)
        {
            return await Mediator.Send(query);
        }

        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(Register.Command request)
        {
            return await Mediator.Send(request);
        }

        [HttpGet]

        public async Task<ActionResult<User>> GetCurrentUser()
        {
            return await Mediator.Send(new CurrentUser.Query());
        }

    }
}