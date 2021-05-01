using System;
using System.Security.Claims;

namespace API.Extensions
{
    public static class ClaimsPrincipalExtension
    {
        public static string GetUsername(this ClaimsPrincipal user)
        {
            return user?.FindFirstValue(ClaimTypes.Name);
        }
        public static int GetUserId(this ClaimsPrincipal user)
        {
            return Convert.ToInt32(user?.FindFirstValue(ClaimTypes.NameIdentifier));
        }
    }
}