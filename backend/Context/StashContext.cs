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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Category>()
                .ToTable("Category")
                .Property(c => c.Name)
                .HasColumnType("varchar(255)");

            modelBuilder.Entity<Product>().ToTable("Product");
            modelBuilder.Entity<ParentProduct>().ToTable("ParentProduct");
            modelBuilder.Entity<Stock>().ToTable("Stock");
            modelBuilder.Entity<Location>().ToTable("Location");

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
                .WithMany()
                .HasForeignKey(s => s.ProductId)
                .IsRequired();

            modelBuilder.Entity<Stock>()
                .HasOne(s => s.Location)
                .WithMany()
                .HasForeignKey(s => s.LocationId)
                .IsRequired();
        }
    }
}
