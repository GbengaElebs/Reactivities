using System;
using Domain;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext: DbContext
    {
        public DataContext(DbContextOptions options): base(options)
        {
            ///use options from the base class
        }

        public DbSet<Value> Values { get; set;}


        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Value>()
                .HasData(
                    new Value {Id=1, Name = "Value Gbenga"},
                    new Value {Id=2, Name = "Value Joshua"},
                    new Value {Id=3, Name = "Value Shola"}
                );
        }
    }
}
