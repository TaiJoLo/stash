using Microsoft.EntityFrameworkCore;
using Stash.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Stash.Repositories
{
    public class StockTransactionRepository : IStockTransactionRepository
    {
        private readonly StashContext _context;

        public StockTransactionRepository(StashContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<StockTransaction>> GetAllTransactionsAsync()
        {
            return await _context.StockTransactions.ToListAsync();
        }

        public async Task<IEnumerable<StockTransaction>> GetTransactionsByProductIdAsync(int productId)
        {
            var transactions = await _context.StockTransactions
                                            .Include(t => t.Stock) // Eagerly load the Stock
                                            .ThenInclude(s => s.Product) // Eagerly load the Product
                                            .Where(t => t.Stock != null && t.Stock.ProductId == productId)
                                            .ToListAsync();
            Console.WriteLine($"Fetched Transactions: {transactions}"); // Debug log
            return transactions;
        }

        public async Task AddTransactionAsync(StockTransaction transaction)
        {
            if (transaction == null)
            {
                throw new ArgumentNullException(nameof(transaction));
            }

            var stock = await GetStockByIdAsync(transaction.StockId);
            if (stock == null)
            {
                throw new InvalidOperationException("Invalid StockId");
            }

            transaction.Stock = stock; // Ensure transaction.Stock is not null

            _context.StockTransactions.Add(transaction);
            await _context.SaveChangesAsync();
        }

        private async Task<Stock?> GetStockByIdAsync(int stockId)
        {
            return await _context.Stocks.FindAsync(stockId);
        }
    }
}
