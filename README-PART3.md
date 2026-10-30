> Visual Story hiện đã hỗ trợ đủ Tests 1–5, 65 hội thoại. Xem [tài liệu bản đầy đủ](VISUAL-STORY-ALL-TESTS.md).

# TOEIC PicQuiz — Part 3

Bản này bổ sung Part 3 ETS 2026 Tests 1–5 vào website hiện có.

## Mở trên máy
Mở `index.html`, chọn **Part 3 · Hội thoại trực quan**. Giữ nguyên các thư mục `images` và `part3` bên cạnh file HTML. Không cần cài thêm phần mềm.

## Cách học
1. Nghe audio gốc với nhân vật chuyển động theo lượt nói. Bối cảnh và đáp án được giữ kín trong lượt nghe đầu.
2. Có thể bật **Dừng sau lượt đầu để dự đoán phản hồi**. Đây là hoạt động tự luyện, không tính điểm ETS.
3. Trả lời đủ ba câu rồi nộp bài.
4. Khám phá cảnh minh họa, xem đáp án, nghe lại bằng chứng hoặc từng lượt thoại. Các câu cần hình dùng đồ họa nguyên bản từ PDF.
5. Với bối cảnh xác định được từ nguồn, phần ôn tập có hoạt động chọn cảnh. Các cảnh khác là minh họa tình huống, không khẳng định vị trí thực tế chưa được đề cập.

Có tốc độ 0.75–1.25×, tua audio, phím Space, chuyển hội thoại bằng phím mũi tên, giảm chuyển động theo cài đặt hệ thống, xem lại lần làm gần nhất và tiến độ lưu riêng cho Part 3. Mở bằng `file://` và `http://` có vùng lưu trình duyệt khác nhau.

## Phạm vi và nguồn
- 65 hội thoại, 195 câu hỏi, 65 MP3 gốc, 15 đồ họa gốc.
- Câu hỏi và khóa đáp án trích từ PDF người dùng cung cấp. Hình minh họa là SVG được viết riêng, không thay đổi nội dung câu hỏi.
- PDF Test 3 riêng có transcript không khớp cho nhóm 47–49 và 50–52. Transcript hai nhóm này được đọc trực tiếp từ bản scan `C:\Users\Nam\Documents\transcript 2026 ets.pdf`, trang PDF 76–77, và đối chiếu với audio. Bản dịch sai ở PDF riêng không được sử dụng cho hai nhóm này. Nguồn thay thế được ghi trong dữ liệu và phần transcript trên giao diện.
- Mốc lời nói được đo tự động bằng nhận dạng lời nói, so với transcript. Những trường hợp cần thiết dùng căn chỉnh có ràng buộc transcript, đối chiếu thêm với lượt nhận dạng độc lập. Đây là mốc tự động ở mức từ/lượt nói; chuyển động miệng là hoạt ảnh theo lượt nói, không phải hoạt ảnh khớp từng âm vị.
- Nguồn, SHA-256 audio và phương pháp căn chỉnh nằm trong `part3/source-manifest.json`.

## Cập nhật GitHub Pages hiện có
Thay `index.html` và thêm nguyên thư mục `part3` vào cùng cấp. Giữ thư mục `images` và `.nojekyll` hiện có. Bản này chưa được push/publish lên GitHub.

## Kiểm tra
- Hội thoại đầu tiên kiểm tra bằng trình duyệt: chặn câu hỏi trước khi nghe, dự đoán, trả lời đúng/sai, mở cảnh sau khi nộp, nghe lại bằng chứng và lưu/xem lại kết quả.
- Mở cả 65 hội thoại bằng giao diện và kiểm tra không có lỗi tải hoặc lộ câu hỏi trong lượt nghe đầu.
- Kiểm tra dữ liệu đủ 39 câu mỗi test, bốn lựa chọn mỗi câu, khóa đáp án và các tham chiếu bằng chứng; kiểm tra thứ tự và giới hạn mốc audio.
- So sánh xác nhận code CSS/JS gốc và 150 ảnh Part 1–2 không đổi.
- Kiểm tra giao diện desktop/điện thoại, màu sáng/tối và chuyển qua lại các Part.

## Học từng câu (cập nhật)
Part 3 mặc định mở chế độ **Học từng câu**: 65 hội thoại được tách thành 645 đoạn câu tiếng Anh. Mỗi câu có nút nghe riêng từ audio gốc, tự dừng cuối câu, tùy chọn lặp câu, hiện/ẩn chữ, chuyển câu trước/sau và chọn nhanh bằng số. Dùng nút **Nghe & trả lời** để trở lại bài nghe cả hội thoại và 3 câu hỏi. Mốc câu lấy từ căn chỉnh từ trong audio; ba câu ngắn chưa có từ nhận diện dùng ranh giới năng lượng âm thanh đo trong khoảng đã đối chiếu với nguồn. Không chia đều thời lượng hoặc tạo giọng đọc thay thế.

Quy tắc tách mới: chỉ dấu chấm kết thúc câu trong cùng một lượt nói. Dấu phẩy, dấu hỏi và dấu chấm than không tách đoạn. Các đoạn vẫn giữ riêng theo người nói.

Audio câu đã được xuất thành 645 MP3 riêng trong `part3/audio-sentences`, trích từ MP3 gốc. Trình phát học từng câu dùng chính các file ngắn này và dừng theo cuối file, không dùng khoảng nghỉ/dấu phẩy để dừng. Danh sách nguồn và SHA-256 nằm trong `part3/sentence-audio-manifest.json`.

## Visual Story pilot
Test 1 câu 32–34 đã có Visual Story với 5 ảnh minh họa riêng dạng ảnh chụp, 6 đoạn thoại theo ý, chuyển cảnh theo audio, hotspot nghĩa Việt/phát âm và transcript bấm nghe lại. Chọn Visual Story trong bài này. Các nhóm khác dùng chế độ Học từng câu cũ; Nghe & trả lời giữ nguyên bài TOEIC. Cấu hình: part3/visual-story/t1-32/scenes.json. Xem VISUAL-STORY-PILOT.md để chỉnh dữ liệu hoặc tạo lại bundle cho file://.
