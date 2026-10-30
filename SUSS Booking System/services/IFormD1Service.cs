using Microsoft.AspNetCore.Mvc;
using SUSS_Booking_System.DTOs;

namespace SUSS_Booking_System.services
{
    public interface IFormD1Service
    {

        public Task SubmitAsync(FormD1Submit sto);

    }
}
