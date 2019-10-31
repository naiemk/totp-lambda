# TOTP Lambda

This repo has all necessary to have a Google authenticator solution
setup on AWS lambda.

## Folders

- **client** Typescript client for TOTP
- **server** Server code using Ferrum Network aws-lambda-handler
- **uxComponent** A react component using the TotpClient above

## Security

Server uses secret based security. I.e. a hardcoded secret

**Note: this is not suitable for production**

## Tasks

Refer to the github issues for tasks
