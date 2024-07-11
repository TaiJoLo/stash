using System;
using System.Text.Json.Serialization;

namespace Stash.Models
{
    public class Stock
{
    public int Id { get; set; }
    public int ProductId { get; set; } // Foreign key to Product

    public int Amount { get; set; }
    public DateTime PurchaseDate { get; set; }
    public DateTime DueDate { get; set; }
    public string? Location { get; set; }

    // Navigation property if needed
    public virtual Product? Product { get; set; }
}
}
