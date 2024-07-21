using System;
using System.Text.Json.Serialization;

namespace Stash.Models
{
    public class StockTransaction
    {
        public int Id { get; set; }
        public int StockId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int Amount { get; set; }
        public DateTime TransactionTime { get; set; }
        public string TransactionType { get; set; } = string.Empty; // e.g., "Add", "Edit", "Consume", "Delete"

        // Navigation property
        [JsonIgnore]
        public Stock? Stock { get; set; }
    }
}
