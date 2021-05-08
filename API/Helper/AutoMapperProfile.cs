using System;
using System.Linq;
using API.Dto;
using API.Entities;
using AutoMapper;

namespace API.Helper
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<AppUser, MemberDto>()
            .ForMember(dest => dest.PhotoUrl, 
                opt => opt.MapFrom(src => src.Photos.FirstOrDefault(x => x.IsMain).Url));
            CreateMap<Photo, PhotoDto>();
            CreateMap<MemberUpdateDto, AppUser>();
            CreateMap<RegisterDto, AppUser>();
            CreateMap<Message,MessageDto>()
            .ForMember(dest => dest.SenderPhotoUrl,
                opt => opt.MapFrom(o => o.Sender.Photos.FirstOrDefault(p => p.IsMain).Url))
            .ForMember(dest => dest.RecipientPhotoUrl,
                opt => opt.MapFrom(o => o.Recipient.Photos.FirstOrDefault(p => p.IsMain).Url));
            CreateMap<DateTime, DateTime>().ConvertUsing(d => DateTime.SpecifyKind(d,DateTimeKind.Utc));
        }
    }
}