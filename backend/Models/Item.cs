using System.Text.Json.Serialization;

namespace Stash.Models
{
    public class Item
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public string? PictureUrl { get; set; }
        public int CategoryId { get; set; }
        
        [JsonIgnore]
        public ICollection<Stock> Stocks { get; set; } = new List<Stock>();
        [JsonIgnore]
        public Category? Category { get; set; }
    }
}
