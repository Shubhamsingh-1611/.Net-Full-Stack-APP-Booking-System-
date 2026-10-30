using Microsoft.AspNetCore.Mvc;
using SUSS_Booking_System.DTOs;
using SUSS_Booking_System.Models;

namespace SUSS_Booking_System.Repositories
{
    public interface IFormD1Repository
    {
        Task<bool> ExistsByPiNumberAsync(string piNumber);
        Task<FormD1?> GetByPiNumberAsync(string piNumber);
        Task AddAsync(FormD1 entity);
        Task SaveChangesAsync();

    }
}
