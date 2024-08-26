# Auth server

The auth service is responsible for handling accounts and handing out JWTs upon successful authentication.

## Generate RS256 key pairs

The JWT issued by the API is signed using the RS256 algorithm (an asymmetric cryptographic method) with a private key. The corresponding public key is used to verify the token on another server(item server).
