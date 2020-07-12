using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext: IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options): base(options)
        {
            ///use options from the base class
        }

        public DbSet<Value> Values { get; set;}
        public DbSet<Activity> Activities {get; set;}


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<Value>()
                .HasData(
                    new Value {Id=1, Name = "Value Gbenga"},
                    new Value {Id=2, Name = "Value Joshua"},
                    new Value {Id=3, Name = "Value Shola"}
                );
        }
    }
}
