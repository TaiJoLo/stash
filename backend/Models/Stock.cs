using System;
using System.Text.Json.Serialization;

namespace Stash.Models
{
    public class Stock
    {
        public int Id { get; set; }
        public int ProductId { get; set; } // Foreign key to Product
        public int LocationId { get; set; } // Foreign key to Location
        public int Amount { get; set; }
        public DateTime PurchaseDate { get; set; }
        public DateTime DueDate { get; set; }

        // Navigation properties
        public virtual required Product Product { get; set; }
        public virtual Location? Location { get; set; }
    }
}
