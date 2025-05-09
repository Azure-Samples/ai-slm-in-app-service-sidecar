---
page_type: sample
languages:
- dotnet
- python
- javascript
- java
- bicep
- html
products:
- azure
- azure-app-service
urlFragment: ai-slm-in-app-service-sidecar
name: Tutorial sample - Run a local SLM in a sidecar container in Azure App Service
description: Contains sample projects that demonstrate how to run a local small language model in a sidecar container within Azure App Service.
---

# Tutorial Sample - Run a Local SLM in a Sidecar Container in Azure App Service

This repository contains sample projects that demonstrate how to run a local small language model (SLM) in a sidecar container within Azure App Service. The project includes:

## Project Overview

This repository demonstrates two key use cases for AI sidecar containers in Azure App Service:

- **Prebuilt AI Sidecar Extensions** (located in `use_sidecar_extension/`):
   - This directory contains multiple applications that demonstrate how to integrate with existing AI sidecar extensions.
   - Examples include:
     - `dotnetapp/`: A .NET chatbot application. For more information, see [Tutorial: Run chatbot in App Service with a Phi-3 sidecar extension (ASP.NET Core)](https://learn.microsoft.com/azure/app-service/tutorial-ai-slm-dotnet).
     - `expressapp/`: A Node.js Express chatbot application. For more information, see [Tutorial: Run chatbot in App Service with a Phi-3 sidecar extension (Express.js)](https://learn.microsoft.com/azure/app-service/tutorial-ai-slm-expressjs).
     - `fastapiapp/`: A Python FastAPI chatbot application. For more information, see [Tutorial: Run chatbot in App Service with a Phi-3 sidecar extension (FastAPI)](https://learn.microsoft.com/azure/app-service/tutorial-ai-slm-fastapi).
     - `springapp/`: A Java Spring Boot chatbot application. For more information, see [Tutorial: Run chatbot in App Service with a Phi-3 sidecar extension (Spring Boot)](https://learn.microsoft.com/azure/app-service/tutorial-ai-slm-spring-boot).

1. **Custom SLM Sidecar Container** (located in `bring_your_own_slm/`):
   - The `src/phi-3-sidecar/` directory contains the FastAPI back-end and its Dockerfile for hosting a custom SLM.
   - The `src/webapp/` directory contains a .NET chatbot frontend that interacts with the custom SLM.

## Contributing

We welcome contributions! Please see the [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines.

## License

This project is licensed under the MIT License. See the [LICENSE.md](LICENSE.md) file for details.

## Resources

- [Azure Developer CLI Documentation](https://learn.microsoft.com/azure/developer/azure-developer-cli/overview)

