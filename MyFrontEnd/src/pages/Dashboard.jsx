import "./Dashboard.css";

function Dashboard() {
    return (
        <div className="dashboardContainer">
            <h2>Welcome to your Dashboard</h2>
            <p>You are successfully logged in.</p>

            <button onClick={() => alert("Unfortunately Farmageddon is simply a concept and not quite ready to be rolled out just yet. Hang tight a little longer!")}>Launch the Game</button>;
        </div>
    );
}

export default Dashboard;
