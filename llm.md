# PROJECT: MPIL – PURCHASE, STORES, PRODUCTION, INVENTORY & SALES ERP

## 1. PROJECT OBJECTIVE

Develop a complete, production-ready ERP web application for Metallurgical Products (India) Private Limited using:

- Frontend: React.js + TypeScript

- Backend: Node.js + Express.js

- Database: MongoDB + Mongoose

- UI: Material UI with Tailwind CSS

- API: REST API

- Authentication: Secure JWT authentication with refresh tokens

The application must digitize the company's complete business operations, including Purchase, Stores, Raw Material, Quality Control, Production, Finished Goods, Laboratory, Sales, Dispatch and Accounts-related workflows.

The application must be dynamic and configurable. Employees, departments, designations, roles, permissions, approval hierarchies and transaction responsibilities must be manageable through the Admin Panel without changing source code.

IMPORTANT: Do not hardcode individual employees, approval names, departments or approval sequences.

---

# 2. LOGIN SYSTEM

Create a professional corporate login page.

Login screen should include:

- MPIL company logo

- Company name: Metallurgical Products (India) Private Limited

- Username / Employee ID

- Password

- Show/hide password

- Remember me

- Forgot password

- Login button

- Account security and session management

After login:

1. Identify the employee.

2. Identify their department.

3. Identify their designation.

4. Identify their assigned system roles.

5. Identify their permissions.

6. Display the dashboard and modules accessible to that employee.

7. Display pending approvals and assigned tasks.

Each employee must have a unique login account.

Administrators must be able to activate, deactivate, lock or reset employee accounts.

---

# 3. SUPER ADMIN PANEL – COMPLETE EMPLOYEE MANAGEMENT

Build a dedicated Employee & Organization Management module.

The Super Admin must be able to add unlimited employees.

Employee registration form:

- Employee ID (automatically generated or manually assigned)

- Full name

- Employee photograph

- Official email

- Mobile number

- Department

- Designation

- Reporting manager

- Date of joining

- Employment status

- Username

- Password / invitation

- Assigned roles

- Assigned permissions

- Approval authority

- Transaction responsibilities

Provide employee management functions:

- Add employee

- Edit employee

- View employee profile

- Activate / deactivate employee

- Transfer employee to another department

- Change designation

- Assign additional responsibilities

- Reset password

- View employee activity

- View pending approvals

- View transaction history

Maintain an employee master database.

When an employee leaves the company, their account must be disabled without deleting their historical transactions or approval records.

---

# 4. DEPARTMENT MANAGEMENT

Allow the Super Admin to create, edit and manage departments.

Initial departments:

1. Super Admin / Administration

2. Purchase Department

3. Stores & Maintenance Department

4. Production Department

5. Quality Control (QC)

6. Research & Development (R&D)

7. Sales & Marketing

8. Accounts & Finance

9. Management

Departments must be configurable.

Each department can have multiple employees, designations, managers and responsibilities.

---

# 5. DYNAMIC ROLE AND PERMISSION MANAGEMENT

Create a powerful Role Management module.

Do not restrict the system to predefined roles.

The administrator must be able to create custom roles.

Example roles:

- Purchase Executive

- Purchase Manager

- Purchase Head

- Stores Executive

- Stores Manager

- Production Executive

- Production Manager

- QC Executive

- QC Manager

- Sales Executive

- Sales Manager

- Accounts Executive

- Finance Manager

- Director

- Super Admin

Each role must have configurable permissions.

Permission categories:

A. View\
B. Create\
C. Edit\
D. Submit\
E. Approve\
F. Reject\
G. Send\
H. Cancel\
I. Export\
J. Print\
K. Delete (restricted and audited)

Permissions must be configurable at module, transaction and action level.

For example:

A Purchase Executive may:

- Create purchase requisitions.

- Prepare purchase orders.

- Edit draft purchase orders.

- Submit purchase orders for approval.

A Purchase Manager may:

- Review purchase orders.

- Approve or reject purchase orders.

- Return orders for correction.

An authorized Purchase Officer may:

- Send the approved purchase order to the supplier.

The same employee can have multiple roles, but conflicting responsibilities must be controlled through configurable segregation-of-duties rules.

---

# 6. WORKFLOW AND APPROVAL CONFIGURATION ENGINE

THIS IS ONE OF THE MOST IMPORTANT MODULES.

Create a separate Workflow Configuration module.

The Super Admin must be able to define who performs every step of every business process.

Do not hardcode approval chains.

Allow administrators to configure:

- Document creator

- Document preparer

- First reviewer

- First approver

- Second approver

- Final approver

- Authorized sender

- Receiving employee

- Issuing employee

- Final transaction authority

Approval stages must support:

- Pending

- Submitted

- Under Review

- Approved

- Rejected

- Returned for Correction

- On Hold

- Stop

- Cancelled

- Completed

Allow sequential and parallel approvals where required.

Allow configurable approval conditions based on:

- Transaction type

- Department

- Material

- Purchase value

- Quantity

- Designation

- Department authority

- Management approval requirements

Allow the administrator to configure monetary approval limits.

Example:

Purchase Order workflow:

1. Purchase Executive creates PO.

2. Purchase Manager reviews PO.

3. Purchase Head approves PO.

4. Director provides additional approval if the configured purchase value requires it.

5. Authorized Purchase employee sends PO to supplier.

6. System records sending date, recipient and document version.

All these stages must be configurable through the Admin Panel.

The administrator must be able to change the approver without changing application code.

Maintain a complete approval history showing:

- Employee name

- Designation

- Department

- Action performed

- Date and time

- Remarks

- Previous status

- New status

A user must not approve their own transaction if the configured segregation-of-duties policy prohibits it.

---

# 7. DOCUMENT RESPONSIBILITY CONFIGURATION

Every document in the application must have its own configurable workflow.

Examples:

PURCHASE ORDER:

- Who creates?

- Who checks?

- Who approves?

- Who signs?

- Who sends to supplier?

RAW MATERIAL RECEIPT:

- Who records physical receipt?

- Who enters weighment?

- Who performs sampling?

- Who enters QC results?

- Who accepts or rejects?

PRODUCTION REQUISITION:

- Who raises the request?

- Who verifies?

- Who approves?

- Who issues the material?

- Who receives the material?

ISSUE MATERIAL TRANSFER NOTE:

- Who generates the note?

- Who issues material?

- Who verifies weight and oxide content?

- Who receives material?

- Who signs acknowledgement?

FINISHED GOODS:

- Who records production output?

- Who verifies batch weight?

- Who approves QC?

- Who transfers goods into stores?

SALES CONTRACT:

- Who prepares?

- Who reviews?

- Who approves?

- Who signs?

- Who sends to customer?

The same configuration approach must apply to every transaction.

---

# 8. PURCHASE MANAGEMENT

Develop the complete Purchase module.

Features:

- Supplier master

- Purchase requisition

- Purchase order generation

- PO approval workflow

- PO PDF generation

- PO revision management

- Supplier communication

- PO dispatch tracking

- Purchase order status

- Purchase history

Digitize the existing MPIL Purchase Order format.

Preserve material specifications, quantity, quality, packing, delivery, shipment, price, payment terms and other conditions.

---

# 9. RAW MATERIAL RECEIPT AND INVENTORY

Create raw material receipt management.

Workflow:

Purchase Order → Material Receipt → Weighment → Sampling → QC Analysis → Acceptance / Rejection / Disposal / Return.

For accepted materials generate or assign:

- Unique material UID

- Supplier

- Purchase Order number

- Invoice number

- Invoice date

- Receipt date

- Material name

- Net weight

- Gross weight

- Moisture content

- Net dry weight

- Metal Oxide A percentage and quantity

- Metal Oxide B percentage and quantity

- QC report

- Acceptance status

Rejected materials must not enter usable inventory.

Maintain complete UID-wise inventory.

---

# 10. PRODUCTION MANAGEMENT

Create Production Campaign Management.

Allow:

- Create campaigns

- Add multiple lots to a campaign

- Link raw material UID to individual lots

- Record material issued

- Record material consumption

- Record production output

- Record losses

- Record batch details

Production requisition must follow the configurable approval workflow.

Approval options:

- Approved

- Not Approved

- Stop

Generate Issue Material Transfer Notes with:

- Unique transfer number

- Campaign number

- Lot number

- Raw material UID

- Material weight

- Oxide A quantity

- Oxide B quantity

- Issued By

- Received By

- Date and signatures

---

# 11. PRODUCTION LOSS MANAGEMENT

Provide separate entries for:

1. Solid production loss

2. Liquid production loss

3. Unidentified production loss

Record:

- Campaign

- Lot number

- Batch number

- Loss type

- Material weight or volume

- Oxide A loss

- Oxide B loss

- Remarks

- Entered By

- Verified By

- Approval status

Generate automatic reconciliation reports.

---

# 12. FINISHED GOODS MANAGEMENT

Maintain Product 1, Product 2 and Product 3 separately.

Support product-specific grading.

As per current requirements:

- Product 1: Grade 1 and Grade 2.

- Product 2: Single material type.

- Product 3: Grade 1 and Grade 2.

Allow administrators to configure product and grade masters.

Track:

- Production batch

- Product

- Grade

- Net weight

- Oxide A

- Oxide B

- QC status

- Warehouse location

- Stock availability

Generate Finished Goods Transfer Notes.

---

# 13. LABORATORY AND SAMPLE MANAGEMENT

Create separate sample workflows.

Returnable samples:

- Sample ID

- Batch number

- Weight

- Oxide A and B quantities

- Sent to

- Date sent

- Expected return

- Actual return

- Pending quantity

Non-returnable samples:

- Sample ID

- Batch number

- Weight

- Oxide A and B quantities

- Customer / laboratory

- Purpose

- Authorization

- Stock deduction

Prevent returnable samples from being treated as permanently consumed stock.

---

# 14. SALES AND DISPATCH

Digitize the existing MPIL Sales Contract.

Features:

- Customer master

- Sales enquiry

- Sales order

- Sales contract

- Contract approval

- Product allocation

- Batch allocation

- Dispatch planning

- Packing details

- Shipping details

- Invoice

- Dispatch tracking

Generate sales documents using configurable workflows.

---

# 15. DASHBOARDS

Create department-specific dashboards.

Super Admin Dashboard:

- Total employees

- Department-wise employees

- Pending approvals

- Purchase status

- Total raw material stock

- Production inventory

- Finished goods stock

- Production losses

- Sales summary

- Recent activities

Purchase Dashboard:

- Pending purchase requisitions

- Pending POs

- Approved POs

- Orders sent to suppliers

Stores Dashboard:

- Raw material stock

- UID-wise stock

- Material receipts

- Material issues

- Rejected material

- Finished goods stock

Production Dashboard:

- Active campaigns

- Running lots

- Material consumption

- Production output

- Loss reports

QC Dashboard:

- Pending testing

- QC approvals

- Rejected materials

- Pending finished goods testing

Management Dashboard:

- Overall business status

- Pending management approvals

- Inventory valuation

- Production performance

- Stock reconciliation

- Sales performance

---

# 16. NOTIFICATIONS AND TASK MANAGEMENT

Create a notification centre.

Notify employees when:

- A transaction is assigned to them.

- An approval is pending.

- A document is rejected.

- A document is returned for correction.

- A purchase order is approved.

- A PO needs to be sent.

- Material is received.

- QC approval is required.

- A sample is overdue for return.

Create a My Tasks section for every employee.

Display:

- Tasks assigned

- Approvals pending

- Tasks completed

- Rejected transactions

- Overdue tasks

---

# 17. DATABASE ARCHITECTURE

Create properly structured MongoDB collections using Mongoose.

Minimum collections:

- Users

- Departments

- Designations

- Roles

- Permissions

- RolePermissions

- Workflows

- WorkflowStages

- ApprovalRequests

- ApprovalHistory

- Suppliers

- Customers

- Products

- ProductGrades

- PurchaseRequisitions

- PurchaseOrders

- MaterialReceipts

- RawMaterialLots

- QCReports

- ProductionRequisitions

- MaterialTransfers

- Campaigns

- ProductionLots

- ProductionBatches

- ProductionLosses

- FinishedGoods

- SampleTransactions

- SalesContracts

- Dispatches

- StockLedger

- Notifications

- AuditLogs

Use proper MongoDB indexes, references and validation.

Use MongoDB transactions for inventory operations.

All material movements must have complete audit trails.

---

# 18. SECURITY REQUIREMENTS

- Secure password hashing using bcrypt or Argon2.

- JWT authentication and refresh token rotation.

- Role-based and permission-based access control.

- Backend authorization on every protected API.

- Input validation.

- API rate limiting.

- Audit logs.

- Session expiry.

- Secure file uploads.

- No unauthorized stock modification.

- No unauthorized approval.

- No permanent deletion of financial or inventory transaction history.

---

# 19. UI / UX REQUIREMENTS

Design a premium corporate ERP interface.

Use:

- Professional sidebar navigation.

- Collapsible sidebar.

- Header with employee profile.

- Notification bell.

- Search.

- Breadcrumb navigation.

- Data tables with sorting and filtering.

- Pagination.

- Export to Excel.

- PDF document preview.

- Responsive forms.

- Status indicators.

- Approval timeline.

- Activity history.

The design should be clean, modern and suitable for daily industrial operations.

---

# 20. IMPLEMENTATION INSTRUCTIONS

Build this as a complete working application, not merely a UI prototype.

Follow these development rules:

1.  First create the project architecture.

2.  Create the MongoDB database schemas.

3.  Implement authentication.

4.  Implement employee and department management.

5.  Implement dynamic roles and permissions.

6.  Implement the configurable workflow engine.

7.  Implement Purchase and Stores.

8.  Implement Production and inventory.

9.  Implement Finished Goods and Sales.

10. Implement dashboards and reporting.

Use reusable React components and modular backend controllers, services and routes.

Create proper error handling and API validation.

Include database seed scripts for initial Super Admin setup and master data.

Provide an environment configuration template.

Write setup and deployment documentation.

Do not create dummy approval workflows or hardcode sample employees into the production application.

The initial system must allow the Super Admin to create all employees, departments, roles, approval hierarchies and document responsibilities through the UI.

FINAL REQUIREMENT:

The application must be flexible enough that if the company changes its Purchase Manager, appoints a new Director, changes the person responsible for sending POs, or changes an approval hierarchy, the administrator can make those changes directly through the application without requiring a developer to modify the code.

Every document and transaction must maintain its complete history, accountability and traceability.
