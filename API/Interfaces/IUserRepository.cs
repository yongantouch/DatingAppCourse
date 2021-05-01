using System.Collections.Generic;
using System.Threading.Tasks;
using API.Dto;
using API.Entities;
using API.Helper;

namespace API.Interfaces
{
    public interface IUserRepository
    {
        void Update(AppUser user);
        Task<bool> SaveAllAsync();
        Task<IEnumerable<AppUser>> GetUsersAsync();
        Task<AppUser> GetUserByIdAsync(int id);
        Task<AppUser> GetUserByUsernameAsync(string username);
        Task<PageList<MemberDto>> GetMembersync(UserParams userParams);
        Task<MemberDto> GeMemberByUsernameAsync(string username);
    }
}