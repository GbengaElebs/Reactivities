using Application.Activities;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Persistence;

namespace API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;// inject configuration
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddControllers();//dependency injection container services we need to add in our application that we want available everywhere
            services.AddDbContext<DataContext>(opt => 
            {
                opt.UseSqlite(Configuration.GetConnectionString
                ("DefaultConnection"));
            });
            services.AddCors(opt => {
                opt.AddPolicy("CorsPolicy",policy => {
                    policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:3000");
                });
            });
            services.AddMediatR(typeof(List.Handler).Assembly);////add assemblies of type Handler///mediatR should target the List Handler
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            ///middle ware that we add to the pipeline

            //app.UseHttpsRedirection();////use selfsigned request routes request to https
             
            app.UseRouting();////middleware to tell application to use routing

            app.UseAuthorization();

            app.UseCors("CorsPolicy");


            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();///controller endpoints so the api knows what to do when a request comes into the api and how to routes it
            });
        }
    }
}
