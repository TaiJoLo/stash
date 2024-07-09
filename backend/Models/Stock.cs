using System.Text.Json.Serialization;

namespace Stash.Models
{
    public class Stock
    {
        public int Id { get; set; }
        public required string Location { get; set; }
        public int Quantity { get; set; }
        public DateTime ExpiryDate { get; set; }
        public decimal Price { get; set; }
        public DateTime RecordCreatedDate { get; set; }
        
        [JsonIgnore]
        public int ItemId { get; set; }
        public required Item Item { get; set; }
    }
}
