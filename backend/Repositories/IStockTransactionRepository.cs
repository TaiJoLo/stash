using System.Collections.Generic;
using System.Threading.Tasks;
using Stash.Models;

namespace Stash.Repositories
{
    public interface IStockTransactionRepository
    {
        Task<IEnumerable<StockTransaction>> GetAllTransactionsAsync();
        Task<IEnumerable<StockTransaction>> GetTransactionsByProductIdAsync(int productId);
        Task AddTransactionAsync(StockTransaction transaction);
    }
}
