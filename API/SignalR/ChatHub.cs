using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using MediatR;
using Application.Comments;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class ChatHub : Hub
    {
        private readonly IMediator _mediator;
        public ChatHub(IMediator mediator)
        {
            _mediator = mediator;

        }

        public async Task SendComment(Create.Command command)
        {
            string username = GetUserName();

            command.UserName = username;

            var comment = await _mediator.Send(command);

            await Clients.Group(command.ActivityId.ToString()).SendAsync("ReceiveComment", comment);

        }

        private string GetUserName()
        {
            return Context.User?.Claims?.FirstOrDefault(x => x.Type ==
                        ClaimTypes.NameIdentifier)?.Value;
        }

        public async Task AddToGroup(string groupName)
        {
            string username = GetUserName();

            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            await Clients.Group(groupName).SendAsync("Send", $"{username} has joined the group");
        }

        public async Task RemoveFromGroup(string groupName)
        {
            string username = GetUserName();

            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);

            await Clients.Group(groupName).SendAsync("Send", $"{username} has left the group");
        }
    }
}