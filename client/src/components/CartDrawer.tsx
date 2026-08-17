import { useCart } from "@/contexts/CartContext";
import { formatMoney } from "@/lib/format";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";

export function CartDrawer() {
  const {
    cart,
    isOpen,
    loading,
    itemCount,
    closeCart,
    removeItem,
    updateQuantity,
    proceedToCheckout,
    recentlyAdded,
  } = useCart();

  if (!isOpen) return null;

  return (
    <div className="cart-layer" role="presentation">
      <button className="cart-backdrop" type="button" onClick={closeCart} aria-label="إغلاق السلة" />
      <aside className={`cart-drawer ${recentlyAdded ? "cart-pop" : ""}`} dir="rtl" aria-label="سلة التسوق">
        <header className="cart-drawer-head">
          <div>
            <p className="eyebrow">YOUR SELECTION</p>
            <h2>سلتك <span>({itemCount})</span></h2>
          </div>
          <button type="button" onClick={closeCart} aria-label="إغلاق السلة"><X size={22} /></button>
        </header>

        {!cart?.items.length ? (
          <div className="cart-empty">
            <ShoppingBag size={31} strokeWidth={1.3} />
            <h3>السلة لسه فاضية.</h3>
            <p>اختار القطعة المناسبة من الإصدار الحالي، وهيظهر طلبك هنا.</p>
            <a href="/shop" onClick={closeCart}>ابدأ التسوق</a>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.items.map((item) => (
                <article className="cart-item" key={item.lineId}>
                  <img src={item.image?.url ?? "/manus-storage/zon-texture_507acf70.jpg"} alt={item.image?.altText ?? item.productTitle} />
                  <div className="cart-item-info">
                    <div className="cart-item-title-row">
                      <div>
                        <h3>{item.productTitle}</h3>
                        {item.variantTitle !== "Default Title" && <p>{item.variantTitle}</p>}
                      </div>
                      <button type="button" onClick={() => removeItem(item.lineId)} aria-label={`حذف ${item.productTitle}`} disabled={loading}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="cart-item-bottom">
                      <div className="quantity-control" aria-label="الكمية">
                        <button type="button" onClick={() => updateQuantity(item.lineId, item.quantity - 1)} disabled={loading} aria-label="تقليل الكمية"><Minus size={14} /></button>
                        <span>{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(item.lineId, item.quantity + 1)} disabled={loading} aria-label="زيادة الكمية"><Plus size={14} /></button>
                      </div>
                      <strong>{formatMoney(item.lineTotal)}</strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <footer className="cart-footer">
              <div className="cart-total"><span>الإجمالي الفرعي</span><strong>{formatMoney(cart.subtotal)}</strong></div>
              <p>هيتم تأكيد الشحن وطريقة الدفع في صفحة الإتمام الآمنة.</p>
              <button type="button" className="checkout-button" onClick={proceedToCheckout} disabled={loading || itemCount === 0}>
                {loading ? "جاري التحديث..." : "إتمام الطلب"}
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
