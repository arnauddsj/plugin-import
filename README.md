# Vite vue / A Dynamic Plugin System for Vue3, Vite and a fastify server

## Overview
This project demonstrates how to implement a flexible plugin system in a Vue 3 application using TypeScript and Vite. The system is designed to allow for dynamic integration of commercial plugins into an open source project, extending the functionality of the core application without compromising its open-source integrity.


## Key Features

- **Dynamic Plugin Loading**: Plugins can be loaded at runtime, allowing for flexible expansion of the application's capabilities.
- **Server-side and Client-side Support**: The plugin system accommodates both backend and frontend extensions.
- **Route-based Plugins**: Easily add new pages or sections to the application through plugins.
- **Clear Separation**: Maintains a clear distinction between the open-source core and commercial plugins.

## Plugin Types

1. **Server-side Plugins**: Extend backend functionality
2. **Client-side Plugins**:
   - Functionality Plugins: Add new features or modify existing ones
   - Route-based Plugins: Add new pages or sections to the application

## Plugin Structure

Each plugin consists of:

- A manifest file (`manifest.json`) describing the plugin's properties and requirements
- Client-side code (for UI and frontend logic)
- Server-side code (for backend functionality, if applicable)

## Core Application

The core Client and Server are the open-source pieces and do not contain any proprietary code or placeholders for commercial plugins. They provide the foundational functionality of your app.

## Developing Plugins

To create a new plugin:

1. Create a new directory in the `plugins` folder
2. Create a `manifest.json` file describing your plugin
3. Implement the necessary client-side and/or server-side code
4. Use the plugin loader API to register your plugin with the core application

## Installation and Usage

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. To include plugins, use the appropriate build command (e.g., `npm run build:with-plugins`)

## Contributing

We welcome contributions to the core application and open-source plugins. Please read our `CONTRIBUTING.md` file for guidelines on how to submit contributions.

## License

This Dynamic Plugin System is licensed under the MIT License. See the `LICENSE` file for more details.
