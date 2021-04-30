using System.Security.Claims;
using System.Net;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using API.Interfaces;
using AutoMapper;
using API.Dto;
using API.Extensions;
using Microsoft.AspNetCore.Http;

namespace API.Controllers
{
    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;
        public UsersController(IUserRepository userRepository,
                               IMapper mapper,
                               IPhotoService photoService)
        {
            _photoService = photoService;
            _mapper = mapper;
            _userRepository = userRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
        {
            return Ok(await _userRepository.GetMembersync());
        }
        [HttpGet("{username}")]
        public async Task<ActionResult<MemberDto>> GetUsers(string username)
        {
            return await _userRepository.GeMemberByUsernameAsync(username);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateMember(MemberUpdateDto memberUpdateDto)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
            _mapper.Map(memberUpdateDto, user);

            _userRepository.Update(user);

            if (await _userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to update user.");
        }

        [HttpPost("add-photo", Name="GetUser")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
        {
            var username = User.GetUsername();
            var user = await _userRepository.GetUserByUsernameAsync(username);

            var result = await _photoService.AddPhotoAsyn(file);
            if(result.Error != null) return BadRequest(result.Error.Message);

            var photo = new Photo 
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            if(user.Photos.Count == 0)
            {
                photo.IsMain = true;
            }

            user.Photos.Add(photo);

            if(await _userRepository.SaveAllAsync()) 
            {
                return CreatedAtRoute("GetUser", new { username = user.UserName}, _mapper.Map<PhotoDto>(photo));
            }
            return BadRequest("Problem adding photo");
        }

        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);

            if(photo.IsMain) return BadRequest("This is already your main photo");

            var currentMain = user.Photos.FirstOrDefault(x => x.IsMain == true);
            if(currentMain != null) currentMain.IsMain = false;

            photo.IsMain = true;

            if(await _userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to set main photo");
        }
        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DetelePhoto(int photoId)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
            var deletePhoto = user.Photos.FirstOrDefault(p => p.Id == photoId);

            if(deletePhoto.IsMain) return BadRequest("You cannot delete your main photo");

            if(deletePhoto.PublicId != null) 
            {
                var deleteResult = await _photoService.DeletePhotoAsync(deletePhoto.PublicId);
                if(deleteResult.Error !=null ) return BadRequest(deleteResult.Error.Message);
            }

            user.Photos.Remove(deletePhoto);
            if(await _userRepository.SaveAllAsync()) return Ok();
            
            return BadRequest("Failed to delete photo");
        }
    }
}