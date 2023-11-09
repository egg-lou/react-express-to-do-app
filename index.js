const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3");
const md5 = require("md5");

const DBSOURCE = "db.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if(err){
        console.log(err.message);
        throw err;
    }else{
        console.log('Connected to the SQLITE database.')
        db.run('CREATE TABLE IF NOT EXISTS todo (id INTEGER PRIMARY KEY AUTOINCREMENT, task TEXT, status TEXT)');
    }
})

const app = express();
app.use(express.json())
app.use(cors());

const port = process.env.PORT || 4000;

const greetings = [
  "Good morning, let's conquer your to-do list!",
  "Rise and shine, time to tackle your tasks.",
  "Hello, productivity! Ready to get things done?",
  "Start your day with a smile and a to-do list.",
  "Greetings! Let's make today a productive one.",
  "Hello there, time to plan your day.",
  "Hey, it's to-do o'clock! What's on your list?",
  "Welcome to a new day of possibilities and tasks.",
  "Top of the day to you! What's on your agenda?",
  "Good day! Let's organize and prioritize.",
  "Hi there, ready to check off some tasks?",
  "Howdy! Time to get your tasks in order.",
  "Hola! What's on your to-do list today?",
  "Ahoy, matey! Let's sail through your tasks.",
  "Bonjour! Ready to tackle your daily goals?",
  "G'day! Let's make your to-do list disappear.",
  "Aloha, it's task-crushing time!",
  "Namaste! Let's find inner peace through productivity.",
  "Salutations! Your to-do list awaits your attention.",
  "How's it going? Time to get things done!"
];

app.get("/", (req, res) => {
    res.status(200).json({ message : "Server is Running." })
})

app.get("/greetings", (req, res)=>{
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    res.json({ greeting : randomGreeting })
});

let lastUsedId = 0;

app.post("/add-task", (req, res) => {
    const { task } = req.body;

    if (!task) {
        return res.status(400).json({ error: "Task description is required." });
    }

    lastUsedId++;

    db.run('INSERT INTO todo (id, task, status) VALUES (?, ?, ?)', [lastUsedId, task, "pending"], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: "Failed to add the task." });
        }
        res.status(200).json({ message: "Task added successfully", taskId: lastUsedId });
    });
});

app.get("/get-tasks", (req, res) => {
    db.all('SELECT * FROM todo', (err, rows) => {
        if(err){
            console.error(err.message);
            return res.status(500).json({error:"Failed to retrieve tasks."});
        }
        res.status(200).json({tasks:rows});
    });
});

app.put("/update-task-status/:taskId", (req, res) => {
    const { taskId } = req.params;
    const { status } = req.body;

    if(!status){
        return res.status(400).json({error: "Status is required." });
    }

    db.run('UPDATE todo SET status = ? WHERE id = ?', [status, taskId], function (err) {
        if(err){
            console.error(err.message);
            return res.status(500).json({error:"Failed to update task status."});
        }
        res.status(200).json({message : "Task status updated successfully."});
    });
});

app.patch("/update-task/:taskId", (req, res) => {
    const { taskId } = req.params;
    const { task } = req.body;

    if(!task){
        return res.status(400).json({ error: "Task description is required for the update." });
    }

    db.run('UPDATE todo SET task = ? WHERE id = ?', function (err){
        if(err){
            console.error(err.message);
            return res.status(500).json({ error: "Failed to update task description." });
        }
        res.status(200).json({ message: "Task updated successfully" });
    });
});

app.delete("/delete-task/:taskId", (req, res) => {
    const { taskId } = req.params;

    db.get('SELECT * FROM todo WHERE id = ?', [taskId], (err, row) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: "Failed to check the task's existence." });
        }

        if (!row) {
            return res.status(404).json({ error: "Task not found." });
        }

        db.run('DELETE FROM todo WHERE id = ?', [taskId], function (deleteErr) {
            if (deleteErr) {
                console.error(deleteErr.message);
                return res.status(500).json({ error: "Failed to delete the task." });
            }

            db.run('UPDATE todo SET id = id - 1 WHERE id > ?', [taskId], function (updateErr) {
                if (updateErr) {
                    console.error(updateErr.message);
                    return res.status(500).json({ error: "Failed to reorder IDs." });
                }
                res.status(200).json({ message: "Task deleted successfully." });
            });
        });
    });
});

app.delete("/delete-all-tasks", (req, res) => {
    db.run('DELETE FROM todo', function(err){
        if(err){
            console.error(err.message);
            return res.status(500).json({ error: "Failed to delete all tasks." });
        }
        res.status(200).json({ message: "All tasks deleted successfully "});
    });
});

app.listen(port, () =>
console.log(`App is listening at http://localhost:${port}`));