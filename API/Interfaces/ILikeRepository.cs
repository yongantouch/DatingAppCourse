using System.Collections.Generic;
using System.Threading.Tasks;
using API.Dto;
using API.Entities;
using API.Helper;

namespace API.Interfaces
{
    public interface ILikeRepository
    {
        Task<UserLike> GetUserLike(int sourceUserId, int likedUserId);
        Task<AppUser> GetUserWithLike(int userId);
        Task<PageList<LikeDto>> GetUserLikes(LikeParams likeParams);
    }
}