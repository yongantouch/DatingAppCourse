using System.Text.Json;
using API.Helper;
using Microsoft.AspNetCore.Http;

namespace API.Extensions
{
    public static class HttpExtension
    {
        public static void AddPaginationHeader(this HttpResponse response, int pageNumber,
            int itemPerPage, int totalItems, int totalPages)
        {
            var paginationHeader = new PaginationHeader(pageNumber, itemPerPage, totalPages, totalItems);
            var options = new JsonSerializerOptions 
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };
            response.Headers.Add("Pagination", JsonSerializer.Serialize(paginationHeader,options));
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        }
    }
}