Create a high-fidelity NetEvent “Tạo & Tùy chỉnh Form đăng ký” UI flow using a field selector pattern similar to the uploaded reference.

Use Vietnamese for all UI copy, labels, buttons, helper text, field names, validation messages, status badges, and empty states.

Product context:
NetEvent is an event management platform. Each event can have one main registration form called “Form đăng ký”. This form is used on the event Landing Page to collect attendee information before issuing QR tickets.

Form logic:

* Each event has one main Form đăng ký in MVP.
* Landing Page displays the form, but form fields are managed in the Form đăng ký module.
* Form đăng ký can be created from Event Workspace or quickly from Landing Page Editor.
* Default form must always include:

  1. Họ và tên
  2. Email
  3. Số điện thoại
* Default fields should be selected by default and marked as required.
* Admin can add, remove, sort, and configure additional fields.
* Admin can choose up to 12 fields.
* Admin can preview the form before applying changes.
* Form data will be used to create attendee records after registration.
* If the event has Kho vé, the public landing page flow is: choose ticket tier → fill form → submit.
* If the event has no Kho vé, the public landing page flow is: fill form → submit.

Design style:

* Modern B2B SaaS dashboard
* Clean light background
* Rounded cards
* Subtle borders and shadows
* Chip selector UI
* Clear selected state
* Primary color: #FF8644
* Supporting blue for selected/active chips
* Green for success
* Orange for warning
* Neutral colors: #F8FAFC, #F1F5F9, #64748B, #0F172A
* Font: Inter or Be Vietnam Pro
* Desktop width: 1440px
* Production-ready UI, not wireframe

==================================================
SCREEN 1 — FORM ĐĂNG KÝ EMPTY STATE
===================================

Create an empty state in Event Workspace → Tab “Form đăng ký”.

Page title:
“Form đăng ký”

Subtitle:
“Thiết lập các trường thông tin cần thu khi người tham dự đăng ký sự kiện.”

Empty state card:
Title:
“Chưa có Form đăng ký”

Description:
“Tạo form để thu thông tin người tham dự. Form này sẽ được hiển thị trên Landing Page của sự kiện.”

Primary CTA:
“+ Tạo Form đăng ký”

Helper box:
“Form mặc định sẽ có 3 trường bắt buộc: Họ và tên, Email, Số điện thoại.”

Interaction:
Click “+ Tạo Form đăng ký”
→ Open modal “Tùy chỉnh Form đăng ký”

==================================================
SCREEN 2 — CUSTOM FORM FIELD SELECTOR MODAL
===========================================

Create a large centered modal or full-page drawer.

Modal title:
“Tùy chỉnh Form đăng ký”

Header text:
“Đã chọn 3/12 trường thông tin”

Subtitle:
“Thêm, xóa và sắp xếp field theo nhu cầu của sự kiện.”

Top right:
Close icon

Top actions:

* Button: “Đặt lại mặc định”
* Button: “Hủy”
* Primary button: “Áp dụng thay đổi”

==================================================
SELECTED FIELDS AREA
====================

Create a selected fields area at the top, similar to the reference image.

Section title:
“Field đã chọn”

Show selected fields as draggable chips.

Default selected chips:

1. “Họ và tên”
2. “Email”
3. “Số điện thoại”

Each chip includes:

* Order number
* Field name
* Drag handle icon
* Required badge if required
* Lock icon for default fields

Default fields:

* Should be selected by default
* Should be marked “Bắt buộc”
* Cannot be removed
* Can be sorted only if needed, but still should remain in the form

Example chip:
“1 Họ và tên · Bắt buộc”

Optional selected chips example:
4. “Công ty / Tổ chức”
5. “Chức danh”
6. “Bạn biết sự kiện qua đâu?”

Optional chips include:

* Remove icon
* Drag handle

Helper text:
“Kéo thả để sắp xếp thứ tự field hiển thị trên Landing Page.”

==================================================
FIELD LIBRARY AREA
==================

Below selected fields, create a field library grouped by category.

Each field appears as a pill/chip button.
Selected fields have active state.
Unselected fields have neutral state.
Clicking an unselected field adds it to selected fields.
Clicking a selected optional field removes it.
Default fields cannot be removed.

Category 1:
“Thông tin cơ bản”

Fields:

* Họ và tên
* Email
* Số điện thoại
* Công ty / Tổ chức
* Chức danh
* Địa chỉ

Category 2:
“Thông tin nghề nghiệp”

Fields:

* Ngành nghề
* Phòng ban
* Vị trí công việc
* Quy mô công ty
* Website công ty

Category 3:
“Thông tin tham dự”

Fields:

* Bạn biết sự kiện qua đâu?
* Mục tiêu tham gia sự kiện
* Chủ đề quan tâm
* Câu hỏi cho diễn giả
* Yêu cầu đặc biệt

Category 4:
“Marketing & Consent”

Fields:

* Đồng ý nhận email từ ban tổ chức
* Đồng ý điều khoản tham gia
* Đồng ý sử dụng hình ảnh tại sự kiện
* Đăng ký nhận tài liệu sau sự kiện
* Nhận thông tin sự kiện tiếp theo

Category 5:
“Câu hỏi tùy chỉnh”

Fields:

* Short text
* Long text
* Dropdown
* Radio
* Checkbox
* Date

Add helper:
“Hạng vé không phải là field trong Form. Hạng vé được lấy từ Kho vé của sự kiện.”

==================================================
RIGHT PANEL — FORM PREVIEW
==========================

Create a sticky right preview panel.

Panel title:
“Preview Form”

Subtitle:
“Form hiển thị trên Landing Page”

Preview card:
Title:
“Đăng ký tham gia”

Description:
“Điền thông tin bên dưới để nhận vé QR tham dự sự kiện.”

Default fields:

* Họ và tên *
* Email *
* Số điện thoại *

If user selected optional fields, show them in preview:

* Công ty / Tổ chức
* Chức danh
* Bạn biết sự kiện qua đâu?

Button:
“Đăng ký ngay”

Data source label:
“Fields từ Form đăng ký của sự kiện”

If event has Kho vé:
Show small note above form:
“Người tham dự sẽ chọn hạng vé trước khi điền form.”

If event has no Kho vé:
Show:
“Sự kiện này đang dùng chế độ chỉ Form đăng ký.”

==================================================
FIELD CONFIGURATION PANEL / POPOVER
===================================

When user clicks a selected field, open a small configuration panel.

Panel title:
“Cấu hình field”

Fields:

1. “Tên field”
   Input

2. “Placeholder”
   Input

3. “Mô tả phụ”
   Input

4. “Bắt buộc”
   Toggle

5. “Hiển thị trên form”
   Toggle

For Dropdown / Radio / Checkbox fields:
Show:
“Danh sách lựa chọn”

* Option 1
* Option 2
* Option 3
  Button:
  “+ Thêm lựa chọn”

Default field rules:
For Họ và tên, Email, Số điện thoại:

* Cannot delete
* Required by default
* Show lock message:
  “Field mặc định không thể xóa khỏi form.”

==================================================
SCREEN 3 — FORM CREATED STATE
=============================

After clicking “Áp dụng thay đổi”, close modal and show Form đăng ký detail.

Toast:
“Tạo Form đăng ký thành công”

Form detail card:
Title:
“Form đăng ký sự kiện”

Status badge:
“Đã cấu hình”

Summary:

* “6 field”
* “3 field bắt buộc”
* “Cập nhật lần cuối: 30/06/2026”

Actions:

* “Chỉnh sửa Form”
* “Preview Form”
* “Nhân bản”
* “Xóa Form”

Field list table:
Columns:

* Thứ tự
* Field
* Kiểu field
* Bắt buộc
* Hiển thị
* Hành động

Rows:

1. Họ và tên — Text — Bắt buộc — Có
2. Email — Email — Bắt buộc — Có
3. Số điện thoại — Phone — Bắt buộc — Có
4. Công ty / Tổ chức — Text — Không — Có
5. Chức danh — Text — Không — Có
6. Bạn biết sự kiện qua đâu? — Dropdown — Không — Có

==================================================
SCREEN 4 — EDIT FORM FLOW
=========================

When user clicks “Chỉnh sửa Form”, open the same field selector modal.

Header:
“Chỉnh sửa Form đăng ký”

Selected fields should reflect current form fields.

Primary button:
“Lưu thay đổi”

If form is already used by published Landing Page, show warning:
“Form này đang được sử dụng trên Landing Page đã publish. Sau khi chỉnh sửa, bạn nên kiểm tra lại Landing Page trước khi publish lại.”

==================================================
SCREEN 5 — CREATE FORM FROM LANDING PAGE EDITOR
===============================================

Create a state inside Landing Page Editor left panel.

Data source card:
Title:
“Form đăng ký”

If no form:
Status:
“Chưa có Form đăng ký”

Description:
“Form dùng để thu thông tin người tham dự.”

Button:
“Tạo Form”

Click “Tạo Form”
→ Open the same “Tùy chỉnh Form đăng ký” modal
→ Default fields already selected:
Họ và tên, Email, Số điện thoại

After applying:

* Update left panel status to “Đã cấu hình”
* Update Landing Page preview to show the actual form fields

==================================================
VALIDATION MESSAGES
===================

Use these validation messages:

* “Form cần có ít nhất 3 field mặc định.”
* “Bạn chỉ có thể chọn tối đa 12 trường thông tin.”
* “Tên field không được để trống.”
* “Email là field bắt buộc và không thể xóa.”
* “Số điện thoại là field mặc định và không thể xóa.”
* “Vui lòng thêm ít nhất 2 lựa chọn cho field dạng Dropdown.”
* “Thay đổi đã được lưu.”

==================================================
INTERACTION RULES
=================

* Default fields are selected by default.
* Default fields cannot be deleted.
* Optional fields can be added or removed.
* Selected fields can be reordered by drag and drop.
* Preview updates in real time.
* Counter updates when fields are added or removed.
* If user reaches 12/12 fields, disable unselected field chips and show:
  “Bạn đã chọn tối đa 12 trường thông tin.”
* “Đặt lại mặc định” resets selected fields to:
  Họ và tên, Email, Số điện thoại
* “Áp dụng thay đổi” saves form configuration to the event’s Form đăng ký module.

==================================================
FINAL USER FLOW
===============

Event Workspace
→ Tab Form đăng ký
→ Click “Tạo Form đăng ký”
→ Modal opens with default fields selected
→ Admin selects additional fields from grouped field library
→ Admin reorders selected fields
→ Admin configures required/optional settings
→ Preview updates in real time
→ Click “Áp dụng thay đổi”
→ Form is saved to event
→ Landing Page automatically uses this Form đăng ký data
