# Tư Bản — Capital District

Web game học tập Kinh tế chính trị Mác – Lênin, chơi trực tiếp trên trình duyệt. Bản GitHub Pages công khai không yêu cầu đăng nhập ChatGPT hoặc GitHub.

## Giao diện cửa tiệm ấm áp

Phiên bản 2 dùng bảng màu kem, hồng đất, xanh lá và nét viền nâu. Cảnh SVG isometric được vẽ riêng cho dự án, với cửa sổ, quầy hàng, bảng menu, cây, nhân viên và mèo ngủ. Mỗi ngành có đồ trưng bày riêng: máy cà phê, giỏ hàng hóa hoặc giá áo.

- Chạm nhân viên để đến Nhân sự; chạm quầy thu ngân để đến Tài chính; chạm bảng cấp độ để nâng cấp.
- Chuyển Ban ngày/Buổi tối thay đổi hình ảnh và đèn, không ảnh hưởng phép tính kinh doanh.
- Bản đồ đất đai ở mục Đất & cửa hàng. Có thể đổi cửa tiệm đang xem khi sở hữu nhiều cơ sở.
- Các vùng bấm hỗ trợ bàn phím. Chuyển động hơi cà phê, mây và mèo được tắt khi thiết bị yêu cầu giảm chuyển động.

Phong cách tham khảo từ Dream Coffee (https://dreamcoffee.homes/); không dùng mã hoặc tài nguyên đồ họa của trang tham khảo.

## Chơi

Chọn một trong ba ngành: cà phê, tạp hóa, thời trang. Bạn có 120 triệu tiền mặt, một lô đất với một cửa hàng và hai nhân viên. Mua đất, xây cửa hàng, tuyển người, nâng năng suất và quản lý điều kiện lao động.

Một lượt gồm 60 tháng; mỗi tháng 12 giây ở tốc độ thường, khoảng 12 phút không tính thời gian tạm dừng. Có tốc độ 2×, 4× và chuyển tháng thủ công.

Điều kiện thua: tiền mặt âm; từ 4 nhân viên nghỉ việc; bị phát hiện trốn thuế. Giữ lương tạo nợ và có thể bị kiện. Tai nạn lao động có thể phát sinh bồi thường. Mọi mức thuế, xác suất và chế tài là quy tắc mô phỏng, không phải quy định pháp luật thực tế.

Sổ tay trong game liên hệ các quyết định với tích lũy tư bản, tiền công, sức lao động và giá trị thặng dư. Mô hình đơn giản hóa; lợi nhuận kế toán không đồng nhất với giá trị thặng dư. Tham khảo *Tư bản*, Quyển I, chương 8–9.

## Chạy và kiểm tra

Yêu cầu Node.js 22.13+ và pnpm 11.25.0.

```sh
pnpm install
pnpm dev
pnpm test
pnpm build
pnpm preview
```

Đầu ra `dist/` là website tĩnh. Đường dẫn tài nguyên tương đối hỗ trợ GitHub Pages dưới thư mục tên repo và tên miền riêng.

## Triển khai

Trong Settings → Pages, chọn GitHub Actions. Mỗi lần đẩy lên nhánh `main`, workflow `.github/workflows/pages.yml` sẽ chạy kiểm thử, kiểm tra TypeScript, build và triển khai. Không cần API key hoặc dịch vụ xác thực cho người chơi.

## Dữ liệu

Ván chơi tự lưu trong localStorage (`capital-save`); bảng thành tích trong `capital-scores`. Dữ liệu nằm trên trình duyệt, không đồng bộ thiết bị. Bảng xếp hạng hiện là cục bộ, chưa có máy chủ chung/chống gian lận.

## Mã nguồn

- `src/App.tsx`: giao diện và tương tác.
- `src/styles.css`: giao diện đáp ứng.
- `lib/game.ts`: mô phỏng kinh tế.
- `components/city-map.tsx`: bản đồ SVG tương tác.
- `components/cozy-scene.tsx`: cảnh cửa tiệm SVG, nhân vật, mèo và các lối tắt tương tác.
- `src/cozy.css`: giao diện ấm áp, typography và chuyển động.
- `tests/game.test.mjs`: kiểm thử 60 tháng và các điều kiện kết thúc.
