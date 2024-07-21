using Stash.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Stash.Repositories
{
    public interface IStockRepository
    {
        Task<IEnumerable<Stock>> GetAllStocksAsync();
        Task<Stock?> GetStockByIdAsync(int id);
        Task<Stock> AddStockAsync(Stock stock);
        Task UpdateStockAsync(Stock stock);
        Task DeleteStockAsync(int id);
        Task<Location?> GetLocationByIdAsync(int id); 
    }
}
