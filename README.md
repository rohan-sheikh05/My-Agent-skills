# Term-Final Question Bank — AI Skill

Turn past term-final question papers into a clean, single-file **HTML question bank** with a full analysis. Works with Claude, ChatGPT, Gemini, or any AI that accepts files.

Made by **Rohan Sheikh** (BUET MME). See it in action on the MME Academic Portal.

---

## What it makes

Give the AI the question papers (PDFs or photos) for one course. You get back one `.html` file that opens in any browser, with:

- **Topic-wise questions**, each tagged with year, section and marks
- **Heatmap** showing which topics come up in which years
- **Repeat detection**: questions that appear word for word, and similar patterns
- **Paper-pattern table** and key numbers (total questions, marks per topic)
- **Exam takeaways**: what to prioritise
- Proper maths rendering (MathJax), search, a colour theme of your choice, and a phone-friendly layout

---

## Files in this repo

| File | Use it for |
|---|---|
| `SKILL.md` | The skill itself. Works in any AI. |
| `term-final-question-bank.zip` | The same skill, packaged ready to upload to Claude |

---

## How to use

### 1. Download

On this repo page, click the file → **Download raw file** (↓ icon).
For Claude, download the `.zip`. For any other AI, download `SKILL.md`.

### 2a. Claude (claude.ai)

1. Open **Settings → Capabilities** (on some accounts it's **Customize**) and turn on **Code execution and file creation**.
2. Find **Skills** → **Upload skill** → choose `term-final-question-bank.zip`.
3. Make sure the skill is switched **on**.
4. Start a new chat, attach the question papers and say:
   > Make a term-final question bank for **[course code — course name]**.

Claude picks up the skill on its own. No need to paste anything.

### 2b. ChatGPT

**Option A: Project (easiest)**
1. Sidebar → **Projects → New project**.
2. Open the project → **Files** → upload `SKILL.md`.
3. In the project **Instructions**, write: *"Follow SKILL.md exactly whenever I share exam papers."*
4. Start a chat inside the project and attach the papers.

**Option B: Custom GPT**
**Explore GPTs → Create → Configure**, upload `SKILL.md` under **Knowledge**, and put the same line in **Instructions**.

### 2c. Gemini / other AIs

- **Gemini:** create a **Gem**, add `SKILL.md` as a file, and tell it to follow the file.
- **Anything else:** paste the full text of `SKILL.md` as your first message, then attach the papers.

### 3. Get your file

The AI returns `CODE_Question_Bank.html`. Download it and open it in a browser. Done.

---

## Tips for best results

- **Upload every year you have.** More years means better repeat detection.
- **Use clear scans.** Blurry photos lead to misread questions or marks.
- **One course per chat.**
- **Ask for a theme** if you like, e.g. *"use the forest theme"* (8 presets are built in).
- **Check the totals.** The AI is told to match each year's marks to the paper, but a quick look is worth it.

## Make it yours

Open `SKILL.md`, find the `COURSE` settings in the template, and change the **portal link** and **report email** to your own (or delete them). Everything else works as is.

---

## Notes

- Menu names in Claude, ChatGPT and Gemini change from time to time. If a button isn't where it says above, look for *Skills*, *Customize*, *Projects*, *Knowledge* or *Gems*.
- Claude skills need a paid plan with code execution turned on. ChatGPT Projects and GPTs may also need a paid plan.
- The skill only formats and analyses papers you provide. Please share only papers you're allowed to share.

**Found a bug or have an idea?** Open an issue or email rohansheikh2005@gmail.com.
