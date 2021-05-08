using System.Threading.Tasks;
namespace API.Interfaces
{
    public interface IUnitOfWork
    {
        IUserRepository UserRepository {get;}
        ILikeRepository LikeRepository {get;}
        IMessageRepository MessageRepository {get;}
        Task<bool> Complete();
        bool HasChanges();
    }
}