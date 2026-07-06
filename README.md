# toolxd

ToolxD is a collection of browser-based utility tools. Designed with a modern interface and a premium ad free visual experience, it is completely adless and really really fast.

Built entirely using vanilla HTML, CSS and JavaScript, most tools work without an internet connection, but some tools, like text to speech, do require it.


## Motivation

Whenever I needed to use a simple tool like world time, a password generator or metadata viewer, 
I usually search the web for it and come across websites providing these services but with lots of 
ads, popups and overall ugly UI/UX making it really difficult to work with it.

So I thought, I could build those tools myself and keep all of them in a single clean webinterface with a consistent style and an ad free premium experience. So I started building ToolxD and adding more and more new tools.

## Live Demo

```text
toolxd.vercel.app
```

or

```text
swaznil.github.io/toolxd
```

---

## Features

- No backend required
- Responsive layout
- Many tools have keyboard shortcuts
- lightweight and fast
- Reusable global CSS

---

## Screenshots 

![ToolxD Homepage](assets/screenshotfront.png)

![ToolxD Timer Tool](assets/screenshottimer.png)

--- 

## Tech Stack

* HTML
* CSS
* JavaScript
* Browser APIs
* LocalStorage
* Web Speech API

---

## Project Structure
```
toolxd
├── README.md
├── about.html
├── assets
├── css
│   ├── card.css
│   ├── global.css
│   └── style.css
├── index.html
├── js
│   └── script.js
└── tools
    ├── hashgen
    │   ├── hashgen.html
    │   ├── hashgen.css
    │   └── hashgen.js
    ├── metadata
    │   ├── metadata.html
    │   ├── metadata.js
    │   └── metadataview.css
    ├── palette
    │   ├── palette.css
    │   ├── palette.html
    │   └── palette.js
    ├── passwordgen
    │   ├── passwordgen.css
    │   ├── passwordgen.html
    │   └── passwordgen.js
    ├── textstat
    │   ├── textstats.css
    │   ├── textstats.html
    │   └── textstats.js
    ├── timer
    │   ├── timer.css
    │   ├── timer.html
    │   └── timer.js
    ├── tts
    │   ├── tts.css
    │   ├── tts.html
    │   └── tts.js
    └── worldtime
        ├── worldtime.css
        ├── worldtime.html
        └── worldtime.js
```
---

## AI Usage

ChatGPT was used for: 

I used it occasionally to help me with creating initial structure and helping me understand JavaScript logic. I also used it to find performance improvements and helping create global css. All features, design decisios and final integration were implemented by me.

---