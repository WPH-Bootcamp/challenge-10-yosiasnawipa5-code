import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">✳️</span>
            <span className="font-bold text-white text-lg">Foody</span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Enjoy homemade flavors & chef&apos;s signature dishes, freshly prepared every day. Order online or visit our nearest branch.
          </p>
          <div className="flex items-center gap-3 mt-4">
            {["f", "in", "li", "tk"].map((s) => (
              <a
                key={s}
                href="#"
                className="w-8 h-8 rounded-full bg-gray-700 hover:bg-[#C8102E] flex items-center justify-center text-xs font-bold text-white transition-colors"
              >
                {s}
              </a>
            ))}
          </div>
        </div>

        {/* Explore */}
        <div>
          <p className="font-semibold text-white mb-3">Explore</p>
          <ul className="space-y-2 text-sm">
            {["All Food", "Nearby", "Discount", "Best Seller", "Delivery", "Lunch"].map((item) => (
              <li key={item}>
                <Link href="/" className="hover:text-white transition-colors">{item}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Help */}
        <div>
          <p className="font-semibold text-white mb-3">Help</p>
          <ul className="space-y-2 text-sm">
            {["How to Order", "Payment Methods", "Track My Order", "FAQ", "Contact Us"].map((item) => (
              <li key={item}>
                <Link href="/" className="hover:text-white transition-colors">{item}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
