using Microsoft.EntityFrameworkCore;
using RTPapi;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

var key = "RoadToProgrammingSuperStrongSecretKey2024!@#";
var builder = WebApplication.CreateBuilder(args);

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

app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// -------------------------- //
// 用户相关接口
// -------------------------- //

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

app.MapPost("/login", async (User loginData, RtpContext db) =>
{
    var existingUser = await db.Users.FirstOrDefaultAsync(u => u.Email == loginData.Email);
    if (existingUser == null || existingUser.Password != loginData.Password)
    {
        return Results.Unauthorized();
    }

    var tokenHandler = new JwtSecurityTokenHandler();
    var tokenKey = Encoding.UTF8.GetBytes(key);
    var tokenDescriptor = new SecurityTokenDescriptor
    {
        Subject = new ClaimsIdentity(new Claim[] { new Claim(ClaimTypes.Name, existingUser.Email) }),
        Expires = DateTime.UtcNow.AddHours(1),
        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(tokenKey), SecurityAlgorithms.HmacSha256Signature)
    };

    var token = tokenHandler.CreateToken(tokenDescriptor);
    var tokenString = tokenHandler.WriteToken(token);

    return Results.Ok(new { token = tokenString });
});

// -------------------------- //
// 路线图 Roadmap 接口
// -------------------------- //

app.MapGet("/roadmap/{name}", [Authorize] async (string name) =>
{
    var filePath = Path.Combine(Directory.GetCurrentDirectory(), "roadmap", $"{name}.json");
    if (!System.IO.File.Exists(filePath))
    {
        return Results.NotFound($"Roadmap file {name}.json not found.");
    }

    var content = await System.IO.File.ReadAllTextAsync(filePath);
    return Results.Content(content, "application/json");
});

// -------------------------- //
// AI生成学习计划接口
// -------------------------- //

app.MapPost("/ai/generate-plan", [Authorize] async (PlanRequest request, RtpContext db) =>
{
    // 生成一个唯一PlanId（根据用户email+时间）
    var sanitizedEmail = request.Email.Replace("@", "-at-").Replace(".", "-dot-");
    var planId = $"plan-{sanitizedEmail}-{DateTime.UtcNow:yyyyMMddHHmmss}";

    // Mock生成学习计划内容
    var planContent = new List<PlanWeek>
{
    new PlanWeek { Week = 1, Topic = "HTML Basics", Hours = 10 },
    new PlanWeek { Week = 2, Topic = "CSS Basics", Hours = 15 },
    new PlanWeek { Week = 3, Topic = "JavaScript Fundamentals", Hours = 20 },
    new PlanWeek { Week = 4, Topic = "React Introduction", Hours = 25 }
};

    // 把学习计划内容序列化成JSON字符串
    var planDataJson = System.Text.Json.JsonSerializer.Serialize(planContent);

    // 保存到数据库
    var newPlan = new Plan
    {
        PlanId = planId,
        Email = request.Email,
        CreatedAt = DateTime.UtcNow,
        PlanData = planDataJson
    };

    db.Plans.Add(newPlan);
    await db.SaveChangesAsync();

    // 返回给前端的标准格式（PlanResponse）
    var response = new PlanResponse
    {
        PlanId = planId,
        CreatedAt = newPlan.CreatedAt,
        Plan = planContent
    };

    return Results.Ok(response);
});

app.MapGet("/ai/my-plans", [Authorize] async (HttpContext http, RtpContext db) =>
{
    var email = http.User.Identity?.Name;

    if (string.IsNullOrEmpty(email))
    {
        return Results.Unauthorized();
    }

    var plans = await db.Plans
        .Where(p => p.Email == email)
        .OrderByDescending(p => p.CreatedAt)
        .ToListAsync();

    return Results.Ok(plans);
});

app.Run();