using Microsoft.EntityFrameworkCore;
using RTPapi;
var builder = WebApplication.CreateBuilder(args);
// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddDbContext<RtpContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
);
builder.Services.AddCors();
var app = builder.Build();
app.UseCors(policy =>
    policy.AllowAnyOrigin()
          .AllowAnyMethod()
          .AllowAnyHeader());

// 添加 PostgreSQL 数据库上下文服务


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// app.UseHttpsRedirection();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/user", async (RtpContext db) =>
{
    return await db.Users.ToListAsync();
})
.WithName("GetUserInfo");

app.MapPost("/user", async (User user, RtpContext db) =>
{
    db.Users.Add(user);
    await db.SaveChangesAsync();
    return Results.Ok(user);
});

app.MapPost("/login", async (User LoginData, RtpContext db) =>
{
    var existingUser = await db.Users.FirstOrDefaultAsync(u => u.Email == LoginData.Email);
    if (existingUser == null || existingUser.Password != LoginData.Password)
    {
        return Results.Unauthorized();
    }

    return Results.Ok("Login successful!");

});
app.Run();
