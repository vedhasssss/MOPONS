# 🤝 How to Share MOPONS with Your Team

Follow these steps to send the project to your team member so it runs **exactly** like it does on your system.

## 📤 Step 1: Prepare the Files

1. **Stop the server** (Ctrl+C in your terminals).
2. **Delete these folders** (to make the file size small):
   - `node_modules` (in the main folder)
   - `client/node_modules` (in the client folder)
   - `.git` (optional, if you want to send it as a fresh project)

3. **Keep these important files**:
   - `.env` (Contains your API keys and DB config - **Crucial for it to work!**)
   - `install-and-run.bat` (The script I just created)
   - All source code (`server.js`, `client/`, `models/`, etc.)

4. **Zip the folder**:
   - Select all files in `d:\test antigravity\mopons`
   - Right-click -> Send to -> Compressed (zipped) folder
   - Name it `mopons-project.zip`

## 📨 Step 2: Send to Team Member

Send them the `mopons-project.zip` file via email, Slack, or Drive.

---

## 📥 Step 3: Instructions for Team Member

**Copy and paste these instructions to your team member:**

> "Hey! Here is the MOPONS project. To run it:
>
> 1. **Install Prerequisites**:
>    - Make sure you have **Node.js** installed.
>    - Make sure **MongoDB** is installed and running locally.
>
> 2. **Unzip** the folder to a location like `D:\mopons`.
>
> 3. **Run the Script**:
>    - Double-click the `install-and-run.bat` file.
>
> 4. **Wait**:
>    - It will automatically install all libraries.
>    - It will set up the database (seed categories).
>    - It will launch the Backend and Frontend automatically.
>
> The app will open at `http://localhost:3000`."

---

## 🗄️ About the Database (Important)

Since you are using a **Local MongoDB**, your team member will start with an **empty database** (except for the categories which the script will auto-create).

**If they need YOUR exact data (users, coupons, etc.):**

1. **Export your data**:
   Open a terminal and run:
   ```bash
   mongodump --db mopons --out dump
   ```
   This creates a `dump` folder.

2. **Include the `dump` folder** in the zip file you send them.

3. **They import it** by running:
   ```bash
   mongorestore dump
   ```

*Note: For a team project, it's usually better to let them create their own test users, or switch to a shared cloud database (MongoDB Atlas) later.*
