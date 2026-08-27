# Tài liệu nghiệp vụ — Quản lý tài khoản người dùng NetEvent

## 1. Mục tiêu

Tài liệu này mô tả nghiệp vụ quản lý tài khoản người dùng trong NetEvent, bao gồm đăng ký, đăng nhập, quên mật khẩu, xác thực email, quản lý hồ sơ tài khoản và phân quyền người dùng trong hệ thống.

NetEvent là nền tảng quản lý sự kiện theo mô hình self-service SaaS. Khách hàng có thể tự tạo tài khoản, mua gói sự kiện, tạo và vận hành sự kiện. Trong mỗi tài khoản doanh nghiệp/tổ chức, người dùng có thể được phân quyền theo vai trò khác nhau để đảm bảo đúng phạm vi truy cập và vận hành.

---

## 2. Phạm vi chức năng

### 2.1 Trong phạm vi MVP

- Đăng ký tài khoản bằng email.
- Xác thực email bằng OTP.
- Đăng nhập bằng email và mật khẩu.
- Quên mật khẩu bằng email.
- Gửi OTP đặt lại mật khẩu qua email.
- Tạo mật khẩu mới.
- Quản lý hồ sơ tài khoản cơ bản.
- Phân quyền người dùng trong account.
- Vai trò Admin có toàn quyền quản lý sự kiện trong account.
- Vai trò Staff sự kiện chỉ được truy cập chức năng Check-in / Check-out.
- Admin có thể mời Staff tham gia sự kiện.
- Admin có thể kích hoạt, vô hiệu hóa hoặc xóa quyền truy cập của Staff.

### 2.2 Chưa đưa vào MVP

- Đăng nhập Google/Facebook/SSO.
- Xác thực 2 lớp nâng cao.
- Phân quyền chi tiết theo từng module nâng cao.
- Audit log nâng cao.
- Quản lý phòng ban nội bộ.
- Super Admin tạo tài khoản khách hàng thủ công.
- Staff được chỉnh sửa sự kiện, landing page, form hoặc kho vé.

---

## 3. Đối tượng người dùng

| Vai trò | Mô tả |
|---|---|
| Account Owner | Chủ tài khoản doanh nghiệp/tổ chức. Người đăng ký tài khoản đầu tiên và có quyền cao nhất trong account. |
| Admin | Người quản trị trong account, có quyền tạo và quản lý sự kiện, landing page, form, kho vé, người tham dự và báo cáo. |
| Event Staff | Nhân sự hỗ trợ vận hành sự kiện. Chỉ được truy cập chức năng Check-in / Check-out của sự kiện được phân công. |
| Attendee | Người tham dự sự kiện. Không đăng nhập dashboard, chỉ truy cập landing page để đăng ký và nhận vé QR. |

---

## 4. Trạng thái tài khoản người dùng

| Trạng thái | Ý nghĩa |
|---|---|
| Pending Verification | Người dùng đã đăng ký nhưng chưa xác thực email. |
| Active | Tài khoản đã xác thực và có thể đăng nhập. |
| Invited | Người dùng được Admin mời vào account hoặc sự kiện nhưng chưa kích hoạt. |
| Suspended | Tài khoản bị tạm khóa, không thể đăng nhập. |
| Removed | Người dùng bị gỡ khỏi account hoặc sự kiện. |

---

# 5. Luồng đăng ký tài khoản

## 5.1 Mục tiêu

Cho phép khách hàng tự tạo tài khoản NetEvent bằng email để bắt đầu mua gói sự kiện và sử dụng hệ thống.

## 5.2 Flow tổng

```text
Người dùng vào trang Đăng ký
→ Nhập thông tin tài khoản
→ Submit form
→ Hệ thống kiểm tra dữ liệu
→ Hệ thống gửi OTP xác thực qua email
→ Người dùng nhập OTP
→ Xác thực thành công
→ Tạo tài khoản Active
→ Điều hướng đến màn Chọn / mua gói sự kiện
```

## 5.3 Form đăng ký

| Trường thông tin | Bắt buộc | Ghi chú |
|---|---:|---|
| Họ và tên | Có | Tên người đại diện tài khoản |
| Email | Có | Dùng để đăng nhập và nhận OTP |
| Số điện thoại | Có | Dùng để liên hệ hỗ trợ |
| Tên tổ chức / doanh nghiệp | Có | Tạo account workspace |
| Mật khẩu | Có | Tối thiểu 8 ký tự |
| Xác nhận mật khẩu | Có | Phải trùng mật khẩu |
| Đồng ý điều khoản | Có | User phải tích chọn |

## 5.4 Business rules

- Email không được trùng với tài khoản đã tồn tại.
- Email phải đúng định dạng.
- Mật khẩu tối thiểu 8 ký tự.
- Xác nhận mật khẩu phải trùng mật khẩu.
- Người dùng phải xác thực OTP email trước khi tài khoản được kích hoạt.
- Account đầu tiên được tạo sẽ mặc định là Account Owner.
- Sau khi đăng ký thành công, account chưa có gói sử dụng cho đến khi user mua gói.

## 5.5 Error cases

| Trường hợp | Thông báo |
|---|---|
| Email đã tồn tại | Email này đã được sử dụng. Vui lòng đăng nhập hoặc dùng email khác. |
| Email sai định dạng | Email không hợp lệ. |
| Mật khẩu quá ngắn | Mật khẩu cần có tối thiểu 8 ký tự. |
| Xác nhận mật khẩu sai | Mật khẩu xác nhận không khớp. |
| Chưa đồng ý điều khoản | Vui lòng đồng ý với điều khoản sử dụng để tiếp tục. |

---

# 6. Luồng xác thực email bằng OTP

## 6.1 Mục tiêu

Xác nhận người dùng sở hữu email đã đăng ký trước khi kích hoạt tài khoản.

## 6.2 Flow tổng

```text
User submit đăng ký
→ Hệ thống tạo OTP
→ Gửi OTP đến email đăng ký
→ User nhập OTP
→ Hệ thống kiểm tra OTP
→ Nếu đúng: kích hoạt tài khoản
→ Nếu sai/hết hạn: hiển thị lỗi
```

## 6.3 Màn nhập OTP

Nội dung đề xuất:

```text
Xác thực email

Chúng tôi đã gửi mã OTP đến email:
example@email.com

Vui lòng nhập mã OTP để hoàn tất đăng ký.
```

Thành phần màn hình:

| Thành phần | Ghi chú |
|---|---|
| Ô nhập OTP | 6 chữ số |
| Gửi lại mã | Chỉ bật sau 60 giây |
| Đổi email | Cho phép quay lại chỉnh email |
| CTA xác nhận | Xác thực tài khoản |

## 6.4 Business rules

- OTP gồm 6 chữ số.
- OTP có hiệu lực trong 5 phút.
- User có thể gửi lại OTP sau 60 giây.
- OTP mới sẽ làm OTP cũ hết hiệu lực.
- Tối đa 5 lần nhập sai OTP.
- Nếu nhập sai quá số lần cho phép, user phải gửi lại OTP mới.

## 6.5 Error cases

| Trường hợp | Thông báo |
|---|---|
| OTP sai | Mã OTP không chính xác. Vui lòng kiểm tra lại. |
| OTP hết hạn | Mã OTP đã hết hạn. Vui lòng gửi lại mã mới. |
| Nhập sai quá nhiều | Bạn đã nhập sai quá số lần cho phép. Vui lòng gửi lại mã mới. |
| Chưa nhận được email | Vui lòng kiểm tra hộp thư đến hoặc thư mục spam. |

---

# 7. Luồng đăng nhập

## 7.1 Mục tiêu

Cho phép người dùng đã có tài khoản truy cập vào dashboard NetEvent theo đúng quyền được cấp.

## 7.2 Flow tổng

```text
Người dùng vào trang Đăng nhập
→ Nhập email và mật khẩu
→ Submit
→ Hệ thống kiểm tra thông tin
→ Kiểm tra trạng thái tài khoản
→ Kiểm tra vai trò người dùng
→ Điều hướng vào màn phù hợp theo quyền
```

## 7.3 Form đăng nhập

| Trường thông tin | Bắt buộc | Ghi chú |
|---|---:|---|
| Email | Có | Email đã đăng ký |
| Mật khẩu | Có | Mật khẩu tài khoản |
| Ghi nhớ đăng nhập | Không | Checkbox |
| Quên mật khẩu | Không | Link sang flow reset password |

## 7.4 Điều hướng sau đăng nhập

| Vai trò | Màn điều hướng mặc định |
|---|---|
| Account Owner | Dashboard tổng quan |
| Admin | Dashboard sự kiện |
| Event Staff | Màn Check-in / Check-out của sự kiện được phân công |

## 7.5 Business rules

- Chỉ tài khoản Active mới được đăng nhập.
- Nếu email chưa xác thực, chuyển user sang màn xác thực OTP.
- Nếu tài khoản bị khóa, không cho đăng nhập.
- Nếu user là Staff, chỉ hiển thị module Check-in / Check-out.
- Staff không được truy cập Dashboard, Landing Page, Form đăng ký, Kho vé, Email, Báo cáo hoặc Cài đặt.

## 7.6 Error cases

| Trường hợp | Thông báo |
|---|---|
| Sai email/mật khẩu | Email hoặc mật khẩu không chính xác. |
| Email chưa xác thực | Email chưa được xác thực. Vui lòng xác thực để tiếp tục. |
| Tài khoản bị khóa | Tài khoản của bạn đang bị khóa. Vui lòng liên hệ quản trị viên. |
| Không có quyền truy cập | Bạn không có quyền truy cập khu vực này. |
| Đăng nhập sai nhiều lần | Bạn đã đăng nhập sai quá nhiều lần. Vui lòng thử lại sau. |

---

# 8. Luồng quên mật khẩu

## 8.1 Mục tiêu

Cho phép người dùng đặt lại mật khẩu thông qua email đã đăng ký.

## 8.2 Flow tổng

```text
User bấm Quên mật khẩu
→ Nhập email đã đăng ký
→ Hệ thống kiểm tra email
→ Gửi OTP đặt lại mật khẩu qua email
→ User nhập OTP
→ User tạo mật khẩu mới
→ Hệ thống cập nhật mật khẩu
→ Đăng xuất các phiên cũ
→ Điều hướng về trang Đăng nhập
```

## 8.3 Màn nhập email

Nội dung đề xuất:

```text
Quên mật khẩu

Nhập email đã đăng ký để nhận mã xác nhận đặt lại mật khẩu.
```

| Trường | Bắt buộc |
|---|---:|
| Email | Có |

CTA:

```text
Gửi mã xác nhận
```

## 8.4 Màn nhập OTP đặt lại mật khẩu

Nội dung đề xuất:

```text
Xác nhận email

Chúng tôi đã gửi mã OTP đặt lại mật khẩu đến email của bạn.
Vui lòng nhập mã để tiếp tục.
```

| Thành phần | Ghi chú |
|---|---|
| OTP | 6 chữ số |
| Gửi lại mã | Bật sau 60 giây |
| Đổi email | Quay lại nhập email khác |

## 8.5 Màn tạo mật khẩu mới

| Trường | Bắt buộc | Ghi chú |
|---|---:|---|
| Mật khẩu mới | Có | Tối thiểu 8 ký tự |
| Xác nhận mật khẩu mới | Có | Phải trùng mật khẩu mới |

CTA:

```text
Cập nhật mật khẩu
```

## 8.6 Business rules

- Chỉ email đã đăng ký mới được reset mật khẩu.
- OTP reset mật khẩu có hiệu lực trong 5 phút.
- OTP chỉ dùng một lần.
- Mật khẩu mới tối thiểu 8 ký tự.
- Xác nhận mật khẩu mới phải trùng mật khẩu mới.
- Sau khi đổi mật khẩu thành công, các phiên đăng nhập cũ nên bị đăng xuất.

## 8.7 Error cases

| Trường hợp | Thông báo |
|---|---|
| Email không tồn tại | Email này chưa được đăng ký trong hệ thống. |
| OTP sai | Mã xác nhận không chính xác. |
| OTP hết hạn | Mã xác nhận đã hết hạn. Vui lòng gửi lại mã mới. |
| Mật khẩu không hợp lệ | Mật khẩu cần có tối thiểu 8 ký tự. |
| Xác nhận mật khẩu sai | Mật khẩu xác nhận không khớp. |
| Đổi mật khẩu thành công | Mật khẩu đã được cập nhật. Vui lòng đăng nhập lại. |

---

# 9. Phân quyền người dùng

## 9.1 Mục tiêu

Đảm bảo mỗi người dùng chỉ được truy cập đúng chức năng theo vai trò được phân quyền trong account hoặc trong từng sự kiện.

## 9.2 Danh sách vai trò

| Vai trò | Phạm vi | Mô tả |
|---|---|---|
| Account Owner | Toàn account | Chủ tài khoản, toàn quyền quản lý account, gói sử dụng, user và sự kiện. |
| Admin | Toàn account hoặc theo sự kiện | Quản trị sự kiện, cấu hình landing page, form, kho vé, attendee, email và báo cáo. |
| Event Staff | Theo sự kiện được phân công | Chỉ được truy cập Check-in / Check-out. |

---

# 10. Quyền của Account Owner

Account Owner có toàn quyền trong account.

## 10.1 Quyền chính

- Xem dashboard tổng quan.
- Quản lý hồ sơ tổ chức.
- Xem và mua gói sự kiện.
- Quản lý subscription.
- Tạo sự kiện.
- Chỉnh sửa sự kiện.
- Publish sự kiện.
- Tạo Landing Page.
- Tạo Form đăng ký.
- Tạo Kho vé.
- Quản lý hạng vé.
- Quản lý người tham dự.
- Quản lý email xác nhận.
- Check-in / Check-out.
- Xem báo cáo.
- Mời Admin.
- Mời Event Staff.
- Vô hiệu hóa hoặc gỡ người dùng khỏi account.
- Cấu hình account.

---

# 11. Quyền của Admin

Admin là người vận hành chính trong account hoặc trong sự kiện được phân quyền.

## 11.1 Quyền chính

- Xem dashboard sự kiện.
- Tạo sự kiện nếu được cấp quyền.
- Chỉnh sửa sự kiện.
- Cấu hình Landing Page.
- Cấu hình Form đăng ký.
- Cấu hình Kho vé.
- Tạo và chỉnh sửa hạng vé.
- Quản lý danh sách người tham dự.
- Gửi lại email xác nhận.
- Check-in / Check-out.
- Xem báo cáo sự kiện.
- Mời Event Staff vào sự kiện nếu được cấp quyền.

## 11.2 Giới hạn

- Không được thay đổi chủ sở hữu account.
- Không được xóa account.
- Không được thay đổi gói sử dụng nếu không được cấp quyền.
- Không được truy cập cấu hình billing nếu chỉ là Event Admin.

---

# 12. Quyền của Event Staff

Event Staff là vai trò giới hạn nhất, dùng cho nhân sự vận hành tại sự kiện.

## 12.1 Nguyên tắc

Staff chỉ được truy cập chức năng Check-in / Check-out của sự kiện được phân công. Staff không được truy cập các module quản trị khác.

## 12.2 Quyền được phép

- Đăng nhập hệ thống.
- Xem danh sách sự kiện được phân công.
- Mở màn Check-in của sự kiện được phân công.
- Scan QR để check-in.
- Tìm người tham dự bằng tên, email, số điện thoại hoặc mã vé.
- Check-in thủ công.
- Check-out nếu hệ thống bật chức năng check-out.
- Xem trạng thái vé cơ bản:
  - Hợp lệ
  - Đã check-in
  - Đã check-out
  - Không hợp lệ
  - Không thuộc sự kiện
- Xem số liệu vận hành cơ bản trong phiên check-in:
  - Tổng vé
  - Đã check-in
  - Chưa check-in
  - Đã check-out nếu có

## 12.3 Quyền không được phép

Staff không được:

- Tạo sự kiện.
- Chỉnh sửa thông tin sự kiện.
- Publish sự kiện.
- Tạo hoặc sửa Landing Page.
- Tạo hoặc sửa Form đăng ký.
- Tạo hoặc sửa Kho vé.
- Tạo hoặc sửa Hạng vé.
- Xem giá vé nếu không cần thiết cho check-in.
- Xem báo cáo doanh thu.
- Export danh sách attendee.
- Xóa attendee.
- Gửi email hàng loạt.
- Quản lý gói sử dụng.
- Mời thêm user.
- Truy cập cài đặt account.

---

# 13. Ma trận phân quyền MVP

| Chức năng | Account Owner | Admin | Event Staff |
|---|---:|---:|---:|
| Đăng nhập | Có | Có | Có |
| Xem dashboard tổng quan | Có | Có | Không |
| Quản lý hồ sơ tổ chức | Có | Hạn chế | Không |
| Xem / mua gói dịch vụ | Có | Hạn chế | Không |
| Quản lý subscription | Có | Hạn chế | Không |
| Tạo sự kiện | Có | Có nếu được cấp quyền | Không |
| Chỉnh sửa sự kiện | Có | Có | Không |
| Publish sự kiện | Có | Có nếu được cấp quyền | Không |
| Tạo Landing Page | Có | Có | Không |
| Sửa Landing Page | Có | Có | Không |
| Tạo Form đăng ký | Có | Có | Không |
| Sửa Form đăng ký | Có | Có | Không |
| Tạo Kho vé | Có | Có | Không |
| Sửa Kho vé | Có | Có | Không |
| Tạo / sửa Hạng vé | Có | Có | Không |
| Xem danh sách attendee | Có | Có | Hạn chế |
| Export attendee | Có | Có nếu được cấp quyền | Không |
| Gửi lại email vé | Có | Có | Không |
| Scan QR check-in | Có | Có | Có |
| Check-in thủ công | Có | Có | Có |
| Check-out | Có | Có | Có nếu được bật |
| Xem báo cáo | Có | Có | Không |
| Mời Admin | Có | Không / tùy quyền | Không |
| Mời Staff | Có | Có nếu được cấp quyền | Không |
| Xóa user khỏi account | Có | Không | Không |
| Cài đặt account | Có | Hạn chế | Không |

---

# 14. Luồng mời Admin / Staff

## 14.1 Mời Admin

```text
Account Owner vào Quản lý thành viên
→ Bấm Mời thành viên
→ Nhập email
→ Chọn vai trò Admin
→ Chọn phạm vi quyền
→ Gửi lời mời
→ Người được mời nhận email
→ Người được mời tạo mật khẩu hoặc đăng nhập
→ Tài khoản được thêm vào account với vai trò Admin
```

## 14.2 Mời Event Staff

```text
Admin / Account Owner vào Event Workspace
→ Vào tab Staff / Phân quyền
→ Bấm Mời Staff
→ Nhập email hoặc danh sách email
→ Chọn sự kiện áp dụng
→ Chọn quyền: Check-in / Check-out
→ Gửi lời mời
→ Staff nhận email
→ Staff tạo mật khẩu hoặc đăng nhập
→ Staff chỉ thấy màn Check-in của sự kiện được phân công
```

## 14.3 Business rules

- Một Staff có thể được phân công vào nhiều sự kiện.
- Staff chỉ nhìn thấy các sự kiện được phân công.
- Staff bị gỡ khỏi sự kiện sẽ mất quyền truy cập check-in của sự kiện đó.
- Nếu Staff bị vô hiệu hóa khỏi account, Staff không thể đăng nhập.
- Lời mời có thời hạn, ví dụ 7 ngày.
- Nếu lời mời hết hạn, Admin có thể gửi lại.

---

# 15. Luồng truy cập của Staff

## 15.1 Flow tổng

```text
Staff đăng nhập
→ Hệ thống kiểm tra vai trò
→ Nếu role = Event Staff
→ Điều hướng vào Staff Check-in Portal
→ Hiển thị danh sách sự kiện được phân công
→ Staff chọn sự kiện
→ Mở màn Check-in / Check-out
```

## 15.2 Staff Check-in Portal

Màn Staff chỉ gồm các chức năng cần thiết:

- Danh sách sự kiện được phân công.
- Màn scan QR.
- Tìm kiếm attendee.
- Check-in thủ công.
- Check-out nếu được bật.
- Lịch sử check-in gần nhất.
- Thông báo lỗi vé.

Không hiển thị sidebar đầy đủ của admin dashboard.

## 15.3 Check-in / Check-out states

| Trạng thái | Ý nghĩa |
|---|---|
| Vé hợp lệ | Vé thuộc sự kiện và chưa check-in. |
| Check-in thành công | Vé được ghi nhận vào sự kiện. |
| Đã check-in | Vé đã được check-in trước đó. |
| Check-out thành công | Người tham dự đã được ghi nhận rời sự kiện. |
| Đã check-out | Người tham dự đã check-out trước đó. |
| Vé không hợp lệ | QR/mã vé sai hoặc không tồn tại. |
| Sai sự kiện | Vé hợp lệ nhưng không thuộc sự kiện Staff đang check-in. |

---

# 16. Check-in / Check-out business rules

## 16.1 Check-in

- Staff chỉ check-in được sự kiện được phân công.
- Vé phải thuộc đúng sự kiện.
- Vé phải hợp lệ.
- Vé chưa bị hủy.
- Vé chưa check-in trước đó.
- Nếu vé đã check-in, hệ thống hiển thị thời gian check-in trước đó.
- Mỗi vé chỉ được check-in thành công một lần.

## 16.2 Check-out

- Check-out chỉ hiển thị nếu sự kiện bật chức năng check-out.
- Chỉ vé đã check-in mới được check-out.
- Vé chưa check-in không thể check-out.
- Có thể cho phép check-in lại sau check-out nếu business rule của sự kiện bật “cho phép vào lại”.
- Nếu không bật vào lại, vé đã check-out sẽ không thể check-in lại.

## 16.3 Dữ liệu lưu lại

Mỗi lần check-in/check-out cần lưu:

| Dữ liệu | Ghi chú |
|---|---|
| Ticket ID | Vé được xử lý |
| Event ID | Sự kiện liên quan |
| Staff ID | Người thực hiện |
| Action | Check-in hoặc Check-out |
| Timestamp | Thời gian thực hiện |
| Device info | Nếu có |
| Result | Thành công / thất bại |
| Error reason | Nếu thất bại |

---

# 17. Màn hình cần thiết

| Màn hình | Đối tượng | Mục đích |
|---|---|---|
| Đăng ký | Khách hàng | Tạo tài khoản mới |
| Xác thực OTP đăng ký | Khách hàng | Xác nhận email |
| Đăng nhập | Tất cả user | Truy cập hệ thống |
| Quên mật khẩu | Tất cả user | Nhập email để reset |
| Xác thực OTP reset | Tất cả user | Xác nhận quyền đổi mật khẩu |
| Tạo mật khẩu mới | Tất cả user | Cập nhật mật khẩu mới |
| Quản lý thành viên | Owner/Admin | Mời và quản lý user |
| Mời thành viên | Owner/Admin | Mời Admin hoặc Staff |
| Phân quyền sự kiện | Owner/Admin | Gán Staff vào sự kiện |
| Staff Check-in Portal | Staff | Truy cập check-in/check-out |
| Màn scan QR | Staff/Admin | Scan vé QR |
| Check-in thủ công | Staff/Admin | Tìm kiếm và xử lý thủ công |

---

# 18. Email hệ thống

## 18.1 Email OTP đăng ký

Subject:

```text
Mã xác thực tài khoản NetEvent
```

Nội dung:

```text
Xin chào,

Bạn đang đăng ký tài khoản NetEvent.

Mã xác thực của bạn là:

[OTP]

Mã này có hiệu lực trong 5 phút. Vui lòng không chia sẻ mã này cho bất kỳ ai.

Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.
```

## 18.2 Email OTP quên mật khẩu

Subject:

```text
Mã xác nhận đặt lại mật khẩu NetEvent
```

Nội dung:

```text
Xin chào,

Bạn vừa yêu cầu đặt lại mật khẩu cho tài khoản NetEvent.

Mã xác nhận của bạn là:

[OTP]

Mã này có hiệu lực trong 5 phút. Vui lòng không chia sẻ mã này cho bất kỳ ai.

Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
```

## 18.3 Email mời Admin / Staff

Subject:

```text
Bạn được mời tham gia NetEvent
```

Nội dung:

```text
Xin chào,

Bạn được mời tham gia NetEvent với vai trò [Vai trò].

Tài khoản / Sự kiện:
[Tên account hoặc tên sự kiện]

Vui lòng bấm vào liên kết bên dưới để chấp nhận lời mời và thiết lập tài khoản:

[Link mời]

Liên kết này có hiệu lực trong 7 ngày.

Nếu bạn không biết lời mời này, vui lòng bỏ qua email.
```

---

# 19. Kết luận

Luồng quản lý tài khoản người dùng của NetEvent cần đảm bảo ba mục tiêu chính: dễ đăng ký/đăng nhập, an toàn khi xác thực bằng email OTP và rõ ràng trong phân quyền vận hành sự kiện.

Trong MVP, vai trò quan trọng nhất cần kiểm soát là Event Staff. Staff chỉ được truy cập màn Check-in / Check-out của sự kiện được phân công, không được truy cập các module quản trị như Landing Page, Form đăng ký, Kho vé, Báo cáo hay Cài đặt account.
