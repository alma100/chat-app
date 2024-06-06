#!/bin/bash



dotnet chat-HTTP-server.dll 

# Add any additional commands you want to run here

# Keep the container running
exec "$@"