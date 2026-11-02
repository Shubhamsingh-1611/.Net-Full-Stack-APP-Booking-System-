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

        [Authorize(Roles = "Client")]
        [HttpGet("d1exist")]
        public async Task<IActionResult> D1Exists()
        {
            var objectId = User.FindFirstValue("http://schemas.microsoft.com/identity/claims/objectidentifier")
                          ?? User.FindFirstValue("oid");
            if (string.IsNullOrWhiteSpace(objectId))
                return Unauthorized();

            try
            {
                bool res = await _service.D1Exists(objectId);
                return Ok(res);
            }
            catch (InvalidOperationException ex)   // business rule broken
            {
                return Conflict(new { message = ex.Message });
            }

        }

        // POST api/FormD1/submit
        [Authorize(Roles = "Client")]
        [HttpPost("submit")]
        public async Task<IActionResult> Submit([FromBody] FormD1Submit dto)
        {
            // Fixed: Safely falls back to "oid" claim if long schema URI isn't populated
            var objectId = User.FindFirstValue("http://schemas.microsoft.com/identity/claims/objectidentifier")
                           ?? User.FindFirstValue("oid");

            // Fixed: Completed the declaration to capture the role claim
            var objectRole = User.FindFirstValue(ClaimTypes.Role) ?? User.FindFirstValue("roles");

            if (string.IsNullOrEmpty(objectId))
                return Unauthorized();

            try
            {
                await _service.SubmitAsync(dto, objectId);
                return Ok(new { message = "Form D1 submitted successfully." });
            }
            catch (InvalidOperationException ex)   // business rule broken
            {
                return Conflict(new { message = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("check-role")]
        public IActionResult CheckRole()
        {
            var role = User.FindFirstValue(ClaimTypes.Role) ?? User.FindFirstValue("roles");

            Console.WriteLine($"Role: {role}");
            Console.WriteLine($"Is Client: {User.IsInRole("Client")}");
            Console.WriteLine($"Role Claim Type: {(User.Identity is ClaimsIdentity identity
                ? identity.RoleClaimType : "Unknown")}");

            return Ok(new
            {
                role,
                isClient = User.IsInRole("Client")
            });
        }
    }
}
