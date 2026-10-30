using Microsoft.EntityFrameworkCore;
using SUSS_Booking_System.Models;

namespace SUSS_Booking_System.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
            
        }

        public DbSet<FormD1> FormD1 { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<FormD1>(entity =>
            {
                entity.ToTable("FormD1");

                // One Form D1 per student
                entity.HasIndex(f => f.PINumber).IsUnique();

                entity.Property(f => f.IsBlackList).HasDefaultValue(false);
                entity.Property(f => f.StudentDeferredStatus).HasDefaultValue(false);
            });
          }
        }
}
