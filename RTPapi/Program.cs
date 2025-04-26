using Microsoft.EntityFrameworkCore;
using RTPapi;
using Microsoft.AspNetCore.Authentication.JwtBearer; //  To use JWT Authentication
using Microsoft.IdentityModel.Tokens; //  To validate JWT signature
using System.Text; //  To handle secret key encoding
using System.IdentityModel.Tokens.Jwt; //  To generate JWT tokens
using System.Security.Claims; //  To store user identity in JWT

var key = "RoadToProgrammingSuperStrongSecretKey2024!@#"; //  Secret key for JWT token generation and validation
var builder = WebApplication.CreateBuilder(args);
// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddDbContext<RtpContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
);
builder.Services.AddCors();
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key))
    };
});
builder.Services.AddAuthorization();
var app = builder.Build();
app.UseCors(policy =>
    policy.AllowAnyOrigin()
          .AllowAnyMethod()
          .AllowAnyHeader());

// 添加 PostgreSQL 数据库上下文服务

app.UseAuthentication(); // 🛡️ Validate incoming JWT tokens
app.UseAuthorization();  // 🛡️ Enforce [Authorize] rules on APIs

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// app.UseHttpsRedirection();

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
    Console.WriteLine($"Login Try: {LoginData.Email} / {LoginData.Password}");

    var existingUser = await db.Users.FirstOrDefaultAsync(u => u.Email == LoginData.Email);

    if (existingUser == null)
    {
        Console.WriteLine("User not found!");
        return Results.Unauthorized();
    }

    Console.WriteLine($"DB User: {existingUser.Email} / {existingUser.Password}");

    if (existingUser.Password != LoginData.Password)
    {
        Console.WriteLine("Password mismatch!");
        return Results.Unauthorized();
    }

    var tokenHandler = new JwtSecurityTokenHandler();
    var tokenKey = Encoding.UTF8.GetBytes(key);
    var tokenDescriptor = new SecurityTokenDescriptor
    {
        Subject = new ClaimsIdentity(new Claim[]
        {
            new Claim(ClaimTypes.Name, existingUser.Email)
        }),
        Expires = DateTime.UtcNow.AddHours(1),
        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(tokenKey), SecurityAlgorithms.HmacSha256Signature)
    };

    var token = tokenHandler.CreateToken(tokenDescriptor);
    var tokenString = tokenHandler.WriteToken(token);

    Console.WriteLine("Login Success!");

    return Results.Ok(new { token = tokenString });
});

app.MapGet("/roadmap/{name}", async (string name) =>
{
    var filePath = Path.Combine(Directory.GetCurrentDirectory(), "roadmap", $"{name}.json");
        if (!System.IO.File.Exists(filePath))
    {
        return Results.NotFound($"Roadmap file {name}.json not found.");
    }

    var content = await System.IO.File.ReadAllTextAsync(filePath);
    return Results.Content(content, "application/json");
});
app.Run();
