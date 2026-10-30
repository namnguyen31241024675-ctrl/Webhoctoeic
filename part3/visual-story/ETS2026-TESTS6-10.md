# ETS 2026 Part 3 — Test 6–10

Đã bổ sung 65 hội thoại, câu 32–70 mỗi Test, với 195 câu hỏi/đáp án gốc và 260 ảnh riêng. Toàn website hiện có 10 Test, 130 hội thoại, 390 câu hỏi và 521 ảnh Visual Story.

Ảnh minh họa phong cách chụp được tạo bằng công cụ ImageGen tích hợp. Mỗi hội thoại mới dùng bốn file ảnh riêng trong t6-32/images/ đến t10-68/images/. Cấu hình từng hội thoại nằm ở scenes.json; transcript và các đoạn nghe gốc nằm ở transcript.json. Các bảng/biểu đồ của câu hỏi được trích từ PDF bạn cung cấp.

## Điều khiển

- Thanh nhân vật xếp nam trước, nữ sau. Viền xanh theo lượt người nói; người ngoài ảnh được ghi ngoài khung hình.
- Viền vàng theo các chi tiết liên quan đến câu đang nghe. Bấm vùng đánh dấu để xem nghĩa và nghe phát âm.
- Space dừng/phát khi nghe hoặc chọn lời thoại; phím trái/phải chuyển câu.
- Tua tới/lùi ba giây giữ nguyên trạng thái tạm dừng. Nút danh sách hội thoại nằm trên vùng học.
- Chế độ Nghe & trả lời giữ ảnh và transcript kín trong lượt nghe đầu.

## Nguồn và kiểm tra

Câu hỏi, đáp án và lời thoại lấy từ năm PDF Test 6–10 đã gửi. 65 audio hội thoại mới giữ nguyên byte của nguồn. 558 đoạn nghe được cắt từ audio gốc theo mốc lời nói đo bằng nhận dạng tiếng nói, đối chiếu transcript và kiểm tra một số đầu câu bằng năng lượng âm thanh. Dấu phẩy giữ nguyên trong đoạn; lời chào ngắn ghép với câu tiếp theo trong cùng lượt nói.

Đã mở thử đủ 65/65 hội thoại mới trên trình duyệt, kiểm tra bốn ảnh/hội thoại và tổng 558 dòng transcript. Các lượt thử riêng đã xác nhận M2 trong hội thoại ba người, Space, bước tua đúng ba giây, đổi câu, vùng telephoto/LCD, phát âm và việc ẩn ảnh khi làm bài. Dữ liệu Test 1–5 và HTML Part 1/2 được đối chiếu giữ nguyên; HTML chỉ thay phiên bản cache của tài nguyên Part 3.

Kiểm tra giao diện chạy qua HTTP localhost. Bundle dùng cho luồng mở file được đối chiếu bằng JSON; công cụ kiểm tra trình duyệt chỉ cho HTTP/HTTPS nên chưa mở tự động file://.

Hai ghi chú nguồn hiển thị ngay trong giao diện:

- Test 8 câu 50–52: câu đặt bàn trong PDF khác cách diễn đạt của audio; giữ nguyên lời PDF và nghe trọn câu tương ứng.
- Test 10 câu 59–61: nhãn M/W của PDF không khớp người được nhắc trong câu hỏi. Giữ ký hiệu PDF với nhãn rõ ràng; các cảnh dùng đồ vật để tránh gán sai nhân vật.

## Tệp đối chiếu

- expansion-validation.json: kết quả cấu trúc và toàn bộ bundle.
- expansion-source-validation.json: đối chiếu nguồn, đáp án và kiểm tra giải mã audio mới.
- expansion-browser-traversal.json và expansion-browser-interactions.json: kết quả kiểm tra giao diện.
- active-audio-manifest.json: 1.088 đoạn nghe đang được sử dụng và mã SHA-256.
- expansion-image-prompts.json: 260 ảnh cuối, mã SHA-256, đoạn nguồn, bộ prompt chuẩn hóa để tái tạo và các prompt chỉnh sửa đã lưu.

Các bản ảnh chỉnh sửa dùng tên v2/v3; scenes.json chọn bản đã duyệt. Bản sao trước khi nâng cấp được giữ trong thư mục part3/backups/ của website.
