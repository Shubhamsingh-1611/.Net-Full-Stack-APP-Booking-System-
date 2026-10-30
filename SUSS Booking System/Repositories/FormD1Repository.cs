using Microsoft.EntityFrameworkCore;
using SUSS_Booking_System.Data;
using SUSS_Booking_System.Models;

namespace SUSS_Booking_System.Repositories
{
    public class FormD1Repository : IFormD1Repository
    {
        private readonly ApplicationDbContext _context;

        public FormD1Repository(ApplicationDbContext context)
        {
            _context = context;
        }

        public Task<bool> ExistsByPiNumberAsync(string piNumber)
        {
            return _context.FormD1.AnyAsync(f => f.PINumber == piNumber);
        }

        public Task<FormD1?> GetByPiNumberAsync(string piNumber)
        {
            return _context.FormD1
                .AsNoTracking()
                .FirstOrDefaultAsync(f => f.PINumber == piNumber);
        }

        public async Task AddAsync(FormD1 entity)
        {
            await _context.FormD1.AddAsync(entity);
        }

        public Task SaveChangesAsync()
        {
            return _context.SaveChangesAsync();
        }
    }
}