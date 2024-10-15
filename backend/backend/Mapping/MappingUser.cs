using AutoMapper;
using backend.DTOs;
using backend.Model;

public class MappingUser : Profile
{
    public MappingUser()
    {
        CreateMap<User, UserDTO>();
        CreateMap<UserDTO, User>();
    }
}
