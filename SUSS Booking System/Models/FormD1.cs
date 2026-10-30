using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SUSS_Booking_System.Models
{
    /// <summary>
    /// Form D1 entity. Stores only what the student enters plus admin fields.
    /// SIMS/Mulesoft details (name, gender, address, etc.) are NOT stored here;
    /// they are fetched from the API using the PI Number / Mymail.
    /// </summary>
    [Table("FormD1")]
    public class FormD1
    {
        [Key]
        public int Id { get; set; }

        // Link to the student (from SIMS / Mulesoft)
        [Required, StringLength(20)]
        public string PINumber { get; set; } = string.Empty;

        // Entered by the student
        [Required, Phone, StringLength(20)]
        public string PreferredMobile { get; set; } = string.Empty;

        [Required, EmailAddress, StringLength(255)]
        public string PreferredEmail { get; set; } = string.Empty;

        // true = working, false = not working
        public bool JobStatus { get; set; }

        [StringLength(100)]
        public string? IndustryWorkingAt { get; set; }

        [Required, StringLength(150)]
        public string EmergencyContactPerson { get; set; } = string.Empty;

        [Required, StringLength(100)]
        public string RelationshipToClient { get; set; } = string.Empty;

        [Required, Phone, StringLength(20)]
        public string EmergencyContactMobile { get; set; } = string.Empty;

        // Consent
        public bool IsClientAgreement { get; set; }
        public bool IsDeclaration { get; set; }
        public DateTime DateSubmitted { get; set; } = DateTime.UtcNow;

        // Set by Admin only
        public bool IsBlackList { get; set; } = false;

        [StringLength(500)]
        public string? Reason { get; set; }

        public bool StudentDeferredStatus { get; set; } = false;

        // Data migrated from 10to8
        public bool IsTenToEight { get; set; } = false;

        // SUSS email used for the first-time lookup
        [EmailAddress, StringLength(255)]
        public string? Mymail { get; set; }
    }
}
