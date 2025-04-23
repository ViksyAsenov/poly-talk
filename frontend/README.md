# PolyTalk - Frontend

This is the frontend user interface for the PolyTalk chat application. It's built with React and TypeScript, providing users with an interface to chat with while breaking the language barriers, manage their profile and friends, and interact with the real-time features powered by the backend.

## Features

- **User Authentication:** Google Sign-in flow integration.
- **Profile Management:** View and update display name and preferred language for translation.
- **Friend Management:** Add friends by tag, view friend list, manage incoming/outgoing friend requests, remove friends.
- **Conversation Management:** View list of conversations (direct and group), create new group conversations.
- **Chat Interface:** Real-time display of messages, automatic translation display based on user preference, send messages, delete your own messages (or others if you are an admin).
- **Group Chat Features:** View group info, leave group, change group name (admin), add/remove participants (admin), promote/demote admins (admin), delete group (admin).
- **Real-time Updates:** Uses Socket.IO to receive new messages and updates instantly.
- **Responsive Design:** Adapts to different screen sizes (desktop/mobile).
- **Theming:** Light/Dark mode toggle.
- **Notifications:** User feedback via `react-hot-toast`.

## Technology Stack

- **Framework/Library:** React (v19+)
- **Language:** TypeScript
- **State Management:** Zustand
- **Routing:** React Router DOM (v7+)
- **HTTP Client:** Axios
- **Real-time Communication:** Socket.IO Client
- **Styling:** Tailwind CSS
- **UI Components:** Lucide React (Icons)
- **Build Tool:** Create React App (react-scripts)
- **Date Formatting:** date-fns

## Prerequisites

- Node.js
- npm
- A running instance of the PolyTalk backend

## Getting Started

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/ViksyAsenov/poly-talk
    cd poly-talk/frontend
    ```

2.  **Install Dependencies:**

    ```bash
    npm install
    ```

3.  **Environment Configuration:**

    - Create a `.env` file in the `poly-talk/frontend` directory by copying the `.env.example` file.
    - Fill in the required environment variables. Essential variables include:
      - `API_URL`: The PolyTalk backend http url.
      - `API_URL`: The PolyTalk backend websocket url.

## Available Scripts

- **`npm start`**:
  Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) (or the specified port) to view it in the browser. The page will reload if you make edits. You will also see any lint errors in the console. Requires the backend server to be running.

- **`npm run build`**:
  Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

## Running the Frontend

1.  Make sure the PolyTalk backend is running and accessible at the configured URL.
2.  Start the frontend development server:
    ```bash
    npm start
    ```
3.  Open your browser and navigate to `http://localhost:3000`
