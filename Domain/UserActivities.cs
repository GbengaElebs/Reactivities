using System;

namespace Domain
{
    ///join the activities and users together
    public class UserActivities
    {
        public string AppUserId { get; set; }
        public virtual AppUser AppUser{ get; set; }
        public Guid ActivityId { get; set; }
        public virtual Activity Activity { get; set; }
        public DateTime DateJoined { get; set; }
        public bool IsHost { get; set; }
    }
}