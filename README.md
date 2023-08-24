# Cheesecake Stellar Token Factory - V2

Cheesecake Stellar Token Factory - V2 is a multifaceted system, designed to enable the creation, management of Stellar-based tokens.
The version 2 architecture leverages a blend of cutting-edge technologies to offer a scalable, secure, and user-friendly solution.

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
- [API Documentation](#api-documentation)
- [Kafka Topics & Communication Flows](#kafka-topics--communication-flows)

## Development Environment with Makefile

The Makefile included in the project simplifies the development environment management using Docker Compose, providing a collection of easy-to-use commands tailored for the Cheesecake Stellar Token Factory - V2 development workflow.

### Build and Start All Services

```bash
make dev-up-all
```

### Build and Start Individual Services

You can build and start individual services by appending the service name to `make dev-up-starlabs`. For example:

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

### **API Documentation**

The backend is equipped with Swagger documentation to provide an interactive interface for understanding and testing the API endpoints.

#### Accessing the Swagger UI:

You can access the Swagger interface by navigating to:

[http://localhost:8080/v1/swagger/index.html](http://localhost:8080/v1/swagger/index.html)

Here, you'll find detailed information about each API route, including required parameters, request/response formats, and the ability to test the endpoints directly from the browser.
The Kafka Topics section you've provided gives a detailed flow between various components using Kafka topics. However, to make it more structured and improve readability, you can consider the following improvements:

### **Kafka Topics & Communication Flows**

Apache Kafka is instrumental in "Cheesecake Stellar Token Factory - V2" for facilitating asynchronous data processing and streamlining communication between various components. The following elucidates the primary Kafka topics and the flow of communication between associated services:

#### **Backend to Stellar KMS**:

- **`generateKeypair`**:
  - **Purpose**: Handles requests to generate a new Stellar key pair.
  - **Usage**: Whenever a component or service needs a new key pair, a message is produced to this topic.

#### **Stellar KMS to Backend**:

- **`generatedKeypairs`**:
  - **Purpose**: Announces the generation of a new key pair.
  - **Usage**: Once a key pair is produced and saved in secure storage, it's dispatched to this topic.

#### **Starlabs to KMS**:

- **`signEnvelope`**:
  - **Purpose**: Manages signing requests for transaction envelopes.
  - **Usage**: It receives the unsigned transaction envelope with the pertinent details needed for the signing process.

#### **KMS to Starlabs**:

- **`signedEnvelopes`**:
  - **Purpose**: Sends a signed transaction envelope.
  - **Usage**: Services, particularly those monitoring or processing signed envelopes, subscribe to this topic.

#### **Backend to Starlabs**:

- **`createEnvelope`**:

  - **Purpose**: Deals with transaction envelope creation requests.
  - **Usage**: This topic processes messages with details of transactions such as source, operations, and sponsor, in order to generate an envelope.

- **`horizonRequest`**:
  - **Purpose**: Manages any request destined for the Stellar Horizon server.
  - **Usage**: Typical requests include fetching account details or initiating transactions.

#### **Starlabs to Backend**:

- **`horizonResponse`**:

  - **Purpose**: Conveys responses from the Stellar Horizon server.
  - **Usage**: It relays data from fetched accounts, transaction submission outcomes, and all other responses from Horizon.

- **`submitResponse`**:
  - **Purpose**: Reports the outcome of transactions submitted to the Stellar network.
  - **Usage**: After submitting a transaction to the Stellar network, this topic communicates the result, be it a success or a failure.
