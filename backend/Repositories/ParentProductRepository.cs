using Microsoft.EntityFrameworkCore;
using Stash.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Stash.Repositories
{
    public class ParentProductRepository : IParentProductRepository
    {
        private readonly StashContext _context;

        public ParentProductRepository(StashContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ParentProduct>> GetAllParentProductsAsync()
        {
            return await _context.ParentProducts.ToListAsync();
        }

        public async Task<ParentProduct> GetParentProductByIdAsync(int id)
        {
            return await _context.ParentProducts.FindAsync(id);
        }

        public async Task<ParentProduct> AddParentProductAsync(ParentProduct parentProduct)
        {
            _context.ParentProducts.Add(parentProduct);
            await _context.SaveChangesAsync();
            return parentProduct;
        }

        public async Task UpdateParentProductAsync(ParentProduct parentProduct)
        {
            _context.Entry(parentProduct).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteParentProductAsync(int id)
        {
            var parentProduct = await _context.ParentProducts.FindAsync(id);
            if (parentProduct != null)
            {
                _context.ParentProducts.Remove(parentProduct);
                await _context.SaveChangesAsync();
            }
        }
    }
}
