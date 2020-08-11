using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
            ///use options from the base class
        }

        public DbSet<Value> Values { get; set; }
        public DbSet<Activity> Activities { get; set; }
        public DbSet<UserActivities> UserActivities { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<UserFollowing> Followings {get; set;}

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<Value>()
                .HasData(
                    new Value { Id = 1, Name = "Value Gbenga" },
                    new Value { Id = 2, Name = "Value Joshua" },
                    new Value { Id = 3, Name = "Value Shola" }
                );

            builder.Entity<UserActivities>(x => x.HasKey(ua => 
                new { ua.AppUserId, ua.ActivityId }));
                ////has two primary keys userid and actvityid
            builder.Entity<UserActivities>()
                     .HasOne(u => u.AppUser)
                     .WithMany(a => a.UserActivities)
                     .HasForeignKey(u => u.AppUserId);
            ///one user can have many activies he is attending
            ////AppUserId is a key used to check if userid exists on app user table what it uses to check..

             builder.Entity<UserActivities>()
                     .HasOne(a => a.Activity)
                     .WithMany(u => u.UserActivities)
                     .HasForeignKey(a => a.ActivityId);
            ///one activity can be attended my many users
            ////activityid is a key used to check if activities exist on activity table what it uses to check
             builder.Entity<UserFollowing>(b => 
             {
                 b.HasKey(k => new {k.ObserverId, k.TargetId});

                 b.HasOne(o => o.Observer)
                    .WithMany(f => f.Followings)
                    .HasForeignKey(o => o.ObserverId)
                    .OnDelete(DeleteBehavior.Restrict);


                //one observer can have many people he is following

                b.HasOne(o => o.Target)
                    .WithMany(f => f.Followers)
                    .HasForeignKey(t => t.TargetId)
                    .OnDelete(DeleteBehavior.Restrict);
                //one target can have many folllowers
             });   
        }
    }
}