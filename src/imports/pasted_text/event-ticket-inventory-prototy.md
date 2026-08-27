# Prototype Flow — Tạo Kho vé theo Sự kiện

## 1. Mục tiêu luồng

User có thể tạo **Kho vé** cho một sự kiện đã có, sau đó setup nhiều **Hạng vé** khác nhau, mỗi hạng vé có giá, số lượng, trạng thái và hiển thị Landing Page riêng.

Nguyên tắc chính:

```text
1 Sự kiện → 1 Kho vé active
1 Kho vé → nhiều Hạng vé
1 Hạng vé → giá riêng + số lượng riêng + trạng thái riêng
```

---

## 2. Flow tổng quan

```text
Danh sách sự kiện
→ Chọn sự kiện
→ Vào Event Workspace
→ Tab Kho vé
→ Nếu chưa có kho vé: Tạo kho vé
→ Nhập thông tin kho vé
→ Tạo kho vé thành công
→ Thêm hạng vé
→ Setup giá, số lượng, trạng thái từng hạng vé
→ Lưu hạng vé
→ Hạng vé hiển thị trong danh sách
→ Nếu bật hiển thị Landing Page, hạng vé xuất hiện ở section Vé tham dự
```

---

# 3. Prototype chi tiết theo màn

---

## Screen 1 — Event Workspace / Tab Kho vé Empty State

### Trường hợp

Sự kiện đã được tạo nhưng chưa có kho vé.

### UI hiển thị

**Header sự kiện**

```text
Sun Festival 2026
Đã publish
Sun Group • 01/08/2026
```

**Tabs**

```text
Tổng quan | Landing Page | Form đăng ký | Kho vé | Người tham dự | Email | Check-in | Báo cáo
```

Active tab:

```text
Kho vé
```

**Empty state**

```text
Sự kiện này chưa có kho vé

Tạo kho vé để thiết lập các hạng vé như Standard, VIP, Early Bird và hiển thị vé trên Landing Page.
```

CTA chính:

```text
+ Tạo kho vé
```

Rule box:

```text
- Mỗi sự kiện chỉ có một kho vé active.
- Tạo kho vé không trừ quota vé trong gói.
- Quota vé chỉ trừ khi vé được phát hành thật cho người tham dự.
```

### Prototype interaction

```text
Click “+ Tạo kho vé”
→ Open Drawer: Tạo kho vé
```

---

## Screen 2 — Drawer Tạo kho vé

### UI

Drawer bên phải hoặc modal lớn.

**Title**

```text
Tạo kho vé
```

**Subtitle**

```text
Kho vé sẽ được gắn với sự kiện đang chọn.
```

### Form fields

| Field             | Loại       | Ghi chú                             |
| ----------------- | ---------- | ----------------------------------- |
| Tên kho vé        | Text input | Default: Kho vé - Sun Festival 2026 |
| Sự kiện liên kết  | Read-only  | Sun Festival 2026                   |
| Mô tả kho vé      | Textarea   | Optional                            |
| Trạng thái kho vé | Radio card | Lưu nháp / Kích hoạt ngay           |
| Ghi chú nội bộ    | Textarea   | Optional                            |

### Copy gợi ý

```text
Tên kho vé
Kho vé - Sun Festival 2026
```

```text
Sự kiện liên kết
Sun Festival 2026
```

```text
Trạng thái kho vé
[ ] Lưu nháp — Chưa kích hoạt
[x] Kích hoạt ngay — Có thể hiển thị các hạng vé đang mở trên Landing Page
```

Info box:

```text
Tạo kho vé không trừ quota vé. Quota chỉ được tính khi vé được phát hành thật cho người tham dự.
```

### Footer buttons

```text
Hủy | Tạo kho vé
```

### Prototype interaction

```text
Click “Tạo kho vé”
→ Show toast: “Tạo kho vé thành công”
→ Close drawer
→ Navigate to Screen 3: Kho vé Detail Empty Hạng vé
```

---

## Screen 3 — Kho vé Detail / Chưa có hạng vé

### Trường hợp

Kho vé đã tạo thành công nhưng chưa có hạng vé.

### UI hiển thị

**Kho vé card**

```text
Kho vé Sun Festival 2026
Đang hoạt động
Gắn với sự kiện: Sun Festival 2026
```

Helper text:

```text
Section Vé tham dự trên Landing Page tự động lấy dữ liệu từ kho vé này. Chỉ hạng vé đang mở và bật hiển thị mới xuất hiện với người tham dự.
```

CTA:

```text
+ Thêm hạng vé
```

**Summary cards**

```text
Tổng sức chứa: 0
Đã phát hành: 0
Còn lại trong kho: 0
Quota vé trong gói: 0 / 1000
```

**Empty state hạng vé**

```text
Chưa có hạng vé nào

Thêm hạng vé đầu tiên như Standard, VIP hoặc Early Bird để người tham dự có thể chọn khi đăng ký.
```

CTA:

```text
+ Thêm hạng vé
```

### Prototype interaction

```text
Click “+ Thêm hạng vé”
→ Open Drawer: Thêm hạng vé
```

---

## Screen 4 — Drawer Thêm hạng vé

### UI

**Title**

```text
Thêm hạng vé
```

**Subtitle**

```text
Thiết lập giá, số lượng và trạng thái cho hạng vé.
```

### Form fields

| Field                 | Loại              | Ghi chú                    |
| --------------------- | ----------------- | -------------------------- |
| Tên hạng vé           | Text input        | Required                   |
| Mô tả hạng vé         | Textarea          | Optional                   |
| Quyền lợi vé          | Textarea          | Optional                   |
| Loại vé               | Segmented control | Miễn phí / Trả phí         |
| Giá vé                | Number input      | Disabled nếu miễn phí      |
| Số lượng vé           | Number input      | Required                   |
| Giới hạn mỗi người    | Number input      | Default = 1                |
| Thời gian đăng ký     | Date time range   | Optional                   |
| Hiển thị Landing Page | Toggle            | On/Off                     |
| Trạng thái            | Radio card        | Lưu nháp / Mở đăng ký ngay |

### Ví dụ form Standard

```text
Tên hạng vé: Standard
Mô tả: Vé tham dự cơ bản
Loại vé: Miễn phí
Giá vé: 0đ
Số lượng vé: 300
Giới hạn mỗi người: 1
Hiển thị Landing Page: Bật
Trạng thái: Mở đăng ký ngay
```

### Preview block

```text
Preview trên Landing Page

Standard
Miễn phí
Còn 300 vé
[Chọn vé]
```

### Footer buttons

```text
Hủy | Lưu hạng vé
```

### Prototype interaction

```text
Click “Lưu hạng vé”
→ Show toast: “Thêm hạng vé thành công”
→ Close drawer
→ Update table hạng vé
→ Navigate to Screen 5
```

---

## Screen 5 — Kho vé Detail / Có danh sách hạng vé

### UI hiển thị

**Kho vé card**

```text
Kho vé Sun Festival 2026
Đang hoạt động
```

CTA:

```text
+ Thêm hạng vé
Chỉnh sửa kho vé
```

### Summary cards

```text
Tổng sức chứa: 600
Đã phát hành: 402
Còn lại trong kho: 198
Quota vé trong gói: 402 / 1000
```

Helper:

```text
Có thể phát hành thêm = số nhỏ hơn giữa vé còn lại trong kho và quota vé còn lại trong gói.
```

### Table hạng vé

| Hạng vé    | Loại vé  |   Giá vé | Số lượng | Đã phát hành | Còn lại | Hiển thị Landing | Trạng thái |
| ---------- | -------- | -------: | -------: | -----------: | ------: | ---------------- | ---------- |
| Standard   | Miễn phí |       0đ |      300 |          180 |     120 | Có               | Đang mở    |
| VIP        | Trả phí  | 499.000đ |      100 |           72 |      28 | Có               | Đang mở    |
| Early Bird | Trả phí  | 299.000đ |      150 |          150 |       0 | Có               | Hết vé     |
| Guest      | Miễn phí |       0đ |       50 |            0 |      50 | Không            | Lưu nháp   |

### Prototype interaction

```text
Click “+ Thêm hạng vé”
→ Open Drawer Thêm hạng vé
```

```text
Click “Chỉnh sửa” trên hạng vé
→ Open Drawer Chỉnh sửa hạng vé
```

```text
Click “Chỉnh sửa kho vé”
→ Open Drawer Chỉnh sửa kho vé
```

---

## Screen 6 — Drawer Chỉnh sửa hạng vé

### Trường hợp

User chỉnh hạng vé đã có.

### UI

Form giống “Thêm hạng vé”, nhưng có dữ liệu đã lưu.

Nếu hạng vé đã có vé phát hành, hiển thị warning:

```text
Hạng vé này đã có vé được phát hành. Một số thay đổi có thể ảnh hưởng đến người tham dự mới.
```

### Business rule khi chỉnh sửa

```text
- Có thể tăng số lượng vé.
- Không được giảm số lượng thấp hơn số vé đã phát hành.
- Nếu đổi giá vé khi đã có vé phát hành, cần hiển thị cảnh báo.
- Nếu tắt Hiển thị Landing Page, hạng vé sẽ không xuất hiện trên Landing Page.
- Nếu chuyển trạng thái sang Tạm đóng, user mới sẽ không thể chọn hạng vé này.
```

### Footer buttons

```text
Hủy | Lưu thay đổi
```

### Prototype interaction

```text
Click “Lưu thay đổi”
→ Show toast: “Cập nhật hạng vé thành công”
→ Close drawer
→ Update table hạng vé
```

---

# 4. Flow trạng thái đặc biệt

## Case 1 — Sự kiện chưa có kho vé

```text
Tab Kho vé
→ Empty state
→ CTA: Tạo kho vé
```

## Case 2 — Sự kiện đã có kho vé

```text
Tab Kho vé
→ Hiển thị Kho vé detail
→ CTA chính: Thêm hạng vé
```

## Case 3 — User cố tạo kho vé thứ hai

Thông báo:

```text
Sự kiện này đã có kho vé đang hoạt động. Trong MVP, mỗi sự kiện chỉ có một kho vé active.
```

CTA:

```text
Quản lý kho vé hiện tại
```

## Case 4 — Hạng vé hết vé

Trong landing page và table hiển thị:

```text
Hết vé
```

Button chọn vé disabled.

## Case 5 — Quota vé trong gói đã hết

Thông báo trong admin:

```text
Gói sử dụng đã hết quota vé phát hành. Vui lòng nâng cấp gói để tiếp tục phát hành vé mới.
```

Trong landing page:

```text
Sự kiện hiện không thể nhận thêm đăng ký. Vui lòng liên hệ ban tổ chức.
```

---

# 5. Prototype connection trong Figma

## Frame list

```text
01_Event_Workspace_KhoVe_Empty
02_Drawer_Create_KhoVe
03_KhoVe_Detail_Empty_Tier
04_Drawer_Add_Ticket_Tier
05_KhoVe_Detail_With_Tiers
06_Drawer_Edit_Ticket_Tier
07_Error_Already_Has_KhoVe
08_Error_Out_Of_Quota
```

## Interaction map

```text
01 click “+ Tạo kho vé”
→ 02
```

```text
02 click “Tạo kho vé”
→ 03
```

```text
03 click “+ Thêm hạng vé”
→ 04
```

```text
04 click “Lưu hạng vé”
→ 05
```

```text
05 click “+ Thêm hạng vé”
→ 04
```

```text
05 click “Chỉnh sửa” ở row hạng vé
→ 06
```

```text
06 click “Lưu thay đổi”
→ 05
```

```text
05 click “Chỉnh sửa kho vé”
→ Drawer chỉnh sửa kho vé
```

---

# 6. Copy chính cần dùng trong prototype

## Empty kho vé

```text
Sự kiện này chưa có kho vé

Tạo kho vé để thiết lập các hạng vé như Standard, VIP, Early Bird và hiển thị vé trên Landing Page.
```

## Rule kho vé

```text
Mỗi sự kiện chỉ có một kho vé active. Tạo kho vé và hạng vé không trừ quota vé. Quota chỉ được tính khi vé được phát hành thật.
```

## Helper landing

```text
Section Vé tham dự trên Landing Page tự động lấy dữ liệu từ kho vé này. Chỉ hạng vé đang mở và bật hiển thị mới xuất hiện với người tham dự.
```

## Helper quota

```text
Có thể phát hành thêm = số nhỏ hơn giữa vé còn lại trong kho và quota vé còn lại trong gói.
```

---

# 7. Kết luận flow

Luồng tạo kho vé nên đi theo hướng đơn giản:

```text
Tạo kho vé trước
→ Sau đó thêm nhiều hạng vé
→ Mỗi hạng vé có giá và số lượng riêng
→ Hạng vé bật hiển thị sẽ xuất hiện trên Landing Page
→ Vé chỉ được phát hành và trừ quota khi attendee đăng ký thành công
```
