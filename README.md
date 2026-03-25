📦 Warehouse & Invoicing SaaS
Stock • Purchases • Sales • PDF Invoices • Delivery Notes • Google Maps • Dashboard KPIs • White‑Label

Ένα πλήρες, cloud‑ready SaaS για αποθήκη & τιμολόγηση, με δυναμικά PDFs, stock automation, KPIs dashboard και mobile‑friendly UI.
Χτισμένο με Next.js + Prisma + PostgreSQL, πλήρως modular και έτοιμο για white‑label χρήση.
🚀 Features
🧱 Core Modules

    Products (SKU, stock, pricing, min stock alerts)

    Customers (με Google Maps integration)

    Suppliers

    Purchases & Purchase Items

    Sales & Sale Items

    Stock Movements (purchase, sale, manual adjustment)

    Company Settings (logo, VAT, invoice notes, business info)

📄 PDF Generation

    Invoice PDF (dynamic company info, logo, notes)

    Delivery Note PDF

    Re‑generate PDFs after edits (Edit PDF)

📊 Dashboard KPIs

    Monthly Sales chart

    Monthly Profit chart

    Top Selling Products

    Low Stock Alerts

    Total Inventory Value

    Sales Today / This Week / This Month

    Recent Stock Movements

🔄 Stock Automation

    Purchases → Increase stock

    Sales → Decrease stock

    Manual adjustments

    Automatic StockMovement logs

📥📤 Import / Export

    CSV Import (Products)

    CSV Export (Products)

🔐 Permissions
Role	Permissions
Admin	Full access, edit Company Settings, delete purchases/sales, import/export, regenerate PDFs
Staff	Add/view sales, view products, no settings access, no delete, no import/export
🎨 White‑Label Ready

    Dynamic logo

    Dynamic company info

    Custom invoice notes

    Extendable theme

🏗️ Tech Stack

    Next.js 14 (App Router)

    TypeScript

    Prisma ORM

    PostgreSQL

    PDFKit

    TailwindCSS

    JWT Auth

    Day.js

    PapaParse (CSV)

📁 Project Structure
Code

warehouse-saas/
  prisma/
    schema.prisma
    seed.ts
  src/
    lib/
      db.ts
      auth.ts
      pdf.ts
      permissions.ts
      kpis.ts
      csv.ts
    app/
      api/
        products/
        purchases/
        sales/
        customers/
        suppliers/
        stock-movements/
        company-settings/
        dashboard/kpis/
      dashboard/
      products/
      purchases/
      sales/
      customers/
      suppliers/
      settings/
    components/
      Forms/
      MapEmbed.tsx
      Charts.tsx

🗄️ Database Schema (Prisma)
Includes:

    Products

    Suppliers

    Customers

    Purchases / PurchaseItems

    Sales / SaleItems

    StockMovements

    CompanySettings

    Users (Admin/Staff)

(Το πλήρες schema βρίσκεται στο prisma/schema.prisma.)
🔄 Flows
Purchase Flow

    Create Purchase

    Create PurchaseItems

    Increase product stock

    Create StockMovement(type = purchase)

Sale Flow

    Create Sale

    Create SaleItems

    Decrease product stock

    Create StockMovement(type = sale)

    Generate Invoice PDF

    Generate Delivery Note PDF

    Save PDFs

    Allow re‑generate (Edit PDF)

Manual Stock Adjustment

    Update stock

    Create StockMovement(type = manual_adjustment)

🧾 PDF Generation
Invoice PDF Includes:

    Logo

    Business info

    Customer info

    Invoice number

    Date

    Items table

    Totals

    Invoice notes

Delivery Note PDF Includes:

    Logo

    Customer info

    Delivery items (qty only)

    Date

Edit PDF

    Re-generate Invoice or Delivery Note after:

        CompanySettings update

        Sale update

🌍 Google Maps Integration

    Customers include google_maps_url

    Customer page shows embedded Google Map preview

📥📤 Import / Export
Import Products (CSV)

Columns:
Code

name, sku, category, description, cost_price, sell_price, stock_qty, min_stock, image

Export Products (CSV)

    Same fields

🧮 Add Sale Form (Full Implementation)
Requirements:

    Select Customer

    Auto-fill customer preview

    Add multiple sale items

    For each item:

        Select product

        Auto-fill price

        Enter qty

        Auto-calc subtotal = price × qty

    Auto-calc total_amount (live)

    Payment method dropdown

    Auto-generate invoice number

    Submit creates:

        Sale

        SaleItems

        StockMovements

        Invoice PDF

        Delivery Note PDF

    Redirect to Sale Details

UI:

    Mobile-friendly

    Table-like layout

    Add/Remove item buttons

    Total displayed at bottom

📊 Dashboard Widgets

    Monthly Sales (chart)

    Monthly Profit (chart)

    Top Selling Products

    Low Stock Alerts

    Total Inventory Value

    Sales Today / Week / Month

    Recent Stock Movements

🔐 Authentication & Permissions

    JWT-based auth

    Role-based access control

    Admin vs Staff restrictions enforced in API routes

🛠️ Installation
Code

github.com/flokiotispanagiotis-pixel/Saas.git
cd warehouse-saas
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev

🧪 Seeding (optional)
Code

npx prisma db seed

📸 Screenshots (placeholders)
Code

/screenshots/dashboard.png
/screenshots/products.png
/screenshots/add-sale.png
/screenshots/invoice-pdf.png

🧩 Roadmap

    Multi‑tenant support

    Themes per tenant

    Barcode scanning

    Inventory audit module

    Supplier price lists

📄 License

MIT License.
