using chat_HTTP_server.Model;

namespace chat_HTTP_server.Mapper;

public static class UserConverte
{
    public static UserDto ConvertUserToUserDto(this User user)
    {
        var userDto = new UserDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName
        };

        return userDto;
    }
}