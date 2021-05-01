using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace API.Helper
{
    public class PageList<T> : List<T>
    {
        public PageList(IEnumerable<T> items, int pageNumber, int pageSize,  int totalCount)
        {
            CurrentPage = pageNumber;
            PageSize = pageSize;
            TotalPages = (int) Math.Ceiling(totalCount/ (double) pageSize);
            TotalCount = totalCount;
            AddRange(items);
        }

        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public int TotalCount { get; set; }

        public static async Task<PageList<T>> CreateAsync(IQueryable<T> source, int pageNumber, int pageSize)
        {
            var count = await source.CountAsync();
            var items = await source.Skip((pageNumber-1)*pageSize).Take(pageSize).ToListAsync();
            return new PageList<T>(items, pageNumber, pageSize, count);
        }
    }
}