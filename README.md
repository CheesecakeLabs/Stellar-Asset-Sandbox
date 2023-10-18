<!-- PROJECT LOGO -->
<br  />
<p  align="center">
<img  width="50%"  src="https://images.sympla.com.br/5d11137d98ce3.png"  alt="Logo">
</p>

# Stellar Asset Sandbox

Brought to you by Cheesecake Labs and proudly supported by the Stellar
Development Foundation, this sandbox is your gateway to
enterprise-grade token management. Dive deep into the core
functionalities of the Stellar network, specifically tailored for
asset issuance.

Stellar Asset Sandbox is composed by:

- [Postgres](https://www.postgresql.org/): relational database
- [Apache Kafka](https://kafka.apache.org/): Distributed event store
- [UI for Apache Kafka](https://github.com/provectus/kafka-ui): open-source web UI to monitor and manage Apache Kafka clusters
- [Frontend](./frontend/): Frontend service - React Web application
- [Backend](./backend/): Backend service - Go
- [Starlabs](./starlabs/): Starlabs service (git submodule) - Go
- [KMS](./stellar-kms/): Stellar KMS service (git sobmodule) - Go

# Topics

- [Getting started](#getting-started)
  - [Requirements](#requirements)
  - [Docker Desktop Recommendations](#docker-desktop-recommendations)
  - [Git Submodules](#git-submodules)
  - [Running application locally](#running-application-locally)
  - [Kafka Topics & Communication Flows](#kafka-topics-&-communication-flows)
- [Features](#features)
  - [Role-based Access and Custody](#role-based-access-and-custody)
  - [Token Management in the Sandbox](#token-management-in-the-sandbox)
  - [Treasury Management in the Sandbox](#treasury-management-in-the-Sandbox)
  - [Dashboards: Insights at Your Fingertips](#dashboards-insights-at-your-fingertips)
  - [Role-based Access and Custody](#role-based-access-and-custody)
  - [Soroban: The Next Evolution (Coming Soon)](#soroban-the-next-evolution-coming-soon)

# Getting started

## Requirements

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Make](https://formulae.brew.sh/formula/make)

## Docker Desktop Recommendations

To run this project, there are some recommendations about the Docker Desktop resources configuration. You can find how to edit the resources settings [here](https://docs.docker.com/desktop/settings/mac/#resources).

- CPUs: 4
- Memory: 8GB

## Git Submodules

This project is using Git Submodules, that allow to keep a Git repository as a subdirectory of another Git repository. Currently, there is one submodule used in this project:

- [Starlabs](./starlabs/)
- [Stellar-KMS](./stellar-kms/)

### Pull

```bash
git submodule init
git submodule update
```

### Upgrade to latest version

```bash
git submodule update --remote
git add .
git commit -m "Upgrade to latest version"
```

### Upgrade to specific version

```bash
cd packages/starlabs
git checkout <version>
git add .
git commit -m "Upgrade to specific version"
```

## Running application locally

To start all the applications locally, follow these steps:

**1.** To change and override pre-defined environment variables, you can create a `.env` file in the `KEY=VALUE` pair format in the `backend` directory, so Docker can pass these environment variables to the running applications. Check the `.env.example` to see available environment variables.

**2.** Build and up the `Starlabs`, `KMS`, and `Postgresql` from the dockerfile in the project root folder:

```bash
$ docker-compose -f dev.docker-compose.yml --profile starlabs build
$ docker-compose -f dev.docker-compose.yml --profile starlabs up
```

**3.** Run the backend from the `backend` folder:

```bash
$ go run .
```

**4.** Run the frontend from the `frontend` folder:

```bash
$ make start_dev
```

**5.** Create the sponsor wallet (This must be the first wallet created in the database, necessarily with ID 1):

```bash
$ POST http://127.0.0.1:8080/v1/wallets
$ Body:
    {
      "type" : "sponsor"
    }
```

**6.** Fund the sponsor wallet:

```bash
$ POST http://127.0.0.1:8080/v1/wallets/fund
$ Body:
    {
      "id" : 1
    }
```

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

## Features

## Role-based Access and Custody

The Stellar Asset Issuance Sandbox automates the management of all
accounts and wallets involved in the process of asset creation and
treasury management. Users register with their email addresses and are
granted access to specific platform features based on their assigned
roles and permissions.

<b>Admins</b>: Have the authority to customize permissions and create new roles to fit different operational needs.

<b>Default Roles</b>: The platform comes with predefined roles such as Asset Manager and Treasurer, each with its set of permissions.

This role-based system is designed to demonstrate the various operational structures an asset issuance platform can adopt, serving as an educational example for enterprise solutions.

## Token Management in the Sandbox

The Stellar Asset Issuance Sandbox provides a comprehensive suite of
tools for token management, allowing Asset Managers to tailor tokens
to specific needs and operational structures:

<b>Token Creation</b>: Design tokens with distinct profiles and
characteristics, ensuring they align with your business objectives or
experimental goals.

<b>Supply Management</b>: Adjust the supply of your tokens with ease,
whether you need to mint new tokens or burn existing ones.

<b>Distribution</b>: Seamlessly distribute tokens to vaults within the
platform or to external Stellar accounts, facilitating a wide range of
transactional scenarios.

<b>Access Control</b>: Manage who can access and interact with your
tokens. Define and enforce permissions, ensuring that only authorized
entities can perform specific actions.

With these features, the sandbox offers a hands-on experience in
managing tokens on the Stellar network, demonstrating the flexibility
and potential of the platform.

## Treasury Management in the Sandbox

The Stellar Asset Issuance Sandbox introduces a robust treasury
management system, empowering treasurers with the tools they need to
efficiently handle assets:

<b>Vault Creation</b>: Treasurers can establish vaults, which serve as
abstract representations of Stellar accounts within the platform.

<b>Token Allocation</b>: Define which tokens a vault can hold,
ensuring compatibility and alignment with operational needs.

<b>Fund Transfers</b>: Vaults have the capability to send and receive
funds, facilitating transactions both with other vaults on the
platform and with external Stellar accounts.

<b>Transaction History</b>: Every transaction made by a vault is
meticulously recorded. Treasurers can easily track and review the
history of transactions, ensuring transparency and accountability.
Through these features, the sandbox provides a practical understanding
of how treasuries can be managed on the Stellar network, showcasing
the network's adaptability for diverse financial operations.

## Dashboards: Insights at Your Fingertips

The Stellar Asset Issuance Sandbox equips users with comprehensive
dashboards that illuminate both the overarching activity within the
platform and the intricate details of individual tokens.

Gain a bird's-eye view with insights into the overall transactions and
usage of the sandbox. These visual representations capture trends,
peaks, and patterns in asset transactions, offering a snapshot of the
broader dynamics at play. For those seeking a deeper dive, the
platform provides asset-specific charts that shed light on the
performance and utilization of each token created within the sandbox.
Users can explore metrics such as transaction volume, top holders, and
the current supply of each token, tracking any mints or burns to
understand supply dynamics over time.

With the Stellar Asset Issuance Sandbox dashboards, users are
empowered to make informed decisions, monitor the repercussions of
their actions, and delve into the Stellar network's prowess in asset management.

## Soroban: The Next Evolution (Coming Soon)

Prepare to unlock a new dimension of possibilities with the Stellar
network. We're excited to announce that the Stellar Asset Issuance
Sandbox will soon integrate features powered by Soroban, Stellar's
upcoming smart contracts platform.

Soroban promises to revolutionize the Stellar ecosystem by introducing
enhanced programmability, paving the way for more intricate and
diverse use cases to be constructed. With this integration, users will
be able to explore and experiment with the advanced functionalities
that smart contracts bring to the table, further expanding the
horizons of what's achievable on the Stellar network.

Stay tuned for this transformative update, as we continue our
commitment to providing the best educational and experimental platform
for Stellar enthusiasts and professionals alike.
