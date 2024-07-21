using Microsoft.AspNetCore.Mvc;
using Stash.Models;
using Stash.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Text.Json;

namespace Stash.Controllers
{
    [Route("api/stocks")]
    [ApiController]
    public class StockController : ControllerBase
    {
        private readonly IStockRepository _stockRepository;
        private readonly IProductRepository _productRepository;
        private readonly IStockTransactionRepository _stockTransactionRepository;

        public StockController(IStockRepository stockRepository, IProductRepository productRepository, IStockTransactionRepository stockTransactionRepository)
        {
            _stockRepository = stockRepository;
            _productRepository = productRepository;
            _stockTransactionRepository = stockTransactionRepository;
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

            // Log transaction
            var transaction = new StockTransaction
            {
                StockId = stock.Id,
                ProductName = product.Name,
                Amount = stock.Amount,
                TransactionTime = DateTime.UtcNow,
                TransactionType = "Add"
            };
            await _stockTransactionRepository.AddTransactionAsync(transaction);

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

            // Log transaction
            var transaction = new StockTransaction
            {
                StockId = existingStock.Id,
                ProductName = product.Name,
                Amount = stock.Amount,
                TransactionTime = DateTime.UtcNow,
                TransactionType = "Edit"
            };
            await _stockTransactionRepository.AddTransactionAsync(transaction);

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

            // Log transaction
            var transaction = new StockTransaction
            {
                StockId = stock.Id,
                ProductName = stock.Product?.Name ?? "Unknown",
                Amount = -stock.Amount, // Assuming amount is positive, -amount signifies deletion
                TransactionTime = DateTime.UtcNow,
                TransactionType = "Delete"
            };
            await _stockTransactionRepository.AddTransactionAsync(transaction);

            return NoContent();
        }

        // POST: api/stocks/consume-stock/{productId}
        [HttpPost("consume-stock/{productId}")]
        public async Task<IActionResult> ConsumeStock(int productId, [FromBody] int amount)
        {
            var stocks = await _stockRepository.GetAllStocksAsync();
            var productStocks = stocks
                .Where(s => s.ProductId == productId && s.Amount > 0)
                .OrderBy(s => s.DueDate ?? DateTime.MaxValue)
                .ThenBy(s => s.PurchaseDate)
                .ToList();

            int remainingAmount = amount;
            foreach (var stock in productStocks)
            {
                if (remainingAmount <= 0)
                    break;

                int originalAmount = stock.Amount;
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

                // Log transaction
                var transaction = new StockTransaction
                {
                    StockId = stock.Id,
                    ProductName = stock.Product?.Name ?? "Unknown",
                    Amount = originalAmount - stock.Amount,
                    TransactionTime = DateTime.UtcNow,
                    TransactionType = "Consume"
                };
                await _stockTransactionRepository.AddTransactionAsync(transaction);
            }

            if (remainingAmount > 0)
            {
                return BadRequest("Not enough stock to consume the requested amount.");
            }

            return Ok();
        }

        // GET: api/stocks/transactions
        [HttpGet("transactions")]
        public async Task<ActionResult<IEnumerable<StockTransaction>>> GetStockTransactions()
        {
            var transactions = await _stockTransactionRepository.GetAllTransactionsAsync();
            return Ok(transactions);
        }

        // GET: api/stocks/transactions/{productId}
        [HttpGet("transactions/{productId}")]
        public async Task<ActionResult<IEnumerable<StockTransaction>>> GetTransactionsByProductId(int productId)
        {
            var transactions = await _stockTransactionRepository.GetTransactionsByProductIdAsync(productId);
            if (transactions == null || !transactions.Any())
            {
                return NotFound();
            }
            Console.WriteLine($"Transactions for Product ID {productId}: {JsonSerializer.Serialize(transactions)}"); // Debug log
            return Ok(transactions);
        }
    }
}
