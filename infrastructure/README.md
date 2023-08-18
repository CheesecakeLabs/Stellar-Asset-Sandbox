# Infrastructure

This documentation has the objective to detail the infrastructure deployed to support the applications developed by **Cheesecake Labs**.

# Summary

- [Github](#github)
  - [Github Actions](#github---actions)

## GitHub

We are using GitHub as the code repository and we adopted the mono-repo strategy.

## GitHub - Actions

We are using GitHub Actions to do the CI/CD.

- **Deployments:**
  - **Production:**
    - **Frontend:** workflow_dispatch (Frontend - CI/CD)
    - **Backend:** workflow_dispatch (Backend - CI/CD)
    - **Starlabs:** workflow_dispatch (Starlabs - CI/CD)
    - **KMS:** workflow_dispatch (KMS - CI/CD)
- **Code Quality:**
  - **Frontend:** when PR are opened, reopened or synchronized and there are some files changed in `frontend/` directory
  - **Backend:** when PR are opened, reopened or synchronized and there are some files changed in `backend/` directory
  - **Starlabs:** when PR are opened, reopened or synchronized and `.gitmodules` file is changed
  - **KMS:** when PR are opened, reopened or synchronized and `.gitmodules` file is changed

We are using [GitHub Actions Environments](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment) to separate variables and secrets for each environment.
