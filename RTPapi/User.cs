public class User
{
  public int Id { get; set; }  // 主键，自动递增
  public string Username { get; set; }  // 用户名
  public string Email { get; set; }  // 邮箱
  public string Password { get; set; }  // 密码
  public string Gender { get; set; }  // 性别
  public DateTime Dob { get; set; }  // 出生日期
    
}
