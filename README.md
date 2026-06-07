# OpenAI Integration with NestJS

This project is intended to practice integrating the OpenAI API. The goal is to build a chatbot capable of answering questions and generating text.

# Key Features
- Custom REST API integrated with the OpenAI API
- User interface for sending prompts
- Simple chat that responds only to the user's message
- Context-aware chat using a predefined conversation context

## Technologies Used

- [ ✓ ] Nestjs
- [ ✓ ] Typescript
- [  ] React
- [  ] TailwindCSS

## Technical Decisions

Since this repository is intended to demonstrate OpenAI API integration, some features have been intentionally simplified.

### Context Management
Conversation context is handled internally, meaning there is no chat persistence.

To keep the example simple, the context is sent together with each user message using system and assistant roles to simulate conversation history.

In the future, Redis could be introduced to store conversation summaries and recent messages, allowing the application to maintain context more efficiently while avoiding token limit issues.

### Configuration
A .env file is used to define the OpenAI API key and the model to be used.

### Development Environment
Docker is used to provide a consistent development environment and simplify project setup.

### Testing
Each feature includes its own unit tests to ensure reliability and maintainability.
    



