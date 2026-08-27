Chỉnh sửa màn Thông báo của NetEvent theo hướng giảm nhiễu, chỉ hiển thị các thông báo thật sự cần biết hoặc cần xử lý.

Giữ nguyên visual system hiện tại:

* Nền sáng, clean, nhiều khoảng trắng.
* Primary color xanh dương.
* Border bo góc mềm, shadow nhẹ.
* Font Be Vietnam Pro.
* Sidebar, header và layout tổng thể giữ nguyên.
* Không thay đổi cấu trúc lớn, chỉ tối ưu nội dung, trạng thái, CTA và cách hiển thị danh sách thông báo.

Mục tiêu UX:
Notification Center không phải nơi ghi lại mọi thao tác thành công. Chỉ hiển thị các cập nhật quan trọng, cảnh báo hoặc việc cần người dùng xử lý. Các thao tác thành công như “Đã tạo sự kiện”, “Đã lưu thay đổi”, “Check-in thành công” chỉ nên hiển thị bằng toast hoặc đưa vào Nhật ký hoạt động, không đưa vào danh sách thông báo chính.

Yêu cầu chỉnh sửa chính:

1. Loại bỏ các thông báo không cần thiết khỏi Notification Center
   Không hiển thị trong danh sách thông báo chính các item sau:

* Sự kiện đã được tạo
* Check-in thành công
* Đã lưu thay đổi
* Đã tạo kho vé
* Đã tạo trang sự kiện
* Đã cập nhật thông tin
* Đã xuất file thành công

Các trạng thái này chỉ nên dùng toast ngắn:

* “Đã tạo sự kiện thành công.”
* “Đã lưu thay đổi.”
* “Check-in thành công.”
* “Đã xuất file thành công.”

2. Giữ lại các thông báo có giá trị xử lý
   Danh sách thông báo chính chỉ nên hiển thị các nhóm sau:

Nhóm Cần xử lý:

* Không thể xuất bản trang sự kiện
* Hạng vé sắp hết
* Hạng vé đã hết
* Gói sử dụng sắp hết hạn
* Gói sử dụng đã hết hạn
* Thanh toán không thành công
* Thành viên cần được phân quyền
* Có đăng ký cần xác nhận

Nhóm Cập nhật quan trọng:

* Trang sự kiện đã được xuất bản
* Thành viên đã chấp nhận lời mời
* Vai trò thành viên đã được thay đổi
* Sự kiện sắp diễn ra
* Danh sách người tham dự đã được xuất

Nhóm thông báo gộp:

* Có 12 người tham dự mới trong hôm nay
* Có 8 lượt check-in trong 30 phút qua
* Có 3 hạng vé gần đạt giới hạn

3. Gộp thông báo trùng lặp
   Không hiển thị từng thông báo riêng cho mỗi người tham dự mới hoặc mỗi lượt check-in.
   Thay vào đó, gộp theo khoảng thời gian hoặc theo ngày.

Ví dụ:
Title: “Có 12 người tham dự mới”
Description: “NetEvent Demo Conference 2026 có thêm 12 lượt đăng ký trong hôm nay.”
CTA: “Xem danh sách”

Ví dụ:
Title: “Có 8 lượt check-in gần đây”
Description: “Sự kiện Hội thảo AI 2025 ghi nhận 8 lượt check-in trong 30 phút qua.”
CTA: “Xem check-in”

4. Đổi CTA theo ngữ cảnh
   Không dùng chung toàn bộ là “Xem chi tiết”.
   Thay CTA theo từng loại thông báo:

* Gói sử dụng sắp hết hạn → “Gia hạn”
* Hạng vé sắp hết → “Quản lý vé”
* Có người tham dự mới → “Xem danh sách”
* Trang sự kiện đã xuất bản → “Xem trang”
* Thành viên đã chấp nhận lời mời → “Xem thành viên”
* Không thể xuất bản trang sự kiện → “Kiểm tra ngay”
* Sự kiện sắp diễn ra → “Xem sự kiện”
* Thanh toán không thành công → “Kiểm tra thanh toán”

5. Cập nhật danh sách thông báo mẫu trên UI
   Thay danh sách hiện tại bằng các item sau:

Item 1:
Title: “Gói sử dụng sắp hết hạn”
Description: “Gói hiện tại sẽ hết hạn trong thời gian tới. Gia hạn để không gián đoạn vận hành sự kiện.”
Meta: “Hôm qua · Gói sử dụng”
Status: “Cần xử lý”
CTA: “Gia hạn”

Item 2:
Title: “Hạng vé sắp hết”
Description: “Hạng vé ‘Vé tiêu chuẩn’ chỉ còn số lượng giới hạn.”
Meta: “30 phút trước · Kho vé”
Status: “Cần chú ý”
CTA: “Quản lý vé”

Item 3:
Title: “Có 12 người tham dự mới”
Description: “NetEvent Demo Conference 2026 có thêm 12 lượt đăng ký trong hôm nay.”
Meta: “10 phút trước · Người tham dự”
Status: “Chưa đọc”
CTA: “Xem danh sách”

Item 4:
Title: “Trang sự kiện đã được xuất bản”
Description: “Người tham dự đã có thể truy cập trang đăng ký của sự kiện.”
Meta: “2 phút trước · Trang sự kiện”
Status: “Chưa đọc”
CTA: “Xem trang”

Item 5:
Title: “Thành viên đã chấp nhận lời mời”
Description: “Hoàng Thị Mai đã tham gia tài khoản NetEvent.”
Meta: “1 giờ trước · Thành viên”
Status: “Đã đọc”
CTA: “Xem thành viên”

Item 6:
Title: “Không thể xuất bản trang sự kiện”
Description: “Vui lòng kiểm tra thông tin sự kiện và cấu hình vé trước khi xuất bản.”
Meta: “Hôm nay · Trang sự kiện”
Status: “Quan trọng”
CTA: “Kiểm tra ngay”

6. Tối ưu tab lọc
   Thay hoặc bổ sung nhóm tab lọc theo mức độ ưu tiên:

Tabs đề xuất:

* Tất cả
* Cần xử lý
* Chưa đọc
* Cảnh báo
* Cập nhật

Có thể giữ filter theo module ở dạng dropdown hoặc chip phụ:

* Sự kiện
* Trang sự kiện
* Kho vé
* Người tham dự
* Check-in
* Thành viên
* Gói sử dụng
* Hệ thống

7. Quy tắc hiển thị trạng thái
   Thông báo chưa đọc:

* Nền xanh rất nhạt hoặc border xanh nhạt.
* Có dot xanh nhỏ ở bên phải hoặc gần title.
* Có badge “Chưa đọc”.

Thông báo cần xử lý:

* Badge “Cần xử lý”.
* Màu cam hoặc đỏ nhẹ, không quá gắt.

Thông báo quan trọng:

* Badge “Quan trọng”.
* Icon cảnh báo hoặc màu đỏ nhạt.

Thông báo đã đọc:

* Nền trắng.
* Không có dot xanh.
* Text giảm độ nổi bật nhẹ.

8. Empty state
   Khi chưa có thông báo:
   Title: “Chưa có thông báo”
   Description: “Các cập nhật quan trọng về sự kiện, vé, người tham dự và tài khoản sẽ hiển thị tại đây.”

Khi không có thông báo cần xử lý:
Title: “Không có việc cần xử lý”
Description: “Các cảnh báo quan trọng sẽ hiển thị tại đây khi có phát sinh.”

Khi không có thông báo chưa đọc:
Title: “Bạn đã đọc hết thông báo”
Description: “Không còn thông báo mới cần xử lý.”

9. Error state
   Title: “Không thể tải thông báo”
   Description: “Vui lòng kiểm tra kết nối hoặc thử lại sau.”
   Button: “Thử lại”

10. Dropdown thông báo trên header
    Tối ưu dropdown để chỉ hiển thị 4–5 thông báo quan trọng nhất, ưu tiên:

11. Quan trọng

12. Cần xử lý

13. Chưa đọc

14. Mới nhất

Header dropdown:

* Title: “Thông báo”
* Action: “Đánh dấu tất cả là đã đọc”

Footer:

* Button text: “Xem tất cả thông báo”

11. Không thêm chức năng xóa thông báo trong MVP
    Không thiết kế nút “Xóa thông báo”.
    Chỉ có:

* Đánh dấu đã đọc
* Xem chi tiết theo ngữ cảnh
* Lọc thông báo

12. Gợi ý thêm nếu cần có lịch sử thao tác
    Nếu muốn lưu các thao tác như “Đã tạo sự kiện”, “Đã lưu thay đổi”, “Check-in thành công”, hãy thiết kế chúng nằm trong mục “Nhật ký hoạt động”, không nằm trong Notification Center.

Có thể thêm entry trong tương lai:
Title: “Nhật ký hoạt động”
Description: “Theo dõi lịch sử thao tác của thành viên trong tài khoản.”

Yêu cầu cuối:

* Thiết kế lại danh sách thông báo để ngắn gọn, có trọng tâm hơn.
* Không để danh sách bị dày bởi các thông báo thành công nhỏ.
* Ưu tiên giúp user nhận ra việc nào cần xử lý trước.
* Tất cả text dùng tiếng Việt.
* Giữ UI đồng bộ với dashboard NetEvent hiện tại.
