using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MyBackend.Data;
using MyBackend.Models;

var builder = WebApplication.CreateBuilder(args);

// 1) CORS so React can call the API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy.WithOrigins("http://localhost:5173")
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

// 2) Register the DB connection (MUST be before Build)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=app.db"));

var app = builder.Build();
app.UseCors("AllowReactApp");

// ----------------------
// TASKS (in-memory demo)
// ----------------------
var tasks = new List<TodoItem> {
    new(1, "Learn .NET", true),
    new(2, "Master React", false)
};

app.MapGet("/api/tasks", () => tasks);

app.MapPost("/api/tasks", (TodoItem newItem) =>
{
    tasks.Add(newItem);
    return Results.Created($"/api/tasks/{newItem.Id}", newItem);
});

// ----------------------
// USERS (SQL-backed)
// ----------------------
app.MapGet("/api/users", async (AppDbContext db) =>
{
    var users = await db.Users
        .Select(u => new { u.Id, u.Name, u.Email })
        .ToListAsync();

    return Results.Ok(users);
});

app.MapPost("/api/auth/register", async (RegisterRequest request, AppDbContext db) =>
{
    var name = request.Name.Trim();
    var email = request.Email.Trim().ToLower();
    var password = request.Password;

    // basic validation
    if (name.Length < 1)
        return Results.BadRequest(new { message = "Name too short." });

    if (!email.Contains("@"))
        return Results.BadRequest(new { message = "Invalid email." });

    if (password.Length < 6)
        return Results.BadRequest(new { message = "Password too short (min 6)." });

    // check if email already exists in SQL
    var exists = await db.Users.AnyAsync(u => u.Email == email);
    if (exists)
        return Results.Conflict(new { message = "Email already registered." });

    var user = new User
    {
        Name = name,
        Email = email,
        CreatedAt = DateTime.UtcNow,
        UpdatedAt = DateTime.UtcNow
    };


    // hash password and store hash
    var hasher = new PasswordHasher<User>();
    user.PasswordDigest = hasher.HashPassword(user, password);



    db.Users.Add(user);
    await db.SaveChangesAsync();

    return Results.Created($"/api/users/{user.Id}",
        new { user.Id, user.Name, user.Email });
});

app.MapPost("/api/auth/login", async (LoginRequest request, AppDbContext db) =>
{
    string email = request.Email.Trim().ToLower();
    string password = request.Password;

    // 1) Find user by email
    var user = await db.Users.FirstOrDefaultAsync(u => u.Email == email);

    // 2) If not found, fail (don't reveal which part was wrong)
    if (user == null)
        return Results.Json(new { message = "Invalid email or password." }, statusCode: 401);


    // 3) Verify password against stored PasswordDigest
    var hasher = new PasswordHasher<User>();
    var result = hasher.VerifyHashedPassword(user, user.PasswordDigest, password);

    if (result == PasswordVerificationResult.Failed)
        return Results.Json(new { message = "Invalid email or password." }, statusCode: 401);


    // 4) Update updated_at timestamp (optional but matches your schema)
    user.UpdatedAt = DateTime.UtcNow;
    await db.SaveChangesAsync();

    // 5) Return safe info only
    return Results.Ok(new { message = "Login successful!", user.Id, user.Name, user.Email });
});


app.Run();

// ----------------------
// Records / DTOs
// ----------------------
record TodoItem(int Id, string Title, bool IsCompleted);
record RegisterRequest(string Name, string Email, string Password);
record LoginRequest(string Email, string Password);

