# Security Specification — Motopartes de Cuba S.R.L Firestore

## 1. Data Invariants
- Catalog repuestos (`/repuestos/{repuestoId}`):
  - Anyone can read/list repuestos to see catalog items, prices and availability.
  - Only authenticated administrators (matched via `/admins/$(request.auth.uid)` or verified bootstrap admin email `raynehcuba@gmail.com`) can create, update, or delete repuestos.
  - Repuesto IDs must conform to `^[a-zA-Z0-9_\-]+$` and be <= 128 chars.
  - Price and stock count values must be non-negative numbers.
  - Stock must be one of `['disponible', 'bajo_stock', 'encargo']`.
  - Model must be one of `['MZ', 'GN125', 'AX100', 'Karpaty', 'Universal']`.
- Custom Orders (`/custom_orders/{orderId}`):
  - Any customer can create a custom order with valid ID and required fields.
  - Only admins can read, list, update status, or delete custom orders.
- Admins (`/admins/{adminId}`):
  - Read allowed for the user's own admin document if authenticated.
  - Modifying admin roles requires bootstrap superadmin authority.

## 2. The "Dirty Dozen" Attack Payloads (Must be blocked)
1. Anonymous write to `/repuestos/mz-cilindro` (Missing auth) -> PERMISSION_DENIED
2. Customer updating price on `/repuestos/mz-cilindro` to $1 -> PERMISSION_DENIED
3. Injecting a 2MB payload or 10,000 char string in `name` -> PERMISSION_DENIED
4. Negative stock count (`stockCount: -50`) -> PERMISSION_DENIED
5. Invalid motorcycle model (`model: "DucatiPanigale"`) -> PERMISSION_DENIED
6. Non-existent category (`category: "aerospace"`) -> PERMISSION_DENIED
7. Document ID injection (`/repuestos/../../hack`) -> PERMISSION_DENIED
8. Unauthenticated read of `/custom_orders` (PII protection) -> PERMISSION_DENIED
9. Regular user attempting to set themselves as admin in `/admins/user123` -> PERMISSION_DENIED
10. Modifying immutable ID on repuesto update -> PERMISSION_DENIED
11. Attempting to tamper with admin email without email verification -> PERMISSION_DENIED
12. Blanket query scraping of administrative collections without proper admin credentials -> PERMISSION_DENIED
