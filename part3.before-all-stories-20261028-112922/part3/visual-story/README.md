# Visual Story Learning — ETS 2026 Test 1, câu 32–34

## Đã triển khai

Pilot dùng 5 ảnh riêng dạng ảnh chụp, giữ nhất quán hai nhân vật từ ảnh tham khảo. Ảnh được tạo bằng built-in image_gen, là hình minh họa cho việc học, không phải ảnh nguồn ETS. Mỗi ảnh được lưu thành PNG riêng trong `part3/visual-story/t1-32/images/`. Prompt và nguồn tạo được ghi trong `image-prompts.json` và `t1-32/image-provenance.json`.

- 5 cảnh tự chuyển theo vị trí audio gốc; có fade, zoom và pan nhẹ, tôn trọng giảm chuyển động của hệ thống.
- 6 đoạn lời thoại theo ý hoàn chỉnh; “Hey, Oliver” đi cùng câu hỏi phía sau, “Yes” đi cùng phần nói tiếp theo.
- Transcript đánh dấu đoạn đang nói; bấm đoạn bất kỳ để nghe lại bằng MP3 gốc đã cắt.
- 11 vùng tương tác cho 8 từ/cụm từ: mở nghĩa Việt, nghe phát âm bằng giọng đọc có sẵn và tiếp tục audio sau khi học từ.
- Nghe cả hội thoại, chọn cảnh để nghe từ một vị trí, lặp đoạn được chọn và đổi tốc độ.
- Chỉ bật trong chế độ học của `t1-32`. Chế độ **Nghe & trả lời** vẫn giữ câu hỏi/đáp án gốc và không mở ảnh gợi ý khi chưa nghe.
- 64 hội thoại khác và Part 1–2 giữ nguyên nội dung, ảnh, tiến độ và cách học hiện có.

## Mở bài thử

Mở website trên máy, chọn **Part 3 → Test 1 → 32–34 → Visual Story**. Dùng nút **Nghe cả hội thoại** hoặc bấm một dòng transcript. Bấm vùng có viền đánh dấu trên ảnh để học từ vựng. **Nghe & trả lời** mở phần làm bài TOEIC hiện có.

## Cấu trúc

```text
part3/visual-story/
  manifest-validator.js
  scenes.schema.json
  photo-story-player.js
  photo-story-player.css
  prepare-story-bundle.cjs
  image-prompts.json
  t1-32/
    scenes.json
    scenes.bundle.js
    transcript.json
    source-timing.reference.json
    image-provenance.json
    images/scene-01.png ... scene-05.png
    reference/reference-collage.png
```

`part3/part3.js` tiếp tục sở hữu bộ phát audio. Component ảnh nhận đồng hồ **sourceTime = audio.currentTime + audioOffset**, nên ảnh/transcript vẫn đúng khi nghe cả MP3 hoặc phát riêng file đoạn thoại. Không dùng timer độc lập để chạy ảnh.

## Nguồn cấu hình và mốc cảnh

`scenes.json` là nguồn cấu hình chính cho ảnh, mốc chuyển, fade/pan/zoom, hotspot và từ vựng. Mốc được lấy từ các từ đầu của đoạn thoại đã căn chỉnh từ audio gốc, sau đó ánh xạ theo nội dung transcript. Không có lời thoại, câu hỏi hoặc số liệu khảo sát ETS được thêm vào.

| Cảnh | Mốc audio gốc | Nội dung minh họa |
| --- | --- | --- |
| 1 | 6.03–12.09 giây | Hai đồng nghiệp trao đổi về kết quả thử nghiệm sản phẩm |
| 2 | 12.09–18.66 giây | Phản hồi tích cực và dòng sản phẩm phô mai |
| 3 | 18.66–24.84 giây | Ý tưởng dùng phô mai trong công thức và nước sốt |
| 4 | 24.84–30.15 giây | Đề xuất phiên bản bào sợi |
| 5 | 30.15–35.52 giây | Liên hệ quản lý sản xuất |

Vùng ảnh dùng tọa độ chuẩn hóa 0–1. Ảnh và hotspot được đặt trong cùng hệ tọa độ, cùng chuyển động, để vùng bấm không lệch khi đổi kích thước. Hai lớp ảnh đã tải sẵn dùng cho chuyển cảnh fade.

## Chạy trực tiếp và chạy HTTP

- HTTP/GitHub Pages: component đọc trực tiếp `scenes.json` và `transcript.json`.
- `file://`: component đọc `scenes.bundle.js`, được tạo tự động từ đúng hai file JSON trên để tránh hạn chế fetch file cục bộ.
- Sau khi sửa JSON và muốn mở bằng file trực tiếp, chạy `node part3/visual-story/prepare-story-bundle.cjs`. Helper kiểm tra dữ liệu trước khi tạo bundle; không ghi bundle nếu cấu hình chưa sẵn sàng.

## Phát âm

Nút phát âm chỉ đọc từ/cụm từ người học vừa bấm, bằng giọng tiếng Anh của trình duyệt. Audio hội thoại dừng trước khi đọc từ để không chồng tiếng. Nút **Tiếp tục nghe** trở về đúng vị trí audio. TTS không thay thế audio ETS.

## Kiểm tra

Đã kiểm tra cấu hình, ảnh PNG thực tế, mốc cảnh và tham chiếu hotspot; so khớp bundle file-mode với JSON; xác nhận script inline Part 1–2 giữ nguyên. Trình duyệt kiểm tra ảnh chuyển theo audio, nghe lại transcript, hotspot/tiếng Việt/phát âm, giao diện desktop và điện thoại, và cách ly ảnh khỏi chế độ làm bài. Kết quả chi tiết được lưu trong `part3/visual-story/validation.json`.

Ảnh ghép ban đầu chỉ được giữ làm tham khảo; website sử dụng 5 file ảnh riêng mới. Nguồn chuẩn của lời thoại và đáp án vẫn là tài liệu/audio ETS đã có.
