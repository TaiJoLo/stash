using Microsoft.EntityFrameworkCore;

namespace Stash.Models
{
    public class StashContext : DbContext
    {
        public StashContext(DbContextOptions<StashContext> options) : base(options) { }

        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ParentProduct> ParentProducts { get; set; }
        public DbSet<Stock> Stocks { get; set; }
        public DbSet<Location> Locations { get; set; }
        public DbSet<StockTransaction> StockTransactions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure Category entity
            modelBuilder.Entity<Category>()
                .ToTable("Category")
                .Property(c => c.Name)
                .HasColumnType("varchar(255)");

            // Configure Product entity
            modelBuilder.Entity<Product>().ToTable("Product");

            // Configure ParentProduct entity
            modelBuilder.Entity<ParentProduct>().ToTable("ParentProduct");

            // Configure Stock entity
            modelBuilder.Entity<Stock>().ToTable("Stock");

            // Configure Location entity
            modelBuilder.Entity<Location>().ToTable("Location");

            // Configure relationships
            modelBuilder.Entity<Product>()
                .HasOne(p => p.Category)
                .WithMany(c => c.Products)
                .HasForeignKey(p => p.CategoryId);

            modelBuilder.Entity<Product>()
                .HasOne(p => p.ParentProduct)
                .WithMany()
                .HasForeignKey(p => p.ParentProductId);

            modelBuilder.Entity<Stock>()
                .HasOne(s => s.Product)
                .WithMany(p => p.Stocks)
                .HasForeignKey(s => s.ProductId)
                .IsRequired();

            modelBuilder.Entity<Stock>()
                .HasOne(s => s.Location)
                .WithMany()
                .HasForeignKey(s => s.LocationId)
                .IsRequired();

            // Configure StockTransaction entity
            modelBuilder.Entity<StockTransaction>()
                .ToTable("StockTransaction");

            modelBuilder.Entity<StockTransaction>()
                .HasOne(st => st.Stock)
                .WithMany(s => s.Transactions)
                .HasForeignKey(st => st.StockId)
                .IsRequired();
        }
    }
}
