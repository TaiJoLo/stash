using Microsoft.EntityFrameworkCore;
using Stash.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Stash.Repositories
{
    public class StockRepository : IStockRepository
    {
        private readonly StashContext _context;

        public StockRepository(StashContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Stock>> GetAllStocksAsync()
        {
            return await _context.Stocks.Include(s => s.Product).ToListAsync();
        }

        public async Task<Stock?> GetStockByIdAsync(int id)
        {
            return await _context.Stocks.Include(s => s.Product).FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<Stock> AddStockAsync(Stock stock)
        {
            _context.Stocks.Add(stock);
            await _context.SaveChangesAsync();
            return stock;
        }

        public async Task UpdateStockAsync(Stock stock)
        {
            _context.Entry(stock).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteStockAsync(int id)
        {
            var stock = await _context.Stocks.FindAsync(id);
            if (stock != null)
            {
                _context.Stocks.Remove(stock);
                await _context.SaveChangesAsync();
            }
        }
    }
}
