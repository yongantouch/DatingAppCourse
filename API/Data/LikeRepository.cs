using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Dto;
using API.Entities;
using API.Extensions;
using API.Helper;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class LikeRepository : ILikeRepository
    {
        private readonly DataContext _context;
        public LikeRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<UserLike> GetUserLike(int sourceUserId, int likedUserId)
        {
            return await _context.Likes.FindAsync(sourceUserId, likedUserId);
        }

        public async Task<PageList<LikeDto>> GetUserLikes(LikeParams likeParams)
        {
            var users = _context.Users.OrderBy(u => u.UserName).AsQueryable();
            var likes = _context.Likes.AsQueryable();

            if(likeParams.Predicate == "liked")
            {
                likes = likes.Where(like => like.SourceUserId == likeParams.UserId);
                users = likes.Select(like => like.LikedUser);
            }

            if(likeParams.Predicate == "likedBy")
            {
                likes = likes.Where(like => like.LikedUserId == likeParams.UserId);
                users = likes.Select(like => like.SourceUser);
            }

            var userLike = users.Select(user => new LikeDto
                {
                    Username = user.UserName,
                    KnownAs = user.KnownAs,
                    Age = user.DateOfBirth.CalculateAge(),
                    Id = user.Id,
                    PhotoUrl = user.Photos.FirstOrDefault(p => p.IsMain == true).Url,
                    City = user.City
                });
            
            return await PageList<LikeDto>.CreateAsync(userLike,likeParams.PageNumber, likeParams.PageSize);
        }

        public async Task<AppUser> GetUserWithLike(int userId)
        {
            return await _context.Users
                        .Include(l => l.LikedUsers)
                        .FirstOrDefaultAsync(u => u.Id == userId);
        }
    }
}