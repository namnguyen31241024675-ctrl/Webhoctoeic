# Nhân vật đang nói

Áp dụng cho 65 hội thoại, 261 cảnh. Player đọc người nói từ mốc transcript trên audio ETS gốc. Nhân vật xuất hiện trong ảnh có viền sáng và nhãn Đang nói; thẻ ảnh người nói bên dưới cũng sáng. Khi tạm dừng hoặc ở khoảng nghỉ, viền sáng và hiệu ứng nhịp dừng.

Mỗi scenes.json chứa speakers (ID, nhãn, vùng ảnh cho thẻ) và characters theo từng cảnh (ID và vùng nhân vật nhìn thấy). Cảnh cận đồ vật hoặc người nói qua điện thoại ở nơi khác không gán nhầm viền cho người đang xuất hiện; thẻ ghi Đang nói · ngoài khung.

Vùng nhân vật đi cùng hệ tọa độ pan/zoom của ảnh. Không thay đổi ảnh gốc, audio, câu hỏi hay đáp án.

Đã kiểm tra thực tế W, M, M2, cảnh ngoài khung và tạm dừng; toàn bộ 65 cấu hình được đối chiếu ID người nói và kiểm tra bundle file-mode khớp JSON.
