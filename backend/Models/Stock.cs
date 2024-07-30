using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations.Schema;

namespace Stash.Models
{
    public class Stock
    {
        public int Id { get; set; }
        public int ProductId { get; set; } // Foreign key to Product
        public int LocationId { get; set; } // Foreign key to Location
        public int Amount { get; set; }
        public DateTime? PurchaseDate { get; set; }
        public DateTime? DueDate { get; set; }

         [Column(TypeName = "decimal(18,2)")]
        public decimal UnitPrice { get; set; }

        // Navigation properties
        [JsonIgnore]
        public virtual Product? Product { get; set; }
        public virtual Location? Location { get; set; }

        // Transactions navigation property
        [JsonIgnore]
        public virtual ICollection<StockTransaction> Transactions { get; set; } = new List<StockTransaction>();
    }
}
