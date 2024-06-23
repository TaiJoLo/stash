using System.Collections.Generic;
using System.Threading.Tasks;
using Models; 

namespace Repositories
{
    public interface ITodoItemRepository
    {
        Task<IEnumerable<TodoItem>> GetAllAsync();
        Task<TodoItem?> GetByIdAsync(long id);  // Ensure this matches the implementation
        Task AddAsync(TodoItem item);
        Task UpdateAsync(TodoItem item);
        Task DeleteAsync(long id);
        bool Exists(long id);
    }
}
