using Microsoft.EntityFrameworkCore;

namespace RTPapi
{
  public class RtpContext : DbContext
  {
    public RtpContext(DbContextOptions<RtpContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
  }
}