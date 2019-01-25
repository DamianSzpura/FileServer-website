using AutoMapper;
using FileServer_website.Dtos;
using FileServer_website.Entities;

namespace FileServer_website.Helpers
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<User, UserDto>();
            CreateMap<UserDto, User>();

            CreateMap<WebFile, WebFileDto>();
            CreateMap<WebFileDto, WebFile>();
        }
    }
}