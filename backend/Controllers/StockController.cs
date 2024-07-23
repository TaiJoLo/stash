using Microsoft.AspNetCore.Mvc;
using Stash.Models;
using Stash.Repositories;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;

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

        // GET: api/stocks/{id}
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

        // PUT: api/stocks/{id}
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

        // DELETE: api/stocks/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStock(int id)
        {
            try
            {
                Console.WriteLine($"Received request to delete stock with ID: {id}");
                
                var stock = await _stockRepository.GetStockByIdAsync(id);
                if (stock == null)
                {
                    Console.WriteLine($"Stock with ID: {id} not found");
                    return NotFound();
                }

                // Create the transaction before deleting the stock
                var transaction = new StockTransaction
                {
                    StockId = stock.Id,
                    ProductName = stock.Product?.Name ?? "Unknown",
                    Amount = -stock.Amount,
                    TransactionTime = DateTime.UtcNow,
                    TransactionType = "Delete"
                };
                await _stockTransactionRepository.AddTransactionAsync(transaction);

                await _stockRepository.DeleteStockAsync(id);
                Console.WriteLine($"Deleted stock with ID: {id}");

                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                Console.WriteLine($"Error deleting stock: {ex.Message}");
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting stock: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }





        // POST: api/stocks/consume-stock-entry/{stockId}
        [HttpPost("consume-stock-entry/{stockId}")]
        public async Task<IActionResult> ConsumeStockEntry(int stockId, [FromBody] int amount)
        {
            try
            {
                var stock = await _stockRepository.GetStockByIdAsync(stockId);
                if (stock == null || stock.Amount < amount)
                {
                    return BadRequest("Not enough stock to consume the requested amount.");
                }

                int originalAmount = stock.Amount;
                stock.Amount -= amount;

                await _stockRepository.UpdateStockAsync(stock);

                var transaction = new StockTransaction
                {
                    StockId = stock.Id,
                    ProductName = stock.Product?.Name ?? "Unknown",
                    Amount = amount,
                    TransactionTime = DateTime.UtcNow,
                    TransactionType = "Consume"
                };
                await _stockTransactionRepository.AddTransactionAsync(transaction);

                return Ok();
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine($"Error consuming stock entry: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // POST: api/stocks/consume-stock-product/{productId}
        [HttpPost("consume-stock-product/{productId}")]
        public async Task<IActionResult> ConsumeStockProduct(int productId, [FromBody] int amount)
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
