# Visual Story Learning — ETS 2026 Tests 1–5

Đã mở rộng cho đủ 65 hội thoại, câu 32–70 của mỗi Test; giữ nguyên 195 câu hỏi và đáp án ETS cùng các chức năng Part 1–2.

- 261 ảnh minh họa theo phong cách ảnh chụp: 5 ảnh ở bài thử Test 1 câu 32–34, 4 ảnh riêng cho mỗi hội thoại còn lại.
- Ảnh chuyển theo vị trí audio ETS gốc, với fade, pan và zoom nhẹ. Không chạy bằng bộ đếm thời gian độc lập.
- 530 đoạn audio để nghe lại; lời chào/câu ngắn được ghép với phần nói tiếp theo trong cùng lượt nói. Dấu phẩy không tách audio.
- 267 vùng tương tác cho 264 mục từ/cụm từ, có nghĩa Việt và phát âm tiếng Anh bằng giọng của trình duyệt.
- Bấm lời thoại hoặc ảnh nhỏ để nghe lại. Khi chọn cảnh, player chờ audio tải metadata trước khi seek; chuyển bài sẽ hủy yêu cầu phát cũ.
- Chế độ **Nghe & trả lời** giữ kín ảnh và từ vựng, dùng câu hỏi/đáp án ETS hiện có.

## Cách mở

Tải lại website, chọn **Part 3 → Test 1–5 → hội thoại → Visual Story**. Bấm **Nghe cả hội thoại**, bấm câu để nghe riêng, hoặc bấm vùng đánh dấu để học từ.

## Ảnh, prompt và dữ liệu

Tất cả ảnh được tạo bằng **built-in image_gen**, là ảnh minh họa hư cấu cho việc học, không phải ảnh nguồn ETS. Mỗi ảnh là một file riêng; không dùng SVG, emoji hay ảnh ghép thay bộ ảnh.

- Ảnh hoạt động: `part3/visual-story/t{test}-{câu đầu}/images/`. Đường dẫn, kích thước và SHA-256 của đủ 261 ảnh nằm trong [photo-catalog.json](part3/visual-story/photo-catalog.json).
- Prompt của 256 ảnh mới: [all-image-prompts.json](part3/visual-story/all-image-prompts.json).
- Prompt và nguồn của 15 ảnh đã chỉnh sau khi rà nội dung: [image-corrections.json](part3/visual-story/image-corrections.json).
- Prompt của bộ 5 ảnh bài thử đầu tiên: [image-prompts.json](part3/visual-story/image-prompts.json).
- Mỗi hội thoại có `scenes.json`, `transcript.json`, `image-provenance.json`. Mốc cảnh lấy từ mốc câu đã đo trên audio gốc; không tự đặt mốc theo độ dài ảnh.

## Cấu trúc và bảo trì

Giữ kiến trúc JavaScript thuần hiện có. `part3.js` sở hữu audio; `photo-story-player.js` nhận đồng hồ audio gốc để đồng bộ ảnh và transcript. Renderer chọn cấu hình theo ID hội thoại, không còn giới hạn ở bài thử.

HTTP đọc JSON trực tiếp. Mở bằng file cục bộ đọc `all-scenes.bundle.js`, được tạo từ cùng các JSON để tránh hạn chế fetch của file://. Sau khi sửa JSON, chạy:

```text
node part3/visual-story/prepare-story-bundle.cjs
```

Helper chỉ đưa những bộ ảnh đã sẵn sàng vào registry. Nếu thiếu ảnh hoặc dữ liệu không hợp lệ, bài đó không được bật âm thầm bằng nội dung thay thế.

## Kiểm tra

Đã xác nhận đủ 65 bộ cấu hình, 261 PNG hợp lệ, mốc cảnh liên tục và nằm trong phần hội thoại; registry file-mode khớp JSON, toàn bộ transcript khớp các đoạn nghe. Đối chiếu trước/sau giữ nguyên câu hỏi, đáp án, lời thoại, bản dịch, nguồn và MP3 hội thoại gốc. 109 file đoạn nghe mới đã xuất và giải mã thành công. Script inline Part 1–2 giữ nguyên.

Đã mở từng hội thoại trên trình duyệt: 65/65 tải được ảnh và transcript. Đã kiểm tra chọn cảnh, nghe lại câu, phát âm từ, ẩn ảnh trong chế độ làm bài và bố cục desktop/mobile không tràn ngang. Chi tiết: [all-validation.json](part3/visual-story/all-validation.json).
