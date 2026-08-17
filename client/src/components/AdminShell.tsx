import { useAuth } from "@/_core/hooks/useAuth";
import { cn } from "@/lib/utils";
import { BarChart3, ClipboardList, ExternalLink, LayoutDashboard, LogOut, Menu, Percent, ShieldCheck, Store, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

const navigation = [
  { href: "/admin", label: "نظرة عامة", icon: LayoutDashboard },
  { href: "/admin/orders", label: "الطلبات", icon: ClipboardList },
  { href: "/admin/discounts", label: "أكواد الخصم", icon: Percent },
];

export default function AdminShell({ children, title, eyebrow }: { children: React.ReactNode; title: string; eyebrow: string }) {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const { user, loading, isAuthenticated } = useAuth({ redirectOnUnauthenticated: true });

  if (loading) return <div className="grid min-h-screen place-items-center bg-[#0d0e10] text-white" dir="rtl"><div className="rounded-2xl border border-white/10 bg-[#141619] px-8 py-7 text-center"><div className="mx-auto size-8 animate-spin rounded-full border-2 border-white/15 border-t-[#ff3b30]" /><p className="mt-4 text-sm text-white/55">جاري التحقق من صلاحيات الأدمن…</p></div></div>;
  if (!isAuthenticated) return <div className="grid min-h-screen place-items-center bg-[#0d0e10] px-5 text-white" dir="rtl"><div className="max-w-md rounded-2xl border border-white/10 bg-[#141619] p-8 text-center"><ShieldCheck className="mx-auto text-[#ff8079]" size={30} /><h1 className="mt-4 text-xl font-black">تسجيل الدخول مطلوب</h1><p className="mt-3 text-sm leading-7 text-white/50">سيتم تحويلك إلى صفحة تسجيل الدخول للوصول إلى لوحة الأدمن.</p></div></div>;
  if (user?.role !== "admin") return <div className="grid min-h-screen place-items-center bg-[#0d0e10] px-5 text-white" dir="rtl"><div className="max-w-md rounded-2xl border border-red-300/15 bg-[#141619] p-8 text-center"><ShieldCheck className="mx-auto text-red-300" size={30} /><h1 className="mt-4 text-xl font-black">لا تملك صلاحية الوصول</h1><p className="mt-3 text-sm leading-7 text-white/50">هذه المساحة مخصصة لحسابات الأدمن فقط.</p><Link href="/" className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-[#ff3b30] px-5 text-sm font-black">العودة للمتجر</Link></div></div>;

  return (
    <div className="min-h-screen bg-[#0d0e10] text-white" dir="rtl">
      <div className="flex min-h-screen">
        <div className={cn("fixed inset-0 z-40 bg-black/60 transition-opacity lg:hidden", open ? "opacity-100" : "pointer-events-none opacity-0")} onClick={() => setOpen(false)} />
        <aside className={cn("fixed inset-y-0 right-0 z-50 flex w-[280px] flex-col border-l border-white/10 bg-[#141619] px-5 py-6 transition-transform duration-200 lg:static lg:translate-x-0", open ? "translate-x-0" : "translate-x-full")}>
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <Link href="/admin" className="flex items-center gap-3" onClick={() => setOpen(false)}>
              <span className="grid size-11 place-items-center bg-[#ff3b30] text-lg font-black italic">Z</span>
              <span><strong className="block text-sm tracking-[0.24em]">ZON</strong><small className="text-[10px] tracking-[0.2em] text-white/45">CONTROL ROOM</small></span>
            </Link>
            <button className="grid size-9 place-items-center text-white/60 hover:text-white lg:hidden" onClick={() => setOpen(false)} aria-label="إغلاق القائمة"><X size={18} /></button>
          </div>

          <div className="mt-8 rounded-2xl border border-emerald-300/15 bg-emerald-300/5 p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-300"><span className="size-2 rounded-full bg-emerald-300 shadow-[0_0_12px_#86efac]" /> النظام يعمل</div>
            <p className="mt-2 text-xs leading-6 text-white/45">بيانات الكتالوج متصلة بـ Shopify. إدارة الطلبات الحالية في وضع الاختبار.</p>
          </div>

          <nav className="mt-8 space-y-2">
            <p className="mb-3 px-3 text-[10px] font-bold tracking-[0.22em] text-white/35">WORKSPACE</p>
            {navigation.map(item => {
              const Icon = item.icon;
              const active = item.href === "/admin" ? location === "/admin" : location.startsWith(item.href);
              return <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={cn("flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-bold transition-colors", active ? "bg-[#ff3b30] text-white shadow-[0_10px_30px_rgba(255,59,48,0.2)]" : "text-white/55 hover:bg-white/5 hover:text-white")}><Icon size={18} />{item.label}</Link>;
            })}
          </nav>

          <div className="mt-auto space-y-2 border-t border-white/10 pt-5">
            <Link href="/shop" className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm text-white/55 transition-colors hover:bg-white/5 hover:text-white"><Store size={17} />عرض المتجر<ExternalLink className="mr-auto" size={14} /></Link>
            <div className="flex items-center gap-3 px-3 py-3 text-xs text-white/35"><ShieldCheck size={16} className="text-emerald-300" />صلاحيات الأدمن مفعّلة</div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex min-h-[76px] items-center justify-between border-b border-white/10 bg-[#0d0e10]/90 px-5 backdrop-blur-xl sm:px-8 lg:px-10">
            <div className="flex items-center gap-4"><button className="grid size-10 place-items-center rounded-xl border border-white/10 text-white/70 hover:text-white lg:hidden" onClick={() => setOpen(true)} aria-label="فتح القائمة"><Menu size={19} /></button><div><p className="text-[10px] font-bold tracking-[0.22em] text-[#ff5a50]">{eyebrow}</p><h1 className="mt-1 text-lg font-black sm:text-xl">{title}</h1></div></div>
            <div className="flex items-center gap-3"><span className="hidden rounded-full border border-white/10 px-3 py-2 text-xs text-white/45 sm:inline-flex">آخر تحديث: الآن</span><span className="grid size-10 place-items-center rounded-full bg-white/10 text-sm font-black">A</span></div>
          </header>
          <div className="mx-auto w-full max-w-[1440px] px-5 py-8 sm:px-8 lg:px-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
