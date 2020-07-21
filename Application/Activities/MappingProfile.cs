using System.Linq;
using AutoMapper;
using Domain;

namespace Application.Activities
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Activity, ActivityDto>();
            ///base mapping --activity to activity dto,,,then do a submapping
            ////from activity to activitydto
            CreateMap<UserActivities, AttendeeDto>()
                    .ForMember(d => d.UserName, o => o.MapFrom(s => s.AppUser.UserName))
            ///the destinantion username should be gotten from the sources username
                    .ForMember(d => d.DisplayName , o => o.MapFrom(s => s.AppUser.DisplayName))
                    .ForMember(d => d.Image, o => o.MapFrom(s => s.AppUser.Photos.FirstOrDefault(x => x.IsMain).Url));
        }
    }
}