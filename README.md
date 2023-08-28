# Cheesecake Stellar Token Factory - V2

The Cheesecake Stellar Token Factory - V2 is a comprehensive system designed for the creation and management of Stellar-based tokens. Its second version architecture combines advanced technologies to deliver a scalable, secure, and user-friendly platform.

## Components

- **Postgres:** Our primary relational database for structured data management.
- **Apache Kafka:** A distributed event store for real-time data processing and insights.
- **UI for Apache Kafka:** An open-source web UI offering in-depth monitoring and management capabilities for Apache Kafka clusters.
- **Frontend:** An interactive React Web application for a user-friendly experience.
- **Backend:** A Golang backend that manages business logic, ranging from API endpoints to core Stellar token functions.
- **Starlabs**: An exclusive Stellar service, integrated as a git submodule and written in Go. It centralizes Stellar network interactions, enhancing platform capabilities and ensuring consistent communication.
- **KMS:** The CKL Key Management Service (KMS) safeguards cryptographic keys and other sensitive data.

### Topics

For further details on functionalities, system requirements, and setup guides, refer to:

- [Development Environment with Makefile](#development-environment-with-makefile)
- [API Documentation](#api-documentation)
- [Kafka Topics & Communication Flows](#kafka-topics--communication-flows)

## Development Environment with Makefile

Our Makefile, in conjunction with Docker Compose, offers a set of commands to simplify the development workflow.

### Build and Start All Services

```bash
make dev-up-all
```

### Build and Start Individual Services

Invoke individual services using `make dev-up-[service-name]`:

- Starlabs: `make dev-up-starlabs`
- Tests: `make dev-up-tests` (Note: This command will execute tests and then exit.)
- Kafka: `make dev-up-kafka`
- Backend: `make dev-up-backend`
- Frontend: `make dev-up-frontend`

### Stop All Services

```bash
make dev-stop
```

### Reset Development Environment

**Warning**: This action deletes all data in the development environment.

```bash
make dev-destroy
```

Modify the `dev.docker-compose.yml` file to adjust the Docker container configurations to your preferences.

> **Note**: Ensure the `dev-env.sh` script is executable: `chmod +x dev-env.sh`.

### **API Documentation**

The backend features Swagger documentation for an interactive overview and testing of the API endpoints.

#### Access the Swagger UI:

Navigate to [http://localhost:8080/v1/swagger/index.html](http://localhost:8080/v1/swagger/index.html) for detailed insights into each API route.

### **Kafka Topics & Communication Flows**

Apache Kafka plays a vital role in the Cheesecake Stellar Token Factory - V2 by enabling asynchronous data processing and efficient communication among components. Below are key Kafka topics and their communication pathways:

#### **Backend to Stellar KMS**:

- **`generateKeypair`**:
  - **Purpose**: Generate a new Stellar key pair.
  - **Usage**: Triggered when a new key pair is required.

#### **Stellar KMS to Backend**:

- **`generatedKeypairs`**:
  - **Purpose**: Announce a newly generated key pair.
  - **Usage**: Used after a key pair is stored securely.

#### **Backend to Starlabs**:

- **`createEnvelope`**:

  - **Purpose**: Handle transaction envelope creation.
  - **Usage**: Process messages detailing transactions for envelope generation.

- **`horizonRequest`**:
  - **Purpose**: Manage GET requests to the Stellar Horizon server.
  - **Usage**: Fetch account or transaction details.

#### **Starlabs to KMS**:

- **`signEnvelope`**:
  - **Purpose**: Handle transaction envelope signing requests.
  - **Usage**: Process unsigned transaction envelopes awaiting signatures.

#### **KMS to Starlabs**:

- **`signedEnvelopes`**:
  - **Purpose**: Communicate signed transaction envelopes.
  - **Usage**: Services monitoring signed envelopes use this topic.

#### **Starlabs to Backend**:

- **`horizonResponse`**:

  - **Purpose**: Relay Stellar Horizon server responses.
  - **Usage**: Communicate fetched account data and other Horizon responses.

- **`submitResponse`**:
  - **Purpose**: Report transaction results from the Stellar network.
  - **Usage**: Communicate transaction results.
