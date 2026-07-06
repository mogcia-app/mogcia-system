import Image from "next/image";
import LoginForm from "@/components/login-form";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#f7f7f8] text-black">
      <section className="mx-auto grid min-h-screen w-full max-w-7xl gap-0 px-6 py-6 sm:px-8 lg:grid-cols-[minmax(0,1fr)_460px] lg:px-10">
        <section className="flex min-h-[44vh] flex-col justify-between border border-black/8 bg-white p-6 sm:p-8 lg:min-h-auto lg:border-r-0 lg:p-10">
          <div className="flex items-center justify-between gap-4">
            <Image
              src="/m.png"
              alt="Mogcia"
              width={420}
              height={108}
              priority
              className="h-12 w-auto sm:h-14"
            />
          </div>

          <div className="max-w-2xl py-14 lg:py-20">
            <p className="text-[11px] tracking-[0.28em] text-black/38">
              MOGCIA PORTAL
            </p>
            <h1 className="mt-5 text-[2.4rem] leading-[1.05] font-light sm:text-[4rem] lg:text-[5.2rem]">
              Login
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-8 text-black/62 sm:text-base">
              Mogciaのポートフォリオと管理メニューへログインします。
            </p>
          </div>

          <div className="grid gap-px bg-black/8 sm:grid-cols-3">
            {["HP/LP", "SNS運用", "その他"].map((item) => (
              <div key={item} className="bg-white px-4 py-4">
                <p className="text-sm font-medium">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center border border-black/8 bg-white p-6 sm:p-8 lg:p-10">
          <div className="w-full">
            <div className="border-b border-black/8 pb-6">
              <p className="text-[11px] tracking-[0.22em] text-black/35">
                ACCOUNT
              </p>
              <h2 className="mt-3 text-2xl font-medium">ログイン</h2>
              <p className="mt-3 text-sm leading-7 text-black/56">
                メールアドレスとパスワードでログインしてください。
              </p>
            </div>

            <LoginForm />
          </div>
        </section>
      </section>
    </main>
  );
}
