# Shop Auth Server

This server is responsable for authentication, sending emails, redirecting after payment, following is the procedure of the shop of `new-ag-01` repository (FE app).

### Client Request for Code:
- Client sends an email to the server.
- Server generates a code, sends it via email, and stores the email and code pair in the in-memory map with a 15-minute timeout.
### Client Authorization Request:
- After receiving the code, the client sends another request with the email and code.
- The server checks if the email and code combination exist in the map (to verify the client's identity and authenticity).
### JWT Creation:
- If the email and code match, the server creates a JWT containing claims like the email and an expiration time (15 minutes from now).
### JWT Response:
- The server sends the JWT back to the client.
### Client Requests:
- The client includes the JWT in the Authorization header of subsequent requests.
### Server Authorization:
- For each request, the server checks the JWT in the Authorization header.
- It verifies the signature and expiration time of the token. If the token is valid and not expired, the request is authorized.