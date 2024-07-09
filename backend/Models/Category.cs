using System.Text.Json.Serialization;

namespace Stash.Models
{
    public class Category
    {
        public int Id { get; set; }
        public required string Name { get; set; }

        [JsonIgnore]
        public ICollection<Item> Items { get; set; } = new List<Item>();
    }
}
