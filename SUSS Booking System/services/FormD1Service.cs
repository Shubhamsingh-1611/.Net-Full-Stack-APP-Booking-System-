using Microsoft.AspNetCore.Mvc;
using SUSS_Booking_System.DTOs;
using SUSS_Booking_System.Models;
using SUSS_Booking_System.Repositories;

namespace SUSS_Booking_System.services
{
    public class FormD1Service : IFormD1Service
    {
        private readonly IFormD1Repository _formD1Repository;
        public FormD1Service(IFormD1Repository formD1Repository)
        {
            _formD1Repository = formD1Repository;
        }

        public Task<bool> D1Exists(String objId)
        {
            return _formD1Repository.D1Exists(objId);
        }

        public async Task SubmitAsync(FormD1Submit dto, String objId)
        {


            if (await _formD1Repository.ExistsByPiNumberAsync(dto.PINumber))
                throw new InvalidOperationException("Form D1 has already been submitted.");

            var entity = new FormD1
            {
                PINumber = dto.PINumber,
                EntraObjectId = objId,
                PreferredMobile = dto.PreferredMobile,
                PreferredEmail = dto.PreferredEmail,
                JobStatus = dto.JobStatus,
                IndustryWorkingAt = dto.IndustryWorkingAt,
                EmergencyContactPerson = dto.EmergencyContactPerson,
                RelationshipToClient = dto.RelationshipToClient,
                EmergencyContactMobile = dto.EmergencyContactMobile,
                IsClientAgreement = dto.IsClientAgreement,
                IsDeclaration = dto.IsDeclaration,
                DateSubmitted = DateTime.UtcNow,   // server set karta hai
                IsBlackList = false,
                StudentDeferredStatus = false
            };

            await _formD1Repository.AddAsync(entity);
            await _formD1Repository.SaveChangesAsync();
        }
    }
}
