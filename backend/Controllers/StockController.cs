using Microsoft.AspNetCore.Mvc;
using Stash.Models;
using Stash.Repositories;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Stash.Controllers
{
    [Route("api/stocks")]
    [ApiController]
    public class StockController : ControllerBase
    {
        private readonly IStockRepository _stockRepository;
        private readonly IProductRepository _productRepository;

        public StockController(IStockRepository stockRepository, IProductRepository productRepository)
        {
            _stockRepository = stockRepository;
            _productRepository = productRepository;
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
            var product = await _productRepository.GetProductByIdAsync(stock.ProductId);
            if (product == null)
            {
                return BadRequest("Invalid ProductId");
            }

            var location = await _stockRepository.GetLocationByIdAsync(stock.LocationId);
            if (location == null)
            {
                return BadRequest("Invalid LocationId");
            }

            stock.Product = product;
            stock.Location = location;

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

            var product = await _productRepository.GetProductByIdAsync(stock.ProductId);
            if (product == null)
            {
                return BadRequest("Invalid ProductId");
            }

            var location = await _stockRepository.GetLocationByIdAsync(stock.LocationId);
            if (location == null)
            {
                return BadRequest("Invalid LocationId");
            }

            existingStock.ProductId = stock.ProductId;
            existingStock.LocationId = stock.LocationId;
            existingStock.Amount = stock.Amount;
            existingStock.PurchaseDate = stock.PurchaseDate;
            existingStock.DueDate = stock.DueDate;
            existingStock.UnitPrice = stock.UnitPrice;
            existingStock.Product = product;
            existingStock.Location = location;

            await _stockRepository.UpdateStockAsync(existingStock);
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

        // POST: api/stocks/consume-stock/{productId}
        [HttpPost("consume-stock/{productId}")]
        public async Task<IActionResult> ConsumeStock(int productId, [FromBody] int amount)
        {
            var stocks = await _stockRepository.GetAllStocksAsync();
            var productStocks = stocks
                .Where(s => s.ProductId == productId && s.Amount > 0)
                .OrderBy(s => s.DueDate ?? System.DateTime.MaxValue)
                .ThenBy(s => s.PurchaseDate)
                .ToList();

            int remainingAmount = amount;
            foreach (var stock in productStocks)
            {
                if (remainingAmount <= 0)
                    break;

                if (stock.Amount > remainingAmount)
                {
                    stock.Amount -= remainingAmount;
                    remainingAmount = 0;
                }
                else
                {
                    remainingAmount -= stock.Amount;
                    stock.Amount = 0;
                }

                await _stockRepository.UpdateStockAsync(stock);
            }

            if (remainingAmount > 0)
            {
                return BadRequest("Not enough stock to consume the requested amount.");
            }

            return Ok();
        }
    }
}
