# Jeevo: Blood Donation Management Platform — Project Synopsis & System Documentation

## 1. Project Synopsis

### Background
Maintaining an adequate and safe blood supply is a critical healthcare challenge worldwide. Traditional blood donation systems often struggle with fragmented communication, manual record-keeping, and slow response times during emergencies. 

### Purpose & Objectives
**Jeevo** is a modern, full-stack web application designed to bridge the gap between blood donors, hospitals, and blood banks. The platform streamlines the entire blood donation lifecycle, ensuring rapid allocation during emergencies and incentivizing regular donations through gamification.

The main objectives are:
1. **Real-time Matching:** Instantly notify eligible donors based on geographic location and blood group compatibility.
2. **Simplified Inventory Management:** Allow hospitals to manage blood stock dynamically.
3. **Gamification & Rewards:** Encourage recurring donors through point systems, ranks, and achievements.
4. **Enhanced Security & Accountability:** Through Role-Based Access Control (RBAC) and verification protocols for both donors and hospitals.

### Scope
The platform provides three main portals:
- **Donor Portal:** Profile management, matching alerts, and donation tracking.
- **Hospital Portal:** Request broadcasting, inventory tracking, and blood collection verification.
- **Admin Portal:** Overall platform moderation, verifications, and analytical dashboards.

---

## 2. Platform Features

### User & Donor Features
- **Profile Registration & Health Screening:** Donors can securely register and complete an eligibility health declaration (weight, hemoglobin, conditions).
- **Gamified Rewards:** Donors earn points, badges (e.g., "Hero", "Platinum"), and progress through ranks based on volume and frequency of donations.
- **Automated Eligibility Tracking:** The system calculates biological wait periods (e.g., 90 days after whole blood donation) and enforces them automatically.
- **Push & Email Notifications:** Instant alerts when nearby hospitals raise critical/emergency matches for their blood type.

### Hospital & Blood Bank Features
- **Urgent Broadcasts:** Create blood requests categorized by urgency (Normal, Urgent, Critical, Emergency) to immediately blast nearby donors.
- **Inventory & Capacity Management:** Real-time visibility into overall hospital capacity (total beds, blood center limits) and matching status.
- **Donation Verification:** Hospital staff manage the end-to-end donation workflow: screening, phlebotomy, and issuing completion signals to update the donor's record.

### System & Admin Features
- **Intelligent Matching Algorithm:** Considers geolocation (distance to hospital) and exact ABO/Rh compatibility formulas.
- **Role-Based Access Control (RBAC):** Tight controls ensuring hospital staff, users, donors, and admins have distinct authorization ceilings.
- **Analytics & Reporting:** View counts, response rates, priority scores, and live status history for every request.

---

## 3. How It Works

1. **Onboarding:** A user registers and either becomes a *Donor* by providing detailed health criteria, or a *Hospital* by uploading verification documents (licenses, registrations).
2. **Emergency Triggering:** A verified Hospital creates a `BloodRequest` (specifying blood group, components, expected deadline, and urgency).
3. **Filtering & Broadcast:** The system calculates a `priorityScore`. It geometrically queries the DB (`2dsphere`) to find eligible, available donors within the hospital's radius whose blood type matches.
4. **Notification:** Matched donors receive alerts across SMS/Email.
5. **Commitment & Collection:** A donor accepts the request, schedules an appointment, and visits the hospital. Post-donation, the hospital updates the `Donation` status to `completed`, automatically triggering the donor’s reward cycle and adjusting the hospital's request `unitsFulfilled`.

---

## 4. System Architecture & Deployment Structure

Jeevo is built on the **MERN Stack** (MongoDB, Express, React, Node.js). 
The deployment relies on modern cloud-native architectures:
- **Client (Frontend):** Deployed effortlessly on **Vercel**, benefiting from edge-networking, dynamic CDN, and seamless CI/CD.
- **Server (Backend):** Deployed on **Render** utilizing scalable Web Services to host the Express API payload handling.
- **Database:** Hosted on **MongoDB Atlas**, structured using Mongoose ORM utilizing GeoJSON indexing for map radii logic.

### 4.1 Deployment Diagram

```mermaid
flowchart TD
    %% End Users
    Users[Client Devices / Browsers]
    
    %% Vercel Frontend
    subgraph Vercel Cloud [Vercel Cloud]
        Frontend[React SPA Frontend]
    end
    
    %% Render Backend
    subgraph Render Cloud [Render Cloud]
        Backend[Node.js / Express API]
    end
    
    %% Database Engine
    subgraph DB [Database Provider]
        MongoDB[(MongoDB Atlas Cloud)]
    end
    
    %% Third Party Connectors
    subgraph External [Third Party Services]
        Email[Nodemailer / SMTP]
        Geocoding[Location / Maps API]
    end

    Users <-->|HTTPS| Frontend
    Frontend <-->|REST API JSON| Backend
    Backend <-->|Mongoose Driver / TCP| MongoDB
    Backend -.->|Sends Auth/Alert| Email
    Backend -.->|Resolves Address| Geocoding
```

---

## 5. Unified Modeling Language (UML) Diagrams

### 5.1 Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    USER ||--o| DONOR_PROFILE : "creates"
    USER ||--o| HOSPITAL : "manages"
    HOSPITAL ||--o{ BLOOD_REQUEST : "broadcasts"
    DONOR_PROFILE ||--o{ DONATION : "commits to"
    BLOOD_REQUEST ||--|{ DONATION : "fulfilled by"

    USER {
        ObjectId _id
        String email
        String role
        Point location
    }
    
    DONOR_PROFILE {
        ObjectId user_id
        String bloodGroup
        Int points
        Date nextEligibleDate
    }
    
    HOSPITAL {
        ObjectId user_id
        String registrationNumber
        Point location
        Array servicesOffered
    }
    
    BLOOD_REQUEST {
        String bloodGroup
        String urgency
        Int unitsRequired
        Date requiredBy
    }
    
    DONATION {
        ObjectId donorProfile
        ObjectId hospital
        String status
        Int volumeCollected
    }
```

### 5.2 Data Flow Diagram (DFD) - Level 0 (Context Level)

```mermaid
flowchart TD
    Donor[/Donor Entity/]
    Hospital[/Hospital Entity/]
    System((Jeevo\nCore System))
    Admin[/Admin Entity/]
    
    Donor -->|Registration Form, Blood Profile| System
    System -->|Alerts, Donation Tokens, Rewards| Donor
    
    Hospital -->|Hospital Info, Urgent Demands| System
    System -->|Matching Donors, Real-time Stats| Hospital
    
    Admin -->|Verification approvals| System
    System -->|Analytics, Flags| Admin
```

### 5.3 Data Flow Diagram (DFD) - Level 1

```mermaid
flowchart LR
    Donor[/Donor/]
    Hospital[/Hospital/]
    
    subgraph Jeevo Processes
        ProfileP((1.0 Profile\nManagement))
        RequestP((2.0 Request&\nAlgorithm))
        DonationP((3.0 Lifecycle\nTracking))
    end
    
    DB[(Jeevo Databases)]
    
    Donor -->|Updates Health Info| ProfileP
    ProfileP <--> DB
    
    Hospital -->|Raises Demand| RequestP
    RequestP <--> DB
    RequestP -->|Distance/Type Match| Donor
    
    Donor -->|Pledges Blood| DonationP
    Hospital -->|Marks Success| DonationP
    DonationP <--> DB
    DonationP -.->|Updates Ranks| ProfileP
```

### 5.4 Data Flow Diagram (DFD) - Level 2 (Decomposition of Request Matching)

```mermaid
flowchart TD
    Hospital[/Hospital/]
    Donor[/Eligible Donor/]
    
    Proc1((2.1 Validate\nRequest Data))
    Proc2((2.2 Calc Priority\nScore))
    Proc3((2.3 Geo-Spatial\nQuerying))
    Proc4((2.4 Dispatch\nEngine))
    
    DB1[(Hospital DB)]
    DB2[(Donor Profile DB)]
    DB3[(Active Requests DB)]

    Hospital -->|Submit Form| Proc1
    Proc1 <--> DB1
    Proc1 -->|Valid Data| Proc2
    Proc2 -->|Score Assigned| Proc3
    Proc3 <-->|Check GeoJSON| DB2
    
    Proc3 -->|Matching Matrix| Proc4
    Proc4 -->|Store Pending State| DB3
    Proc4 -->|Multi-Channel Alert| Donor
```
