# Use the official Microsoft SQL Server image
FROM mcr.microsoft.com/mssql/server:2019-CU8-ubuntu-18.04

# Set environment variables
ENV ACCEPT_EULA=Y
ENV SA_PASSWORD=Aa123456

# Copy the setup script to the container
COPY setup.sql /usr/src/app/setup.sql

# Run the SQL Server and initialize the database
CMD /opt/mssql/bin/sqlservr & sleep 30 && /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P "Aa123456" -i /usr/src/app/setup.sql && tail -f /dev/null
