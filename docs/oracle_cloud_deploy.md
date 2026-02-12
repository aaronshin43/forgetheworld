# Oracle Cloud Infrastructure (OCI) Free Tier Deployment Guide

This guide provides a **detailed, step-by-step** explanation of how to deploy your game server on **Oracle Cloud Free Tier** and protect it with password authentication.

---

## 0. Prerequisites

1.  **Oracle Cloud Account**: A Free Tier account is required.
2.  **SSH Key Pair (.pem or .ppk)**:
    -   It is recommended to **download a new key pair** when creating the instance.
    -   Store the downloaded key file (`ssh-key-xxxxx.key`) in a safe location.
3.  **SSH Client**:
    -   Windows users can use **PowerShell** (built-in) or **PuTTY**.

---

## 1. Create an Instance (Virtual Server)

1.  **Log in**: Sign in to the [Oracle Cloud Console](https://cloud.oracle.com/).
2.  **Navigate**:
    -   Click the hamburger menu (≡) in the top-left corner -> **Networking** -> **Virtual Cloud Networks**.
    -   **Important**: Click **"Start VCN Wizard"** -> Select **"Create VCN with Internet Connectivity"** -> Click **Start VCN Wizard**.
    -   **VCN Name**: Enter `game-vcn` and click **Next** -> **Create**. (This automatically sets up internet gateways and routing).
3.  **Create Instance**:
    -   Go to Menu -> **Compute** -> **Instances** -> Click **"Create instance"**.
4.  **Configuration**:
    -   **Name**: `forgetheworld-server` (or your preferred name).
    -   **Image and Shape**:
        -   Click **Change Image** -> Select **Canonical Ubuntu** -> **22.04** or **24.04**.
        -   Click **Change Shape**:
            -   **Recommended (Fast)**: **Ampere** -> `VM.Standard.A1.Flex` (Always Free). Set OCPUs to 4 and Memory to 24GB.
            -   **Alternative (Slow)**: **AMD** -> `VM.Standard.E2.1.Micro` (Always Free). Choose this only if Ampere is out of stock.
    -   **Networking**:
        -   Select **"Select existing virtual cloud network"**.
        -   **Virtual cloud network in ...**: Select the `game-vcn` you created in step 2.
        -   **Subnet**: Select `Public Subnet-game-vcn`.
        -   Ensure **"Assign a public IPv4 address"** is checked.
    -   **Add SSH keys**:
        -   Select **"Generate a key pair for me"** -> Click **"Save private key"** to download the `.key` file. (**Do not lose this file!**)
    -   **Boot Volume**: Keep default (50GB).
5.  **Finish Creation**:
    -   Click **Create**.
    -   Wait a few minutes until the state turns **Running** (Green).
    -   Note down the **Public IP Address**. (e.g., `123.45.67.89`)

---

## 2. Open Firewall Ports (Ingress Rules)

This step configures the cloud-level firewall in the Oracle Cloud Console.

1.  On the Instance details page, locate the **Primary VNIC** section.
2.  Click the **Subnet** link (e.g., `subnet-2023...`).
3.  Under **Security Lists**, click **Default Security List for...**.
4.  Click **Add Ingress Rules**.
5.  Enter the following details to add a rule:
    -   **Source CIDR**: `0.0.0.0/0` (Allow access from anywhere)
    -   **IP Protocol**: TCP
    -   **Destination Port Range**: `80, 443, 8000, 3000`
        -   `80`: HTTP
        -   `443`: HTTPS (for future use)
        -   `3000`: Frontend (Game Client)
        -   `8000`: Backend API (if needed)
    -   **Description**: Game Server Ports
6.  Click **Add Ingress Rules** to save.

---

## 3. Server Connection & Initial Setup

Open **PowerShell** on Windows and connect to your server.

1.  **SSH Connection** (Requires the downloaded `.key` file):
    ```powershell
    # Example: ssh -i "C:\Users\Name\Downloads\ssh-key.key" ubuntu@123.45.67.89
    ssh -i "path/to/your/private_key.key" ubuntu@<PUBLIC_IP_ADDRESS>
    ```
    -   Type `yes` when prompted `Are you sure you want to continue connecting?`.

2.  **Configure OS Firewall (iptables)**:
    Oracle Ubuntu images have restrictive iptables rules by default. Run the following commands one by one to open ports.

    ```bash
    # Open ports 80, 443, 3000, 8000
    sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
    sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
    sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 3000 -j ACCEPT
    sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 8000 -j ACCEPT
    
    # Save settings (Persistent after reboot)
    sudo netfilter-persistent save
    ```

3.  **Install Docker & Git**:
    ```bash
    # Update package list
    sudo apt update
    
    # Run Docker installation script
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    
    # Grant Docker permissions to the current user (ubuntu)
    sudo usermod -aG docker ubuntu
    
    # Logout and log back in to apply permission changes
    exit
    ```
    *(Reconnect using the `ssh` command)*

---

## 4. Deploy Game & Transfer Assets

**Important**: Since the game assets are not in the Git repository, you must transfer them from your local computer to the server manually using `scp`.

1.  **Clone Repository (On Server)**:
    After reconnecting to the server (`ssh ...`), run:
    ```bash
    git clone https://github.com/aaronshin43/forgetheworld.git
    cd forgetheworld
    ```

2.  **Transfer Assets (From Local Computer)**:
    Open a **NEW PowerShell window** (do not use the one connected to SSH), navigate to your project folder (`d:\03_Coding\forgetheworld`), and run:
    
    ```powershell
    # Run this on your LOCAL machine
    # Copy contents of local frontend/public to server's frontend/public
    scp -i "path/to/private_key.key" -r .\frontend\public\* ubuntu@<PUBLIC_IP_ADDRESS>:~/forgetheworld/frontend/public/
    ```
    *(This may take some time depending on upload speed)*

3.  **Set Password (.env) (On Server)**:
    Back in your SSH server terminal:
    ```bash
    nano frontend/.env
    ```
    
    Paste the following content (Change the password to your own):
    ```env
    BASIC_AUTH_USER=admin
    BASIC_AUTH_PASSWORD=your_secure_password
    NEXT_PUBLIC_API_BASE=http://<PUBLIC_IP_ADDRESS>:8000
    ```
    *(**Important**: Replace `<PUBLIC_IP_ADDRESS>` with your server's actual IP! e.g., `http://123.45.67.89:8000`)*

    -   **To Save**: Press `Ctrl + O` -> `Enter` -> `Ctrl + X`

4.  **Start Server (On Server)**:
    ```bash
    docker compose up --build -d
    ```
    -   The initial build might take 5-10 minutes on a Free Tier instance.

---

## 5. Verify Deployment

Open your browser and visit:
`http://<PUBLIC_IP_ADDRESS>:3000`

-   Enter the credentials (`admin` / `your_password`) when the login prompt appears.
-   If the game loads, deployment is successful!

## (Reference) Server Management

-   **Stop Server**: `docker compose down`
-   **Restart Server**: `docker compose up -d`
-   **View Live Logs**: `docker compose logs -f`
-   **Update Code** (git pull -> rebuild):
    ```bash
    git pull
    docker compose up --build -d
    ```
## 6. HTTPS Setup (Automatic SSL with Caddy)

We will use **Caddy** as a reverse proxy to automatically handle SSL certificates (Let's Encrypt) and serve your site via HTTPS.

### 1. Update Code & Config

Run `git pull` to fetch the updated `docker-compose.yml` and `Caddyfile`.

### 2. Configure Domain

Open the `Caddyfile` on your server and ensure your domain is correct.

```bash
nano Caddyfile
```

Make sure it looks like this (replace with your actual email):

```caddyfile
{
    email your-email@example.com
}

forgetheworld.duckdns.org {
    reverse_proxy frontend:3000
    
    # Proxy API calls to backend
    handle /api/* {
        reverse_proxy backend:8000
    }
    handle /docs* {
        reverse_proxy backend:8000
    }
    handle /openapi.json {
        reverse_proxy backend:8000
    }
}
```

### 3. Open Port 443

HTTPS uses port 443. Open it in the server firewall.

```bash
# Open port 443
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
sudo netfilter-persistent save
```

*(Ensure Port 443 is also open in the Oracle Cloud VCN Security List, just like you did for Port 80).*

### 4. Restart Containers

```bash
docker compose down
docker compose up -d --build
```

Wait a few moments for Caddy to obtain the certificate. You can now access your game securely.

### 5. Update Frontend Environment Variables (Important!)

To fix "Mixed Content" errors (browser blocking insecure HTTP API calls), you must update the frontend to use the HTTPS URL.

1.  Edit `frontend/.env` on the server:
    ```bash
    nano frontend/.env
    ```

2.  Update `NEXT_PUBLIC_API_BASE`:
    ```env
    # OLD: http://<IP>:8000
    # NEW: Use your domain (no port)
    NEXT_PUBLIC_API_BASE=https://forgetheworld.duckdns.org
    ```

3.  Save and Exit (`Ctrl+O`, `Enter`, `Ctrl+X`).

4.  **Rebuild Frontend**:
    ```bash
    docker compose up -d --build frontend
    ```

