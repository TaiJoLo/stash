using System.Collections.Generic;
using System.Threading.Tasks;
using Stash.Models;

namespace Stash.Repositories
{
    public interface IParentProductRepository
    {
        Task<IEnumerable<ParentProduct>> GetAllParentProductsAsync();
        Task<ParentProduct> GetParentProductByIdAsync(int id);
        Task<ParentProduct> AddParentProductAsync(ParentProduct parentProduct);
        Task UpdateParentProductAsync(ParentProduct parentProduct);
        Task DeleteParentProductAsync(int id);
    }
}
