using System.ComponentModel.DataAnnotations;

namespace SUSS_Booking_System.DTOs
{
    public class FormD1Submit
    {
        [Required, StringLength(20)]
        public string PINumber { get; set; } = string.Empty;

        [StringLength(36)]
        public string? EntraObjectId { get; set; }

        [Required, Phone, StringLength(20)]
        public string PreferredMobile { get; set; } = string.Empty;

        [Required, EmailAddress, StringLength(255)]
        public string PreferredEmail { get; set; } = string.Empty;

        public bool JobStatus { get; set; }

        [StringLength(100)]
        public string? IndustryWorkingAt { get; set; }

        [Required, StringLength(150)]
        public string EmergencyContactPerson { get; set; } = string.Empty;

        [Required, StringLength(100)]
        public string RelationshipToClient { get; set; } = string.Empty;

        [Required, Phone, StringLength(20)]
        public string EmergencyContactMobile { get; set; } = string.Empty;

        [Range(typeof(bool), "true", "true", ErrorMessage = "Client agreement is required.")]
        public bool IsClientAgreement { get; set; }

        [Range(typeof(bool), "true", "true", ErrorMessage = "Declaration is required.")]
        public bool IsDeclaration { get; set; }
    }
}
