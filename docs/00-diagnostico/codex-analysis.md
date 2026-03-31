# Document 1 — Architecture

**High-level architecture**
- Frontend: Next.js App Router with client components for ordering (counter, table, delivery), kitchen, and admin UI. Core pages live in `app/balcao/page.tsx`, `app/mesa/[id]/page.tsx`, `app/delivery/page.tsx`, `app/cozinha/page.tsx`, `app/admin/page.tsx`, `app/admin/menu/page.tsx`, and `app/print/[id]/page.tsx`.
- Backend: Supabase is accessed directly from the browser via `lib/supabase.ts`. There is one server-side API route to update order status using the Supabase service role key in `app/api/orders/[id]/status/route.ts` with `lib/supabase-server.ts`.
- Messaging: WhatsApp integration is done by generating a message and opening a `wa.me` URL in the browser from `lib/whatsapp-message.ts`.
- Database usage: Orders, delivery settings, delivery zones, and menu components are stored in Supabase tables. Orders are inserted directly from the client in `lib/orders.ts`.

**Module breakdown (responsibility, main files, key functions, dependencies)**

- **Order management**
  Responsibility: create orders, update status, fetch open orders and reports.  
  Main files: `lib/orders.ts`, `app/cozinha/page.tsx`, `app/cozinha/[id]/page.tsx`, `app/admin/page.tsx`, `app/admin/pedidos/[id]/page.tsx`, `app/api/orders/[id]/status/route.ts`.  
  Key functions: `createOrderInDB`, `fetchOpenOrders`, `fetchOrderById`, `updateOrderStatus`, `closeOrder`, `cancelOrder`.  
  Dependencies: Supabase client from `lib/supabase.ts`, Supabase server client from `lib/supabase-server.ts`, React client components.

- **Cart and item composition**
  Responsibility: cart state, item grouping, cart UI, delivery customer flow.  
  Main files: `components/cart-provider.tsx`, `components/cart/cart-modal.tsx`, `components/cart-bar.tsx`.  
  Key functions: `addItem`, `updateQuantity`, `clearCart`, `handleConfirmCart`, `handleConfirmDelivery`.  
  Dependencies: `lib/orders.ts`, `lib/whatsapp-message.ts`, `lib/delivery-setting.ts`, `lib/delivery-fees.ts`.

- **Menu and item rendering**
  Responsibility: menu data selection by day, category grouping, menu cards, pratinho and porção builders.  
  Main files: `lib/menu-data.ts`, `components/menu-item-card.tsx`, `components/pratinho-builder.tsx`, `components/porcao-builder.tsx`, `lib/useMenuData.ts`.  
  Key functions: `getActiveMenu`, `getActiveDayIndex`, `getDayProteinNames`, `useMenuData`.  
  Dependencies: Supabase client, `lib/pricing.ts`.

- **Pricing and configuration rules**
  Responsibility: pratinho dynamic pricing based on proteins.  
  Main files: `lib/pricing.ts`.  
  Key functions: `calculatePratinhoPrice`, `getProteinPrice`.  
  Dependencies: types from `lib/menu-components.ts`.

- **Delivery logic and business hours**
  Responsibility: delivery open/close, delivery fees, CEP lookup, delivery-specific order fields.  
  Main files: `lib/delivery-setting.ts`, `lib/delivery-fees.ts`, `components/cart/cart-modal.tsx`, `app/delivery/page.tsx`.  
  Key functions: `fetchDeliverySettings`, `updateDeliverySettings`, `fetchDeliveryFees`, `fetchDeliveryFeeByNeighborhood`, CEP lookup in `handleCepLookup`.  
  Dependencies: Supabase client, ViaCEP API.

- **WhatsApp integration**
  Responsibility: order message generation and status messages to customers.  
  Main files: `lib/whatsapp-message.ts`.  
  Key functions: `generateWhatsAppMessage`, `openWhatsAppOrder`, `openWhatsAppWithOrderStatus`.  
  Dependencies: cart items from `components/cart-provider.tsx`, order types from `lib/orders.ts`.

- **Admin menu management**
  Responsibility: manage menu proteins/bases/salads/optionals and daily menu.  
  Main files: `app/admin/menu/page.tsx`, `lib/admin-menu.ts`, `lib/menu-components.ts`.  
  Key functions: `fetchProteins`, `createProtein`, `updateProtein`, `toggleProteinActive`, `fetchBases`, `fetchSalads`, `fetchOptionals`, `fetchDailyMenu`, `upsertDailyMenu`, `invalidateMenuComponents`, `invalidateMenuDaily`.  
  Dependencies: Supabase client.

- **Operational reporting**
  Responsibility: daily sales summary and order listing.  
  Main files: `lib/admin-reports.ts`, `app/admin/page.tsx`.  
  Key functions: `fetchAdminReportByDate`, `fetchAdminOrdersByDate`.  
  Dependencies: Supabase client, order types.

- **Printing**
  Responsibility: thermal print layout for orders.  
  Main files: `app/print/[id]/page.tsx`.  
  Key functions: page-level render with `window.print()` and structured order output.  
  Dependencies: `lib/orders.ts`.

**Runtime flow**

- **Opening the counter page (`/balcao`)**
  The page uses `getActiveMenu()` from `lib/menu-data.ts` to build the menu and categories. Items render with `MenuItemCard` and categories are collapsible. The cart state lives in `components/cart-provider.tsx` and the cart modal is opened from `components/cart-bar.tsx`. Supabase is not required for menu rendering here, except a debug `orders` select in `app/balcao/page.tsx`.

- **Creating a new order**
  Items are added to cart via `addItem` in `components/cart-provider.tsx`.  
  On confirming:
  - Mesa/Balcão: `handleConfirmCart` calls `createOrderInDB` in `lib/orders.ts`, writes the order with `status = "pending"`, computes `daily_order_number`, and clears the cart.  
  - Delivery: the user fills customer data, CEP lookup runs in `components/cart/cart-modal.tsx`, delivery fee is resolved via `lib/delivery-fees.ts`, then `createOrderInDB` inserts the order with delivery fields and `delivery_ordered_at`.

- **Confirming an order**
  The kitchen flow loads orders from `fetchOpenOrders()` (polling every 3 seconds) in `app/cozinha/page.tsx`.  
  Printing an order triggers `updateOrderStatus` to mark pending → preparing, then opens `/print/[id]`.  
  Status transitions are controlled in `app/cozinha/[id]/page.tsx` with explicit buttons (pending → preparing → ready → out_for_delivery → closed/cancelled).

- **Sending a WhatsApp message**
  For delivery orders, `generateWhatsAppMessage` creates a detailed message and `openWhatsAppOrder` opens `wa.me` to the restaurant number in `lib/whatsapp-message.ts`.  
  Status updates to customers use `openWhatsAppWithOrderStatus` in `app/cozinha/[id]/page.tsx` and open a `wa.me` link to the customer’s phone.

---

# Document 2 — Database

**Detected tables and usage (inferred from code)**

- **`orders`**
  Fields (inferred):  
  `id` (uuid), `origin` (text), `table_number` (int4), `daily_order_number` (int4), `customer_name` (text), `customer_phone` (text), `customer_street` (text), `customer_number` (text), `customer_neighborhood` (text), `customer_cep` (text), `customer_address` (text, legacy), `delivery_ordered_at` (timestamptz), `items` (jsonb), `subtotal` (numeric), `delivery_fee` (numeric, nullable), `total` (numeric), `payment_method` (text), `payment_details` (text), `status` (text), `created_at` (timestamptz), `updated_at` (timestamptz).  
  Relations: none in code; all items are embedded in `items` JSON.  
  Used in: `lib/orders.ts`, `lib/admin-reports.ts`, `app/cozinha/page.tsx`, `app/cozinha/[id]/page.tsx`, `app/admin/page.tsx`, `app/admin/pedidos/[id]/page.tsx`, `app/print/[id]/page.tsx`.

- **`delivery_settings`**
  Fields (inferred):  
  `id` (uuid), `is_open` (bool), `delivery_fee` (numeric), `delivery_open_time` (text/time), `delivery_close_time` (text/time), `updated_at` (timestamptz).  
  Used in: `lib/delivery-setting.ts`, `app/admin/page.tsx`, `app/delivery/page.tsx`, `components/cart/cart-modal.tsx`.  
  Note: `delivery_fee` exists but the delivery fee shown to customers comes from `delivery_zones`.

- **`delivery_zones`**
  Fields (inferred):  
  `id` (uuid), `neighborhood` (text), `fee` (numeric).  
  Used in: `lib/delivery-zones.ts`, `lib/delivery-fees.ts`, `components/cart/cart-modal.tsx`.

- **`menu_proteins`**
  Fields (inferred):  
  `id` (uuid), `name` (text), `type` (text), `price_p` (numeric), `price_g` (numeric), `is_lasagna` (bool), `is_active` (bool).  
  Used in: `lib/useMenuData.ts`, `lib/menu-components.ts`, `lib/admin-menu.ts`, `components/pratinho-builder.tsx`, `lib/pricing.ts`.

- **`menu_bases`**
  Fields (inferred):  
  `id` (uuid), `name` (text), `is_active` (bool, expected by admin UI).  
  Used in: `lib/useMenuData.ts`, `lib/menu-components.ts`, `lib/admin-menu.ts`, `components/pratinho-builder.tsx`.

- **`menu_salads`**
  Fields (inferred):  
  `id` (uuid), `name` (text), `is_active` (bool, expected by admin UI).  
  Used in: `lib/useMenuData.ts`, `lib/menu-components.ts`, `lib/admin-menu.ts`, `components/pratinho-builder.tsx`.

- **`menu_optionals`**
  Fields (inferred):  
  `id` (uuid), `name` (text), `price` (numeric), `is_active` (bool, expected by admin UI).  
  Used in: `lib/useMenuData.ts`, `lib/menu-components.ts`, `lib/admin-menu.ts`, `components/pratinho-builder.tsx`.

- **`menu_daily`**
  Fields (inferred):  
  `id` (uuid), `day_of_week` (int), `protein_id` (uuid), `is_active` (bool).  
  Relations: `protein_id` references `menu_proteins`.  
  Used in: `lib/useMenuData.ts`, `lib/menu-components.ts`, `lib/admin-menu.ts`.

**Missing fields that may cause issues**
- `delivery_ordered_at` is required by code in `lib/orders.ts` and displayed in multiple UIs. If the column is missing, insert will fail for delivery orders.
- `is_active` is assumed in `menu_bases`, `menu_salads`, and `menu_optionals` in `lib/admin-menu.ts` and `lib/menu-components.ts`. If those columns do not exist, admin toggles and filters will fail.
- `customer_address` is still written in `lib/orders.ts` but is not represented in `Order` type, so it is a legacy field.

**Normalization problems and possible improvements (description only)**
- `orders.items` is stored as JSON with embedded configuration details, which is flexible but makes reporting and analytics harder.
- Daily menu rules are split between a hardcoded `menuByDay` in `lib/menu-data.ts` and the `menu_daily` table. This leads to two sources of truth for daily menu logic.
- Delivery fee exists in `delivery_settings` and in `delivery_zones`, which can cause confusion about the canonical fee source.

---

# Document 3 — Business Rules

**Order lifecycle**
- Status values are fixed in `lib/orders.ts`: `pending`, `preparing`, `ready`, `out_for_delivery`, `delivered`, `closed`, `cancelled`.  
- Creation sets `status = "pending"` in `createOrderInDB` in `lib/orders.ts`.  
- Kitchen flow updates status in `app/cozinha/[id]/page.tsx` and `components/order-card.tsx`.  
- Orders are considered “open” when status is not `closed` or `cancelled` in `fetchOpenOrders` in `lib/orders.ts`.

**Daily order numbering**
- `createOrderInDB` counts orders created since 00:00 local time and sets `daily_order_number = count + 1` in `lib/orders.ts`.  
- It counts all orders created today regardless of status.  
- Possible edge case: concurrent inserts can produce duplicate numbers under load.

**Delivery fee calculation**
- Delivery fee is resolved by neighborhood lookup from `delivery_zones` in `lib/delivery-fees.ts` and set in `components/cart/cart-modal.tsx`.  
- Special option “Outro (consultar)” sets `deliveryFee = null`, displayed as “a consultar”.

**Delivery open/close logic**
- Delivery requires both `delivery_settings.is_open` and time window in `components/cart/cart-modal.tsx` and `app/delivery/page.tsx`.  
- If time window spans midnight, logic allows orders outside the standard same-day range.

**CEP lookup**
- CEP lookup is triggered after 8 digits in `components/cart/cart-modal.tsx`.  
- ViaCEP response fills `street`, `neighborhood`, `city`, and `state`.  
- Neighborhood returned from CEP attempts to match a delivery zone; if it matches, it auto-selects and sets fee. If not, it selects “Outro (consultar)”.

**Pratinho pricing**
- `calculatePratinhoPrice` in `lib/pricing.ts` defines price based on selected proteins and size.  
- Lasagna types override base, with incremental rules based on the second protein type.  
- Ground meat + chicken has no additional increase.

**Porção pricing**
- `components/porcao-builder.tsx` offers Creme/Vatapá with size `P` (15) or `G` (18).  
- Selecting two options adds +1.

**Weight-based items**
- Items with `soldByWeight` use `pricePerKg` in `components/menu-item-card.tsx`.  
- Cart grouping uses a `configKey` that includes `weightInGrams`, so items with different weights remain separate in `components/cart-provider.tsx`.

**WhatsApp message generation**
- Order messages for delivery are generated in `lib/whatsapp-message.ts` and include item details, options, proteins, and totals.  
- Messages are sent to the restaurant’s fixed number via `openWhatsAppOrder`.  
- Status messages go to the customer’s phone via `openWhatsAppWithOrderStatus` in `lib/whatsapp-message.ts`.

**Counter vs delivery behavior**
- Counter and table orders confirm directly to Supabase via `createOrderInDB` with no customer data.  
- Delivery orders require customer data, delivery fee resolution, and then WhatsApp confirmation.

---

# Architecture Risks

- Heavy client-side Supabase usage means business logic and database writes are executed in the browser, increasing exposure and requiring strict RLS to avoid misuse.  
- Polling every 3 seconds for kitchen orders in `app/cozinha/page.tsx` can create load as usage grows.  
- Daily order numbering uses count-based logic without locks, which can collide under concurrent inserts.  
- Menu data is split between hardcoded lists in `lib/menu-data.ts` and database tables, creating two sources of truth.  
- Delivery fee exists in `delivery_settings` and `delivery_zones`, creating ambiguity and configuration drift risk.  
- Admin menu code assumes `is_active` columns for multiple tables that may not exist in the database.

---

# SaaS Readiness

To support multiple restaurants (multi-tenant), the system would need:

1. Tenant scoping in all tables via a `tenant_id` column, and updates to every query in `lib/orders.ts`, `lib/admin-menu.ts`, `lib/admin-reports.ts`, `lib/delivery-setting.ts`, `lib/delivery-fees.ts`, and `lib/useMenuData.ts`.  
2. Strong RLS policies in Supabase to enforce tenant isolation for every table.  
3. A per-tenant configuration model for delivery hours, WhatsApp numbers, and menu data instead of current hardcoded values and fixed restaurant number in `lib/whatsapp-message.ts`.  
4. Server-side order creation (API routes or server actions) to prevent client-side tampering and to enforce tenant validation.  
5. Tenant-aware routing and authentication, likely with org-based permissions for kitchen/admin users.  
6. A clear migration path away from `menuByDay` hardcoded data in `lib/menu-data.ts` to tenant-owned database tables.