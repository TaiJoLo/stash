using Microsoft.AspNetCore.Mvc;
using Stash.Models;
using Stash.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Stash.Controllers
{
    [Route("api/stocks")]
    [ApiController]
    public class StockController : ControllerBase
    {
        private readonly IStockRepository _stockRepository;

        public StockController(IStockRepository stockRepository)
        {
            _stockRepository = stockRepository;
        }

        // GET: api/stocks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Stock>>> GetStocks()
        {
            var stocks = await _stockRepository.GetAllStocksAsync();
            return Ok(stocks);
        }

        // GET: api/stocks/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Stock>> GetStock(int id)
        {
            var stock = await _stockRepository.GetStockByIdAsync(id);
            if (stock == null)
            {
                return NotFound();
            }
            return Ok(stock);
        }

        // POST: api/stocks
        [HttpPost]
        public async Task<ActionResult<Stock>> PostStock(Stock stock)
        {
            await _stockRepository.AddStockAsync(stock);
            return CreatedAtAction(nameof(GetStock), new { id = stock.Id }, stock);
        }

        // PUT: api/stocks/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStock(int id, Stock stock)
        {
            if (id != stock.Id)
            {
                return BadRequest();
            }

            var existingStock = await _stockRepository.GetStockByIdAsync(id);
            if (existingStock == null)
            {
                return NotFound();
            }

            await _stockRepository.UpdateStockAsync(stock);
            return NoContent();
        }

        // DELETE: api/stocks/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStock(int id)
        {
            var stock = await _stockRepository.GetStockByIdAsync(id);
            if (stock == null)
            {
                return NotFound();
            }

            await _stockRepository.DeleteStockAsync(id);
            return NoContent();
        }
    }
}
