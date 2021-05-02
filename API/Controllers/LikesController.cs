using System.Collections.Generic;
using System.Threading.Tasks;
using API.Dto;
using API.Entities;
using API.Extensions;
using API.Helper;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class LikesController : BaseApiController
    {
        private readonly ILikeRepository _likeRepository;
        private readonly IUserRepository _userRepository;
        public LikesController(IUserRepository userRepository, ILikeRepository likeRepository)
        {
            _userRepository = userRepository;
            _likeRepository = likeRepository;
        }

        [HttpPost("{username}")]
        public async Task<ActionResult> AddLike(string username)
        {
            var sourceUserId = User.GetUserId();
            var likedUser = await _userRepository.GetUserByUsernameAsync(username);
            var sourceUser = await _likeRepository.GetUserWithLike(sourceUserId);

            if(likedUser == null) return NotFound();

            if(sourceUser.UserName == username) return BadRequest("You cannot like yourself.");

            var userLike = await _likeRepository.GetUserLike(sourceUserId, likedUser.Id);

            if(userLike != null) return BadRequest("You already like this user.");

            userLike = new UserLike
            {
                SourceUserId = sourceUserId,
                LikedUserId = likedUser.Id
            };

            sourceUser.LikedUsers.Add(userLike);

            if(await _userRepository.SaveAllAsync()) return Ok();

            return BadRequest("Failed to like user.");
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<LikeDto>>> GetUserLikes([FromQuery]LikeParams likeParams)
        {
            likeParams.UserId = User.GetUserId();

            var users = await _likeRepository.GetUserLikes(likeParams);

            Response.AddPaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);

            return Ok(users);
        }
    }
}