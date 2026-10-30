# Chuẩn bị Visual Story Learning — ETS 2026 Test 1, câu 32–34

## Trạng thái

**Đã chuẩn bị cấu trúc và hợp đồng dữ liệu; chưa triển khai hoặc bật Visual Story Player trên website.**

Riêng yêu cầu gộp audio trước đó đã được sửa cho bài thử này: 6 đoạn theo ý nói. Đoạn đầu là “Hey, Oliver. Did you see the focus group results for our new spicy cheddar cheese?”; lời chào không còn là một file nghe riêng. Các hội thoại khác giữ nguyên dữ liệu và cách phát hiện tại.

Ảnh ghép 5 ô được lưu nguyên bản trong `part3/visual-story/t1-32/reference/reference-collage.png` để tham khảo. Chưa cắt ảnh, tạo ảnh mới, dùng ảnh làm nguồn ETS hoặc coi đây là bộ ảnh chính thức. Chữ/biểu đồ trên ảnh không được dùng thay transcript hay đáp án ETS.

## Kết quả kiểm tra project

Project là website HTML/CSS/JavaScript thuần; không có React/Vue hoặc cấu hình bundler trong thư mục Code hiện tại.

| Phần hiện có | Vị trí / hàm | Cách tích hợp dự kiến |
| --- | --- | --- |
| Điểm vào và Part 1–2 | `index.html`, script inline hiện có | Giữ nguyên; chỉ thêm hook riêng sau khi duyệt dữ liệu |
| Dữ liệu 65 hội thoại, câu hỏi và đáp án | `part3/data.js` → `window.TOEIC_PART3` | Không thay câu hỏi hoặc khóa đáp án |
| Audio | `part3/part3.js`: `audio`, `setAudioSource`, `play`, `playSentence` | Dùng chung bộ phát hiện có |
| Đồng hồ nguồn | `sync`: `sourceTime = audio.currentTime + audioOffset` | Đồng bộ ảnh/transcript theo sourceTime, kể cả khi phát file câu đã cắt |
| Transcript | `renderTranscript`, `renderSentencePanel` | Dùng nội dung nguồn, chọn đoạn để nghe lại |
| Cảnh hiện tại | `sceneSVG`, `environment`, `person` | Player ảnh mới sẽ là component độc lập; không lấy SVG/emoji làm fallback ảnh người thật |
| Làm bài / chuyển chế độ | `renderPanel`, `setLearningMode`, `setQuizPart` | Chỉ gắn player mới trong chế độ học, conversation `t1-32`, khi manifest đã sẵn sàng |
| Giao diện | `part3/part3.css` | CSS riêng có tiền tố visual-story; không sửa selector toàn cục |

## Cấu trúc đã tạo

```text
part3/visual-story/
  scenes.schema.json
  manifest-validator.js
  prepare-story-bundle.cjs
  t1-32/
    scenes.json                  # awaiting-assets, enabled=false, chưa có cảnh/ảnh giả
    transcript.json              # 6 đoạn theo ý; lời thoại và mốc lấy từ nguồn hiện có
    source-timing.reference.json # mốc 5 lượt nói tham khảo, chưa phải lịch chuyển cảnh
    images/README.md             # thư mục chờ ảnh chính thức; không có placeholder
    reference/reference-collage.png
```

Không có renderer ảnh, animation hay hotspot được bật vào trang hiện tại ở bước chuẩn bị này. `manifest-validator.js` chỉ kiểm tra cấu hình và có hàm chọn cảnh theo đồng hồ nguồn; không vẽ ảnh hoặc tạo dữ liệu ETS. `prepare-story-bundle.cjs` từ chối tạo bundle nếu manifest chưa được duyệt.

## Thời gian audio

Mọi mốc trong `scenes.json` sẽ dùng **giây của file audio gốc**, không dùng thời gian bắt đầu từ 0 của từng file câu đã cắt. Audio gốc có lời giới thiệu và lời đọc câu hỏi; phần hội thoại đo được nằm khoảng **6.03–35.52 giây**. Không tự gán các mốc này cho 5 ô ảnh.

Mốc đã có là căn chỉnh tự động từ audio và transcript. Lịch chuyển từng ảnh cần được duyệt theo nội dung cảnh trước khi đánh dấu `timingReviewed=true`.

## Hợp đồng scenes.json

- `audio`: đường dẫn MP3 gốc, `timebase=source-seconds`, khoảng hội thoại.
- `images`: 4–5 ảnh chụp đã duyệt; mỗi ảnh có ID, đường dẫn, alt và điểm lấy nét nếu cần.
- `scenes`: 4–5 cảnh theo thứ tự; mỗi cảnh có ảnh, `start/end`, fade, pan/zoom nhẹ và danh sách hotspot.
- `vocabulary`: từ/cụm tiếng Anh, nghĩa Việt, nguồn phát âm TTS hoặc file audio.
- `hotspots`: vùng chữ nhật trong ảnh với tọa độ chuẩn hóa 0–1 và liên kết `vocabularyId`.
- Cảnh không chồng mốc, không vượt thời lượng hoặc tràn sang phần đọc câu hỏi. Vùng đánh dấu không vượt ra ngoài ảnh.
- Chỉ bật khi `status=ready`, `enabled=true`, `imagesApproved=true`, `timingReviewed=true`, `hotspotsReviewed=true` và dữ liệu hợp lệ.

Cấu hình hiện tại có `images=[]`, `scenes=[]`, `vocabulary=[]`, trạng thái chờ. Đây là trạng thái chưa có dữ liệu, không phải bộ ảnh/cảnh placeholder.

## Thiết kế component sẽ triển khai sau khi đủ dữ liệu

1. `VisualStoryPlayer` độc lập nhận vùng mount, manifest và adapter audio; chỉ hỗ trợ pilot `t1-32` ở giai đoạn đầu.
2. Adapter cấp `getSourceTime`, `seekSourceTime`, `playRange`, `pause` và sự kiện khi phát/dừng/tua/chuyển hội thoại. Không tạo bộ phát audio song song.
3. Hai lớp ảnh preload để crossfade; tiến độ pan/zoom tính từ đồng hồ audio, dừng khi pause và tính lại khi seek. Tôn trọng `prefers-reduced-motion`.
4. Hotspot là nút có thể dùng bàn phím; mở bảng nghĩa và phát âm khi người học bấm. Ảnh và hotspot dùng cùng hệ tọa độ/transform để không lệch khi zoom hoặc đổi kích thước màn hình.
5. Phát âm từ vựng tạm dừng audio hội thoại để không chồng tiếng; nguồn phát âm phải được cấu hình rõ ràng. Không thay MP3 ETS bằng TTS.
6. Transcript dùng các ID trong `transcript.json`; dòng đang nói được đánh dấu theo sourceTime và có nút nghe lại chính đoạn đó.
7. Desktop bố trí ảnh và transcript cạnh nhau; mobile xếp dọc, vùng bấm đủ lớn, bảng từ vựng nằm trong khung nhìn. Giữ đủ nội dung ảnh khi tính tọa độ hotspot.
8. Chế độ làm bài TOEIC hiện tại giữ nguyên; ảnh có gợi ý đáp án không tự xuất hiện trong lượt nghe làm bài đầu tiên. Thiếu ảnh hoặc manifest lỗi thì không bật player ảnh, không dùng SVG/emoji làm ảnh thay thế.

## Lưu ý khi chạy bằng file://

Trang hiện được mở bằng `file://`. Trình duyệt có thể chặn `fetch('scenes.json')` từ file cục bộ. Hai đường hỗ trợ đã được xác định:

- HTTP cục bộ / GitHub Pages: đọc trực tiếp `scenes.json` khi chạy.
- Mở file trực tiếp: dùng bước tạo `scenes.bundle.js` từ chính JSON đã duyệt. JSON vẫn là nguồn dữ liệu; không viết tay bản thay thế. Chưa sinh bundle khi thiếu ảnh/mốc.

Chưa đổi cách mở website hoặc tự thêm server/loader vào trang trong bước chuẩn bị này.

## Thông tin còn thiếu để triển khai player ảnh

1. **Bộ ảnh chính thức:** 4–5 file JPG/PNG/WebP/AVIF riêng và đường dẫn. Cần chốt có dùng 5 ô của ảnh ghép này hay chỉ coi là tham khảo. Ưu tiên ảnh gốc rõ, nhân vật nhất quán, chưa ghép số thứ tự vào khung hình.
2. **Lịch chuyển cảnh:** ảnh nào ứng với đoạn thoại nào; mốc bắt đầu/kết thúc theo MP3 gốc. Nếu muốn mình đề xuất mốc từ căn chỉnh hiện có, cần duyệt đề xuất đó trước khi bật player.
3. **Hotspot và từ vựng:** vùng nào được đánh dấu, từ/cụm cần học, nghĩa Việt; không suy ra chữ trên bao bì/biểu đồ là nội dung ETS.
4. **Phát âm từ vựng (mặc định đã có hướng xử lý):** dùng TTS sẵn có của website; chỉ cần bổ sung đường dẫn nếu muốn dùng bản thu riêng.
5. **Cách nạp JSON (hướng xử lý kỹ thuật):** HTTP/GitHub Pages đọc JSON trực tiếp; file cục bộ dùng bundle sinh từ JSON đã duyệt để giữ cách mở hiện tại. Chưa cần người dùng đổi môi trường.

Sau khi chốt các mục trên mới triển khai renderer ảnh/fade/pan/zoom, kết nối bridge audio, làm hotspot và thử một hội thoại hoàn chỉnh. Không mở rộng các test khác trước khi pilot được kiểm tra.
