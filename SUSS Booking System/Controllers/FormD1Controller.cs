using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SUSS_Booking_System.DTOs;
using SUSS_Booking_System.Models;
using SUSS_Booking_System.services;
using System.Security.Claims;

namespace SUSS_Booking_System.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
 
    public class FormD1Controller : ControllerBase
    {
        private readonly IFormD1Service _service;

        public FormD1Controller(IFormD1Service service)
        {
            _service = service;
        }

        // POST api/FormD1/submit
        [HttpPost("submit")]
        public async Task<IActionResult> Submit([FromBody] FormD1Submit dto)
        {
            // [ApiController] already returns 400 automatically if validation fails
            try
            {
                // Service: finds student by email (Mulesoft/mock), gets PI number,
                // checks rules (already submitted, etc.), saves the FormD1 row.
                await _service.SubmitAsync(dto);
                return Ok(new { message = "Form D1 submitted successfully." });
            }
            catch (InvalidOperationException ex)   // business rule broken
            {
                return Conflict(new { message = ex.Message });
            }
        }
    }
}
