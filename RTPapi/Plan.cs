namespace RTPapi;

// Entity saved to database
public class Plan
{
    public int Id { get; set; } // Auto-increment primary key
    public string PlanId { get; set; } = string.Empty; // Unique identifier
    public string Email { get; set; } = string.Empty; // Which user it belongs to
    public DateTime CreatedAt { get; set; } // Creation time
    public string PlanData { get; set; } = string.Empty; // JSON data of the plan
}

// Request body sent from frontend
public class PlanRequest
{
    public string Email { get; set; } = string.Empty; // Who sent the request
    public string PlanDescription { get; set; } = string.Empty; // Requirement description
}

// Response body returned to frontend
public class PlanResponse
{
    public string PlanId { get; set; } = string.Empty; // Plan ID
    public DateTime CreatedAt { get; set; } // Creation time
    public List<PlanWeek> Plan { get; set; } = new(); // Plan content returned
}

// Each small stage in the learning plan
public class PlanWeek
{
    public int Week { get; set; }
    public string Topic { get; set; } = string.Empty;
    public int Hours { get; set; }
    public bool IsCompleted { get; set; } // Whether the user has completed this stage
}