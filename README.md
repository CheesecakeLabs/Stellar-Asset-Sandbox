# Cheesecake Stellar Token Factory - V2

Cheesecake Stellar Token Factory - V2 is a multifaceted system, designed to enable the creation, management, and trading of Stellar-based tokens. The version 2 architecture leverages a blend of cutting-edge technologies to offer a scalable, secure, and user-friendly solution.

## Components

- **Postgres:** Utilized as the primary relational database for all structured data management needs.
- **Apache Kafka:** Deployed as a distributed event store to enable real-time data processing and insights.
- **UI for Apache Kafka:** An intuitive open-source web UI that provides detailed monitoring and management functions for Apache Kafka clusters.
- **Frontend:** A sleek and interactive React Web application offering a front-facing user interface.
- **Backend:** A Golang backend handling the business logic, encompassing everything from API endpoints to core Stellar token functionalities.
- **Starlabs:** A specialized Stellar service, integrated as a git submodule and written in Go, to further enrich the platform's capabilities.
- **KMS:** The CKL Key Management Service (KMS), also a git submodule in Go, safeguarding the security of cryptographic keys and other sensitive data.

### Topics

Further details on the various functionalities, system requirements, and guides to set up and use the Cheesecake Stellar Token Factory - V2 can be found in the following sections:

- [Development Environment with Makefile](#development-environment-with-makefile)
  - [Development Environment](#development-environment)

## Development Environment with Makefile

The Makefile included in the project simplifies the development environment management using Docker Compose, providing a collection of easy-to-use commands tailored for the Cheesecake Stellar Token Factory - V2 development workflow.

### Build and Start All Services

```bash
make dev-up-all
```

### Build and Start Individual Services

You can build and start individual services by appending the service name to `make dev-up-starlabs:`. For example:

- Starlabs: `make dev-up-starlabs`
- Tests: `make dev-up-tests`
- Kafka: `make dev-up-kafka`
- Backend: `make dev-up-backend`
- Frontend: `make dev-up-frontend`

### Stop All Services (Development Backend)

```bash
make dev-stop
```

### Stop and Remove Volumes (Development Backend)

**Warning**: This command will delete all data in your development environment.

```bash
make dev-destroy
```

These commands streamline the process of building, starting, and managing the development environment, allowing developers to concentrate on coding. Customize the `dev.docker-compose.yml` file to adapt the configuration of the Docker containers to your specific requirements.
