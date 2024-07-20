using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Stash.Models
{
    public class Product
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public string? PictureUrl { get; set; }
        public int? CategoryId { get; set; }
        public int? ParentProductId { get; set; }
        

        [JsonIgnore]
        public Category? Category { get; set; }
        
        [JsonIgnore]
        public ParentProduct? ParentProduct { get; set; }

        [JsonIgnore]
        public ICollection<Stock> Stocks { get; set; } = new List<Stock>();
    }
}
