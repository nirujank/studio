```mermaid
erDiagram
    TENANT {
        string id PK "Tenant ID"
        string name "Name"
        string domain "Domain"
        string logo "Logo URL"
        string description "Description"
        string status "Status (Active/Inactive)"
    }

    STAFF {
        string id PK "Staff ID"
        string name "Name"
        string email "Email"
        string avatar "Avatar URL"
        string jobTitle "Job Title"
        string tenantId FK "Tenant ID"
        string status "Status (Active/Deactivated)"
    }

    PROJECT {
        string id PK "Project ID"
        string name "Name"
        string code "Project Code"
        string manager "Manager Name"
        string tenantId FK "Tenant ID"
    }

    PROJECT_ASSIGNMENT {
        string staffId PK,FK "Staff ID"
        string projectId PK,FK "Project ID"
        string role "Role"
        int allocation "Allocation %"
    }

    TIMESHEET_ENTRY {
        string id PK "Entry ID"
        string staffId FK "Staff ID"
        string projectId FK "Project ID"
        date date "Date"
        float hours "Hours"
        string payType "Pay Type"
    }

    TENANT ||--o{ STAFF : "employs"
    TENANT ||--o{ PROJECT : "owns"
    STAFF ||--|{ PROJECT_ASSIGNMENT : "is assigned to"
    PROJECT ||--|{ PROJECT_ASSIGNMENT : "has"
    STAFF ||--o{ TIMESHEET_ENTRY : "logs"
    PROJECT ||--o{ TIMESHEET_ENTRY : "for"
```

### Explanation of Relationships:

*   **TENANT** to **STAFF**: A `TENANT` can employ one or more `STAFF` members. (One-to-Many)
*   **TENANT** to **PROJECT**: A `TENANT` can own one or more `PROJECTS`. (One-to-Many)
*   **STAFF** to **PROJECT**: This is a many-to-many relationship, managed through the `PROJECT_ASSIGNMENT` entity.
    *   A `STAFF` member can be assigned to multiple `PROJECTS`.
    *   A `PROJECT` can have multiple `STAFF` members.
    *   The `PROJECT_ASSIGNMENT` entity holds details specific to that assignment, such as the staff member's `role` and `allocation` percentage.
*   **STAFF** and **PROJECT** to **TIMESHEET_ENTRY**:
    *   A `STAFF` member logs multiple `TIMESHEET_ENTRY` records.
    *   Each `TIMESHEET_ENTRY` is associated with a specific `PROJECT`.