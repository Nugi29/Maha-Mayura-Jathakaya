# 🦚 Maha Mayura Jathakaya - Digital Thorana

An immersive, interactive digital representation of a traditional Sri Lankan Buddhist Thorana (Pandol) narrating the **Maha Mayura Jathakaya**. Built with React, Vite, and Tailwind CSS, this project provides a modern web-based experience featuring synchronized audio, Buddhist flag-colored LED lighting animations, and a live community chat.

## ✨ Features

- 🏮 **Interactive Digital Thorana:** A beautifully crafted central pandol interface displaying the scenes of the Jataka story.
- 📖 **Narrative Scene Progression:** Clickable scenes that transition to detailed story pages with synchronized voice narration and background music.
- 💡 **Dynamic LED Lighting:** Authentic animated lighting effects simulating a real Thorana, cycling through the colors of the Buddhist flag (Blue, Yellow, Red, White, Orange).
- 💬 **Real-Time Live Chat:** A Facebook-style live chat integration allowing visitors to send wishes and comments, powered by MongoDB and Vercel Serverless Functions.
- 🎵 **Immersive Audio Experience:** Background music and scene-specific narrations with global mute/unmute controls.
- 📱 **Fully Responsive & Mobile Optimized:** Specifically optimized for landscape viewing on mobile devices to ensure the best possible experience.
- 🎬 **Automated Credits Sequence:** A cinematic credits roll that automatically triggers upon completing the final story scene.

## 🛠️ Technology Stack

- ⚛️ **Frontend:** React 19, Vite, Tailwind CSS v4
- ⚙️ **Backend/API:** Vercel Serverless Functions (Node.js)
- 🍃 **Database:** MongoDB Atlas (for storing live chat messages)
- 🎨 **Icons:** Custom SVG and UI components
- ☁️ **Deployment:** Vercel

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- 🟢 [Node.js](https://nodejs.org/en/) (v18 or higher recommended)
- 📦 npm or yarn
- 🗄️ A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (for the live chat feature)

### Installation

1. 📥 **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/maha-mayura-jathakaya.git
   cd maha-mayura-jathakaya
   ```

2. 📦 **Install dependencies:**
   ```bash
   npm install
   ```

3. 🔐 **Set up Environment Variables:**
   Create a `.env` file in the root directory and add your MongoDB connection string:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/?retryWrites=true&w=majority
   ```

4. 🚀 **Start the development server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.


## 📜 Credits

This digital Thorana was made possible through the use of various resources and the inspiration of traditional Buddhist literature.

- 👨‍💻 **Concept, Developer & Designer:** [Nugitha Disas](https://github.com/nugi29)
- 📚 **Narrative & Content:** පන්සීය පනස් ජාතක පොත (Pansiya Panas Jathaka Potha)
- 🎙️ **Story Voice & Audio Source:** [අප දකින ලෝකය | Apa Dakina Lokaya (YouTube Channel)](https://www.youtube.com/@apadakinnalokaya)
- 🎶 **Background Music:** [GeemathBeats (YouTube Channel)](https://www.youtube.com/watch?v=c5DlIdv9lhc)
- 🖼️ **Digital Assets:** Sourced via Google Images
- 🙏 **Special Thanks:** The open-source community and all devotees who support the preservation of Dhamma.


## 🙏 A Note on Purpose

This project exists to honour a tradition, preserve a story, and share the light of the Dhamma with anyone who encounters it — regardless of where they are in the world.

> *"May all beings be happy. May all beings be at peace."*

Please ensure any reuse or adaptation of this project respects the cultural and religious significance of the content it carries.

---

<div align="center">

*Sadhu · Sadhu · Sadhu*

</div>






