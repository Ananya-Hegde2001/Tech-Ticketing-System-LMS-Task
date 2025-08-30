-- Users (passwords are plaintext here for demo, but backend will check equality in mock)
INSERT INTO users (name, email, password_hash, role) VALUES
('Admin User', 'admin@example.com', 'password123', 'ADMIN'),
('Employee One', 'employee1@example.com', 'password123', 'EMPLOYEE'),
('Employee Two', 'employee2@example.com', 'password123', 'EMPLOYEE'),
('Resolver One', 'resolver1@example.com', 'password123', 'RESOLVER');

-- Tickets
INSERT INTO tickets (title, description, created_by, assigned_to, priority, deadline, status)
VALUES
('Printer not working', 'The office printer jams frequently.', 2, 4, 'HIGH', CURRENT_DATE + INTERVAL '3 day', 'OPEN'),
('VPN access issue', 'Unable to connect to VPN from home network.', 3, NULL, 'MEDIUM', CURRENT_DATE + INTERVAL '7 day', 'OPEN');
