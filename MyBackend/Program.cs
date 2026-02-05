var builder = WebApplication.CreateBuilder(args);

// 1. Enable CORS so React (usually on port 5173) can talk to .NET
builder.Services.AddCors(options => {
    options.AddPolicy("AllowReactApp",
        policy => policy.WithOrigins("http://localhost:5173")
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

var app = builder.Build();
app.UseCors("AllowReactApp");

// Sample Data Model
var tasks = new List<TodoItem> {
    new(1, "Learn .NET", true),
    new(2, "Master React", false)
};

// 2. API Endpoints
app.MapGet("/api/tasks", () => tasks);

app.MapPost("/api/tasks", (TodoItem newItem) => {
    tasks.Add(newItem);
    return Results.Created($"/api/tasks/{newItem.Id}", newItem);
});

app.Run();

// Record type for clean data structure
record TodoItem(int Id, string Title, bool IsCompleted);