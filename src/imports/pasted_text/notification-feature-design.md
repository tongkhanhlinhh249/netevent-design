Thiết kế tính năng Thông báo cho dashboard NetEvent dựa trên UI hiện tại.

Giữ nguyên visual system hiện có:

* Nền sáng, clean, nhiều khoảng trắng.
* Primary color xanh dương như hệ thống NetEvent hiện tại.
* Border bo góc mềm, shadow nhẹ.
* Font Be Vietnam Pro.
* Sidebar trái giữ nguyên gồm: Sự kiện, Quản lý thành viên, Cài đặt.
* Header phải có icon chuông thông báo, role “Chủ tài khoản”.

Mục tiêu:
Tạo hệ thống thông báo giúp người dùng theo dõi các cập nhật quan trọng về sự kiện, trang sự kiện, kho vé, người tham dự, check-in, thành viên và gói sử dụng.

Yêu cầu thiết kế các màn / trạng thái sau:

1. Notification Bell trên header

* Đặt icon chuông ở góc phải header.
* Khi có thông báo chưa đọc, hiển thị badge số lượng.
* Badge tối đa hiển thị “99+”.
* Trạng thái không có thông báo: chỉ hiển thị icon chuông bình thường.
* Trạng thái có thông báo mới: badge màu nổi bật, dễ nhận diện nhưng không quá gắt.

2. Dropdown thông báo nhanh
   Khi click vào icon chuông, mở dropdown bên phải.

Nội dung dropdown:

* Header: “Thông báo”
* Action nhỏ: “Đánh dấu tất cả là đã đọc”
* Tab: “Tất cả” và “Chưa đọc”
* Danh sách 5–7 thông báo mới nhất
* Mỗi item gồm:

  * Icon loại thông báo
  * Tiêu đề
  * Mô tả ngắn
  * Thời gian
  * Chấm xanh hoặc nền nhạt cho trạng thái chưa đọc
* Footer dropdown:

  * Button text: “Xem tất cả thông báo”

Mẫu item thông báo:

1. Trang sự kiện đã được xuất bản
   Người tham dự đã có thể truy cập trang đăng ký của sự kiện.
   2 phút trước

2. Có người tham dự mới
   Nguyễn Văn A vừa đăng ký tham gia NetEvent Demo Conference 2026.
   10 phút trước

3. Hạng vé sắp hết
   Hạng vé “Vé tiêu chuẩn” chỉ còn số lượng giới hạn.
   30 phút trước

4. Thành viên đã chấp nhận lời mời
   Hoàng Thị Mai đã tham gia tài khoản NetEvent.
   1 giờ trước

5. Gói sử dụng sắp hết hạn
   Gói hiện tại sẽ hết hạn trong thời gian tới. Vui lòng gia hạn để tiếp tục sử dụng.
   Hôm qua

6. Empty state trong dropdown
   Khi chưa có thông báo:

* Icon minh họa đơn giản
* Title: “Chưa có thông báo”
* Description: “Các cập nhật quan trọng về sự kiện, vé và người tham dự sẽ hiển thị tại đây.”

Khi không có thông báo chưa đọc:

* Title: “Bạn đã đọc hết thông báo”
* Description: “Không còn thông báo mới cần xử lý.”

4. Trang danh sách thông báo
   Tạo một màn riêng khi user click “Xem tất cả thông báo”.

Layout:

* Sidebar trái giữ nguyên.
* Header page: “Thông báo”
* Description: “Theo dõi các cập nhật quan trọng trong quá trình vận hành sự kiện.”
* Bộ lọc ngang:

  * Tất cả
  * Chưa đọc
  * Sự kiện
  * Trang sự kiện
  * Kho vé
  * Người tham dự
  * Check-in
  * Thành viên
  * Gói sử dụng
  * Hệ thống
* Search input:

  * Placeholder: “Tìm kiếm thông báo”
* Button phụ:

  * “Đánh dấu tất cả là đã đọc”

Danh sách thông báo dạng card hoặc list row:
Mỗi thông báo gồm:

* Icon loại thông báo
* Title
* Description
* Tên sự kiện liên quan nếu có
* Thời gian
* Trạng thái: “Chưa đọc” hoặc “Đã đọc”
* Action: “Xem chi tiết”

5. Phân loại icon/thẻ thông báo
   Dùng icon và màu nhẹ để phân biệt:

* Sự kiện: xanh dương
* Trang sự kiện: tím hoặc xanh nhạt
* Kho vé: cam
* Người tham dự: xanh lá
* Check-in: teal
* Thành viên: indigo
* Gói sử dụng / thanh toán: đỏ hoặc vàng cảnh báo
* Hệ thống: xám

6. Mức độ ưu tiên
   Thiết kế 3 mức:

* Thông tin: nền xanh nhạt / icon xanh
* Cần chú ý: nền vàng nhạt / icon vàng
* Quan trọng: nền đỏ nhạt / icon đỏ

Không làm UI quá nặng, chỉ dùng màu để user scan nhanh.

7. Trạng thái lỗi tải thông báo
   Tạo state:

* Title: “Không thể tải thông báo”
* Description: “Vui lòng kiểm tra kết nối hoặc thử lại sau.”
* Button: “Thử lại”

8. Empty state trang thông báo
   Khi chưa có thông báo nào:

* Icon minh họa lớn ở giữa
* Title: “Chưa có thông báo”
* Description: “Các cập nhật quan trọng về sự kiện, vé, người tham dự và tài khoản sẽ hiển thị tại đây.”
* Không cần CTA chính.

9. Chi tiết microcopy cần dùng
   Dropdown:

* “Thông báo”
* “Tất cả”
* “Chưa đọc”
* “Đánh dấu tất cả là đã đọc”
* “Xem tất cả thông báo”

Trang thông báo:

* “Thông báo”
* “Theo dõi các cập nhật quan trọng trong quá trình vận hành sự kiện.”
* “Tìm kiếm thông báo”
* “Xem chi tiết”

Trạng thái:

* “Chưa đọc”
* “Đã đọc”
* “Cần chú ý”
* “Quan trọng”

10. Hành vi UX cần thể hiện

* Click vào thông báo sẽ điều hướng tới màn hình liên quan.
* Thông báo chưa đọc có nền nhạt hoặc dot nhận diện.
* Khi click vào thông báo, trạng thái chuyển thành đã đọc.
* Không tự động đánh dấu đã đọc chỉ vì user mở dropdown.
* Cho phép đánh dấu tất cả là đã đọc.
* Không cần chức năng xóa thông báo trong MVP.

11. Ví dụ các thông báo cần hiển thị trong thiết kế
    Sự kiện đã được tạo
    “NetEvent Demo Conference 2026” đã được tạo thành công.

Trang sự kiện đã được xuất bản
Người tham dự đã có thể truy cập trang đăng ký của sự kiện.

Không thể xuất bản trang sự kiện
Vui lòng kiểm tra thông tin sự kiện và cấu hình vé trước khi xuất bản.

Có người tham dự mới
Nguyễn Văn A vừa đăng ký tham gia sự kiện.

Hạng vé sắp hết
Hạng vé “Vé tiêu chuẩn” chỉ còn số lượng giới hạn.

Check-in thành công
Vé của Nguyễn Văn A đã được check-in.

Thành viên đã chấp nhận lời mời
Hoàng Thị Mai đã tham gia tài khoản NetEvent.

Gói sử dụng sắp hết hạn
Gói hiện tại sẽ hết hạn trong thời gian tới. Vui lòng gia hạn để tiếp tục sử dụng.

12. Yêu cầu cuối

* Thiết kế tối thiểu 3 frame:

  1. Dashboard có notification bell và dropdown đang mở
  2. Trang danh sách thông báo
  3. Empty state / error state của thông báo
* Giữ đồng bộ với style dashboard NetEvent hiện tại.
* Text phải hoàn toàn bằng tiếng Việt, không dùng lẫn tiếng Anh trừ tên sản phẩm NetEvent.
* UI phải rõ ràng, dễ dùng cho người vận hành sự kiện.
