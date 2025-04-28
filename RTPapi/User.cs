namespace RTPapi;
public class User
{
    public int Id { get; set; }  // Primary key, auto-increment
    public string Username { get; set; }  // Username
    public string Email { get; set; }  // Email
    public string Password { get; set; }  // Password
    public string Gender { get; set; }  // Gender
    public DateTime Dob { get; set; }  // Date of birth
}
