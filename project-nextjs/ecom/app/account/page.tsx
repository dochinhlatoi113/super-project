// app/account/page.tsx
// Trang tài khoản: đăng ký, đăng nhập (email, tên, địa chỉ, sdt, ngày sinh, Google, Facebook, tài khoản/mật khẩu)

import AccountTabs from '../components/AccountTabs';

export default function AccountPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <AccountTabs />
    </div>
  );
}
