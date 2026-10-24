# Image Gallery — React + TypeScript

A responsive image gallery built with React, TypeScript, and Tailwind CSS. Browse photos from the Unsplash API and manage your personal image collection.

## Features

- Fetch and display photos from the Unsplash API
- Search and filter images
- Upload and manage personal images
- Preview images in a modal
- Delete images from your personal collection
- Responsive layout for different screen sizes
- Loading and error states with retry functionality

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Unsplash API
- Lucide React

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/jamesroben29-coder/image-gallery-typescript.git
cd image-gallery-typescript
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the Unsplash API

Create a `.env` file in the project root and add your Unsplash Access Key:

```env
VITE_UNSPLASH_ACCESS_KEY=your_access_key_here
```

Replace `your_access_key_here` with your own key.

**Important:** Never commit your `.env` file or expose your API Secret Key. Vite variables prefixed with `VITE_` are included in client-side code, so the Access Key is visible to users in the browser. For production applications, consider using a backend proxy.

### 4. Start the development server

```bash
npm run dev
```

Open the local URL shown in your terminal.

## Build

```bash
npm run build
```

## Author

GitHub: [jamesroben29-coder](https://github.com/jamesroben29-coder)

## License

This project is for learning and portfolio purposes.