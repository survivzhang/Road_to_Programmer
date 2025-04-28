using Microsoft.EntityFrameworkCore;
using RTPapi;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;

using System.Text.Json;

// Add JWT key to .env file
if (!File.Exists(Path.Combine(Directory.GetCurrentDirectory(), ".env")))
{
    // If .env file does not exist, create one with default JWT key
    File.WriteAllText(
        Path.Combine(Directory.GetCurrentDirectory(), ".env"),
        "OPENAI_API_KEY=your_openai_api_key\nJWT_SECRET_KEY=RoadToProgrammingSuperStrongSecretKey2024!@#"
    );
}

// Try to manually load .env file
if (File.Exists(Path.Combine(Directory.GetCurrentDirectory(), ".env")))
{
    var lines = File.ReadAllLines(Path.Combine(Directory.GetCurrentDirectory(), ".env"));
    foreach (var line in lines)
    {
        var parts = line.Split('=', 2, StringSplitOptions.RemoveEmptyEntries);
        if (parts.Length == 2)
        {
            var key = parts[0].Trim();
            var value = parts[1].Trim();
            Environment.SetEnvironmentVariable(key, value);
        }
    }
}

// Get JWT key
var jwtKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY") ?? "RoadToProgrammingSuperStrongSecretKey2024!@#";
var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddEnvironmentVariables()
                    .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);

// Try to manually load .env file
if (File.Exists(Path.Combine(Directory.GetCurrentDirectory(), ".env")))
{
    var lines = File.ReadAllLines(Path.Combine(Directory.GetCurrentDirectory(), ".env"));
    foreach (var line in lines)
    {
        var parts = line.Split('=', 2, StringSplitOptions.RemoveEmptyEntries);
        if (parts.Length == 2)
        {
            var key = parts[0].Trim();
            var value = parts[1].Trim();
            Environment.SetEnvironmentVariable(key, value);
        }
    }
}

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
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
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
// User-related APIs
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
    var tokenKey = Encoding.UTF8.GetBytes(jwtKey);
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
// Roadmap APIs
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
// Test OpenAI API Connection
// -------------------------- //

app.MapGet("/test-openai", async (IConfiguration config) =>
{
    var openAiApiKey = Environment.GetEnvironmentVariable("OPENAI_API_KEY");
    
    if (string.IsNullOrEmpty(openAiApiKey))
    {
        return Results.Problem("OpenAI API Key not found in configuration.");
    }

    var httpClient = new HttpClient();
    httpClient.DefaultRequestHeaders.Authorization = 
        new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", openAiApiKey);

    var body = new
    {
        model = "gpt-4o",
        messages = new[]
        {
            new { role = "system", content = "You are a helpful assistant. Respond with a simple JSON object with a key 'status' and value 'success'." },
            new { role = "user", content = "Test connection" }
        },
        temperature = 0.3
    };

    try
    {
        var response = await httpClient.PostAsync(
            "https://api.openai.com/v1/chat/completions",
            new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json")
        );

        if (!response.IsSuccessStatusCode)
        {
            var errorText = await response.Content.ReadAsStringAsync();
            Console.WriteLine($"OpenAI API Error: {errorText}");
            return Results.Problem($"Failed to call OpenAI API. Status: {response.StatusCode}, Error: {errorText}");
        }

        var responseBody = await response.Content.ReadAsStringAsync();
        return Results.Content(responseBody, "application/json");
    }
    catch (Exception ex)
    {
        return Results.Problem($"Exception when testing OpenAI API: {ex.Message}");
    }
});

// -------------------------- //
// AI-generated Learning Plan APIs
// -------------------------- //

app.MapPost("/ai/generate-plan", [Authorize] async (PlanRequest request, RtpContext db, IConfiguration config) =>
{
    var openAiApiKey = Environment.GetEnvironmentVariable("OPENAI_API_KEY");
    
    if (string.IsNullOrEmpty(openAiApiKey))
    {
        return Results.Problem("OpenAI API Key not found in configuration.");
    }

    var httpClient = new HttpClient();
    httpClient.DefaultRequestHeaders.Authorization = 
        new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", openAiApiKey);

    // System prompt, ask AI to strictly return format
    var systemPrompt = @"
You are a professional career coach AI.

Given the user's goal, current level, and study hours per week, generate a week-by-week learning plan, the plan should as detail as possible.

A week can have multiple topics, All topics should be related to the user's goal and each topic have a particular part (use the specific name not part 1, part2) can be finished in several hours. All hours should be integers, and the total hours in a week should equal the user's habit.


⚡ Return ONLY a valid JSON array like:
[
    { ""Week"": 1, ""Topic"": ""HTML Basics- one part"", ""Hours"": 5 },
    { ""Week"": 1, ""Topic"": ""HTML Basics- one part"", ""Hours"": 7 },
    { ""Week"": 2, ""Topic"": ""CSS Basics- one part"", ""Hours"": 5 },
    { ""Week"": 2, ""Topic"": ""CSS Basics- two part"", ""Hours"": 7 },
    { ""Week"": 2, ""Topic"": ""CSS Basics- three part"", ""Hours"": 3 },
    { ""Week"": 2, ""Topic"": ""CSS Basics- four part"", ""Hours"": 4 },
    { ""Week"": 2, ""Topic"": ""CSS Basics- five part"", ""Hours"": 5 },
  
]

⚡ No explanation, no text, ONLY pure JSON array.
";

    var userPrompt = $"Career Goal and User Info: {request.PlanDescription}";

    var body = new
    {
        model = "gpt-4o",
        messages = new[]
        {
            new { role = "system", content = systemPrompt },
            new { role = "user", content = userPrompt }
        },
        temperature = 0.3
    };

    var response = await httpClient.PostAsync(
        "https://api.openai.com/v1/chat/completions",
        new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json")
    );

    if (!response.IsSuccessStatusCode)
    {
        var errorText = await response.Content.ReadAsStringAsync();
        Console.WriteLine($"OpenAI API Error: {errorText}");
        Console.WriteLine($"Status code: {response.StatusCode}");
        Console.WriteLine($"Request body: {JsonSerializer.Serialize(body)}");
        return Results.Problem($"Failed to call OpenAI API. Status: {response.StatusCode}, Error: {errorText}");
    }

    var responseBody = await response.Content.ReadAsStringAsync();
    Console.WriteLine($"OpenAI Response: {responseBody}");
    
    try
    {
        var resultJson = JsonDocument.Parse(responseBody);

        var generatedContent = resultJson.RootElement
            .GetProperty("choices")[0]
            .GetProperty("message")
            .GetProperty("content")
            .GetString();

        if (string.IsNullOrEmpty(generatedContent))
        {
            return Results.Problem("OpenAI returned empty content.");
        }

        // Save to database
        var sanitizedEmail = request.Email.Replace("@", "-at-").Replace(".", "-dot-");
        var planId = $"plan-{sanitizedEmail}-{DateTime.UtcNow:yyyyMMddHHmmss}";
        

        // Deserialize to generate List<PlanWeek>
        var parsedPlanWeeks = JsonSerializer.Deserialize<List<PlanWeek>>(generatedContent) ?? new List<PlanWeek>();
        // 在反序列化和补充字段后
        for (int i = 0; i < parsedPlanWeeks.Count; i++)
        {
            parsedPlanWeeks[i].Id = $"step-{i + 1}";
            parsedPlanWeeks[i].IsCompleted = false;
        }

        // 🔥 新增
        var processedPlanData = JsonSerializer.Serialize(parsedPlanWeeks);

        // 保存到数据库的
        var newPlan = new Plan
        {
            PlanId = planId,
            Email = request.Email,
            CreatedAt = DateTime.UtcNow,
            PlanData = processedPlanData // 这里保存加工后的JSON
        };

        db.Plans.Add(newPlan);
        await db.SaveChangesAsync();

        

        var planResponse = new PlanResponse
        {
            PlanId = planId,
            CreatedAt = newPlan.CreatedAt,
            Plan = parsedPlanWeeks
        };

        return Results.Ok(planResponse);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error parsing OpenAI response: {ex.Message}");
    }
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

    var response = plans.Select(plan => new PlanResponse
    {
        PlanId = plan.PlanId,
        CreatedAt = plan.CreatedAt,
        Plan = System.Text.Json.JsonSerializer.Deserialize<List<PlanWeek>>(plan.PlanData) ?? new List<PlanWeek>()
    }).ToList();

    return Results.Ok(response);
});

app.MapDelete("/ai/plan/{planId}", [Authorize] async (string planId, HttpContext http, RtpContext db) =>
{
    var email = http.User.Identity?.Name;
    Console.WriteLine($"Delete request for planId: {planId} by user: {email}");

    if (string.IsNullOrEmpty(email))
    {
        Console.WriteLine("Unauthorized: No email in token");
        return Results.Unauthorized();
    }

    // Log all available plans for this user to help debug
    var userPlans = await db.Plans
        .Where(p => p.Email == email)
        .ToListAsync();
    
    Console.WriteLine($"User has {userPlans.Count} plans. Plan IDs: {string.Join(", ", userPlans.Select(p => p.PlanId))}");

    var plan = await db.Plans.FirstOrDefaultAsync(p => p.PlanId == planId && p.Email == email);
    
    if (plan == null)
    {
        Console.WriteLine($"Plan not found. PlanId: {planId}, User: {email}");
        return Results.NotFound($"Plan with ID {planId} not found or you don't have permission to delete it.");
    }

    Console.WriteLine($"Deleting plan. Id: {plan.Id}, PlanId: {plan.PlanId}");
    db.Plans.Remove(plan);
    await db.SaveChangesAsync();
    Console.WriteLine("Plan deleted successfully");

    return Results.Ok(new { message = "Plan deleted successfully" });
});


// 新增 PUT 接口
app.MapPut("/ai/plan/{planId}/week/{weekId}", [Authorize] async (string planId, string weekId, UpdateWeekRequest request, HttpContext http, RtpContext db) =>
{
    var email = http.User.Identity?.Name;
    if (string.IsNullOrEmpty(email))
        return Results.Unauthorized();

    var plan = await db.Plans.FirstOrDefaultAsync(p => p.PlanId == planId && p.Email == email);
    if (plan == null)
        return Results.NotFound("Plan not found");

    var planWeeks = JsonSerializer.Deserialize<List<PlanWeek>>(plan.PlanData) ?? new List<PlanWeek>();

    var week = planWeeks.FirstOrDefault(w => w.Id == weekId);
    if (week == null)
        return Results.NotFound("Step not found");

    week.IsCompleted = request.IsCompleted;

    plan.PlanData = JsonSerializer.Serialize(planWeeks);
    await db.SaveChangesAsync();

    return Results.Ok(new { message = "Progress updated successfully" });
});


app.Run();