using Microsoft.EntityFrameworkCore;

namespace Stash.Models
{
    public class StashContext : DbContext
    {
        public StashContext(DbContextOptions<StashContext> options) : base(options) { }

        public DbSet<Category> Categories { get; set; }
        public DbSet<Item> Items { get; set; }
        public DbSet<Stock> Stocks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Category>().ToTable("Category");
            modelBuilder.Entity<Item>().ToTable("Item");
            modelBuilder.Entity<Stock>().ToTable("Stock");

            modelBuilder.Entity<Item>()
                .HasOne(i => i.Category)
                .WithMany(c => c.Items)
                .HasForeignKey(i => i.CategoryId);

            modelBuilder.Entity<Stock>()
                .HasOne(s => s.Item)
                .WithMany(i => i.Stocks)
                .HasForeignKey(s => s.ItemId);
        }
    }
}
