using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class AppUser : IdentityUser
    {
       public string DisplayName { get; set; }
       public virtual ICollection<UserActivities> UserActivities { get; set; }
       //one user has many activites
    }
}