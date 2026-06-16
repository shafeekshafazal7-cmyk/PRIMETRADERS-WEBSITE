import React, { useState } from 'react';
import { 
  Percent, 
  Sparkles, 
  Download, 
  Printer, 
  Tag, 
  Calendar, 
  Bell, 
  Plus, 
  Search, 
  Check, 
  ExternalLink, 
  ShoppingCart, 
  Flame, 
  QrCode, 
  Sliders, 
  Eye, 
  Info,
  Gift,
  Coins,
  MapPin,
  Clock,
  LogOut,
  ChevronRight,
  Truck
} from 'lucide-react';
import { WholesaleProduct, WHOLESALE_PRODUCTS } from '../data';

interface NoticesDashboardProps {
  onAddToCart: (product: WholesaleProduct, qty: number) => void;
  onOpenCart: () => void;
  triggerFlash: (msg: string) => void;
}

interface NoticeItem {
  id: string;
  type: 'offer' | 'announcement' | 'alert' | 'event';
  title: string;
  tagline: string;
  badge: string;
  description: string;
  date: string;
  expiryDate?: string;
  associatedProductId?: string;
  discountPercent?: number;
  promoCode?: string;
  isUrgent?: boolean;
}

export function NoticesDashboard({ onAddToCart, onOpenCart, triggerFlash }: NoticesDashboardProps) {
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'offer' | 'announcement' | 'alert'>('all');

  // Custom Notice / Poster Generator State
  const [customTitle, setCustomTitle] = useState('MONSOON LOGISTICS SUPER SALE');
  const [customTagline, setCustomTagline] = useState('Flat 40% Off on Packaging Rolls & Tapes for Kerala Retailers');
  const [customProduct, setCustomProduct] = useState<WholesaleProduct | 'none'>(WHOLESALE_PRODUCTS[0]);
  const [customDiscount, setCustomDiscount] = useState<number>(30);
  const [customBadge, setCustomBadge] = useState('CHALAI EXCLUSIVE');
  const [customStyle, setCustomStyle] = useState<'amber-sunrise' | 'kerala-monsoon' | 'premium-neon' | 'kraft-eco'>('kerala-monsoon');
  const [customPromoCode, setCustomPromoCode] = useState('PRIME40');
  const [customNotes, setCustomNotes] = useState('Free delivery inside Thiruvananthapuram and Kollam sector limits.');
  const [isPosterDrawerOpen, setIsPosterDrawerOpen] = useState(false);

  // Active Poster Modal for "Print / High-Res View"
  const [activePrintPoster, setActivePrintPoster] = useState<{
    title: string;
    tagline: string;
    productName: string;
    discount?: number;
    badge: string;
    style: string;
    promoCode: string;
    notes: string;
    imageUrl?: string;
  } | null>(null);

  // Hardcoded Notices / Offers list
  const [notices, setNotices] = useState<NoticeItem[]>([
    {
      id: 'n-01',
      type: 'offer',
      title: 'Monsoon Cleaning Flurry Specials',
      tagline: 'Flat 30% Off on Commercial Squeegees for premium hotel yards.',
      badge: 'MONSOON EXCLUSIVE',
      description: 'Get extra heavy-duty vulcanized dual-lip cleaning squeegees for your resorts or outlets. Bulk deliveries of 10+ cases receive a complementary customized wooden mop-rod handle adapter set.',
      date: 'June 12, 2026',
      expiryDate: 'August 15, 2026',
      associatedProductId: 'h-01', // Heavy-Duty Squeegee
      discountPercent: 30,
      promoCode: 'SQUEEGEE30',
      isUrgent: true,
    },
    {
      id: 'n-02',
      type: 'announcement',
      title: 'Free Chalai Market Local Delivery Limit',
      tagline: 'Zero transport charge inside Thiruvananthapuram Main Bazaar circumference.',
      badge: 'LOCAL SERVICE',
      description: 'To support our shop neighbors during the pre-opening weeks, Prime Traders is offering completely free delivery for order totals above ₹5,000 if your supermarket or store is based inside the 5km Chalai loop.',
      date: 'June 10, 2026',
      expiryDate: 'Always Active',
      isUrgent: false,
    },
    {
      id: 'n-03',
      type: 'offer',
      title: 'Premium Insulated Lunch Boxes Special Bundle',
      tagline: 'Order 3 Cases of Crispy Neo and get Flat 20% cashback directly on billing.',
      badge: 'LUNCH BOX SALE',
      description: 'Perfect time to stock up secondary retail shelves before school reopening sessions peak. Genuine food-grade airtight silicone safety gaskets ensure rapid retail sales with high dealer margin spreads.',
      date: 'June 14, 2026',
      expiryDate: 'June 30, 2026',
      associatedProductId: 'h-11', // Crispy Neo Lunchbox
      discountPercent: 20,
      promoCode: 'CRISPY20',
      isUrgent: false,
    },
    {
      id: 'n-04',
      type: 'alert',
      title: 'High Demand Pre-Order Lock: Pure 1.5L Steel Cap Bottles',
      tagline: 'First container fully booked! Container 2 pre-bookings now open.',
      badge: 'OUT OF STOCK ALERT',
      description: 'Massive B2B orders for the pure crystal 1500ml steel cap fridge bottles have depleted our immediate stock. Pre-book from our incoming June 28 batch now to lock in pre-opening prices and guarantee state-wide logistical slot priority.',
      date: 'June 15, 2026',
      expiryDate: 'June 28, 2026',
      associatedProductId: 'h-15', // Pure 1.5L Bottle
      isUrgent: true,
    },
    {
      id: 'n-05',
      type: 'offer',
      title: 'Ultra-Adhesive Packing Tape Bulk Roll Box Special',
      tagline: 'Save 15% off when bundling with 5-Ply Corrugated Shipping Boxes.',
      badge: 'LOGISTICS SAVER',
      description: 'Strengthen heavy cardboard seals under humid climates. Combine a box of 3-inch brown packing tapes with any selection of 5-Ply flat boxes to apply a direct 15% combined bulk discount on total checkout quotation values.',
      date: 'June 11, 2026',
      expiryDate: 'July 10, 2026',
      associatedProductId: 'p-02', // Carton tape
      discountPercent: 15,
      promoCode: 'TAPESHIP15',
      isUrgent: false,
    }
  ]);

  // Handle claiming a product discount and injecting to invoice cart
  const handleClaimOffer = (notice: NoticeItem) => {
    if (!notice.associatedProductId) {
      triggerFlash("This is an general announcement. Add products from the catalog directly!");
      return;
    }
    const product = WHOLESALE_PRODUCTS.find(p => p.id === notice.associatedProductId);
    if (!product) {
      triggerFlash("Target promotional product is currently unavailable.");
      return;
    }

    // Apply the custom offer discount percent to the product price for the cart injection
    const discount = notice.discountPercent || 0;
    const finalPrice = discount > 0 ? Math.round(product.wholesalePrice * (1 - discount / 100)) : product.wholesalePrice;
    
    const discountedProduct: WholesaleProduct = {
      ...product,
      name: `${product.name} (${notice.promoCode} Offer)`,
      wholesalePrice: finalPrice,
      description: `[Offers Desk Coupon: ${notice.promoCode} Applied - Saved ${discount}%] - ${product.description}`
    };

    onAddToCart(discountedProduct, product.minOrderQty);
    triggerFlash(`Applied Coupon ${notice.promoCode}! Added ${product.minOrderQty} bags of "${product.name}" at ₹${finalPrice} wholesale price!`);
  };

  // Add custom notice created by B2B user
  const handleCreateCustomPoster = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) {
      triggerFlash("Please specify a headline for your offer flyer.");
      return;
    }

    const hasProduct = customProduct !== 'none';
    const newNotice: NoticeItem = {
      id: `custom-notice-${Date.now()}`,
      type: 'offer',
      title: customTitle,
      tagline: customTagline,
      badge: customBadge.toUpperCase() || 'CUSTOM DEAL',
      description: `${customNotes} Code: ${customPromoCode}. Target product: ${hasProduct ? customProduct.name : 'All Store categories'}.`,
      date: 'Just Now',
      expiryDate: 'Limited Time',
      associatedProductId: hasProduct ? customProduct.id : undefined,
      discountPercent: customDiscount,
      promoCode: customPromoCode || 'PRIMEPROMO',
      isUrgent: true
    };

    setNotices([newNotice, ...notices]);
    setIsPosterDrawerOpen(false);
    triggerFlash("Custom B2B Promotional Poster saved successfully to the dashboard!");
    
    // Automatically open print preview of the created custom poster
    setActivePrintPoster({
      title: customTitle,
      tagline: customTagline,
      productName: hasProduct ? customProduct.name : 'All Store categories',
      discount: customDiscount,
      badge: customBadge,
      style: customStyle,
      promoCode: customPromoCode,
      notes: customNotes,
      imageUrl: hasProduct ? customProduct.imageUrl : 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80'
    });
  };

  // Preset Poster cards helper
  const posterPresets = [
    {
      title: "CHALAI GRAND OPENING BONANZA",
      tagline: "Free Bulk Dispenser Tool with any Box of 24 Heavy-Duty Brown Carton Tapes",
      productName: "Ultra-Adhesive Brown Carton Tape (3-Inch)",
      badge: "CHALAI OPENING EXCLUSIVE",
      style: "amber-sunrise",
      discount: 15,
      qtyGoal: "Minimum 5 Boxes order base",
      promoCode: "CHALAITAPE",
      notes: "Promo is valid exclusively for pre-launch registrations by local Thiruvananthapuram shopkeepers.",
      imageUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "MONSOON FLOOD DRYING DRIVE",
      tagline: "Commercial Vulcanized Rubber Floor Squeegees flat discount list live",
      productName: "Heavy-Duty Commercial Floor Squeegee",
      badge: "KERALA MONSOON HERO",
      style: "kerala-monsoon",
      discount: 30,
      qtyGoal: "Applies on carton loads of 10 units",
      promoCode: "RAINDRAW",
      notes: "Complimentary non-slip wooden mop adapters dispatched automatically on freight trucks.",
      imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6954?auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "ECO RECYCLABLE BULK PACKAGING",
      tagline: "High weight load gusseted loop checkout handle grocery bags",
      productName: "Durable Recyclable Loop-Handle Carry Bags",
      badge: "GO GREEN KERALA",
      style: "kraft-eco",
      discount: 10,
      qtyGoal: "Apply on bulk bales of 1000 premium bags",
      promoCode: "ECOBALES",
      notes: "ISO certified eco-cycle degradability for strict Kerala green commerce standards compliance.",
      imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80"
    }
  ];

  // Map CSS styles directly for gorgeous themed posters
  const getStyleClasses = (style: string) => {
    switch (style) {
      case 'amber-sunrise':
        return {
          cardBg: 'bg-gradient-to-tr from-[#0F172A] via-[#1E293B] to-[#3B150A] text-white border-orange-500/30',
          badgeBg: 'bg-amber-500 text-slate-950 font-bold',
          badgeText: 'text-amber-400',
          buttonBg: 'bg-amber-500 text-slate-950 hover:bg-amber-400',
          decorText: 'text-amber-500/10'
        };
      case 'premium-neon':
        return {
          cardBg: 'bg-gradient-to-br from-[#0F172A] to-[#043259] text-white border-cyan-500/30',
          badgeBg: 'bg-cyan-500 text-slate-950 font-sans font-bold',
          badgeText: 'text-cyan-400 font-mono',
          buttonBg: 'bg-cyan-500 text-slate-950 hover:bg-cyan-400',
          decorText: 'text-cyan-500/10'
        };
      case 'kraft-eco':
        return {
          cardBg: 'bg-gradient-to-tr from-[#1E293B] to-[#14532D] text-white border-green-500/20',
          badgeBg: 'bg-emerald-500 text-slate-950 font-bold',
          badgeText: 'text-emerald-400',
          buttonBg: 'bg-emerald-500 text-slate-950 hover:bg-emerald-400',
          decorText: 'text-emerald-500/10'
        };
      case 'kerala-monsoon':
      default:
        return {
          cardBg: 'bg-gradient-to-b from-[#121c33] to-[#043259] text-[#FAF7EE] border-blue-900/40',
          badgeBg: 'bg-orange-500 text-white font-extrabold',
          badgeText: 'text-orange-400',
          buttonBg: 'bg-orange-500 text-white hover:bg-orange-600',
          decorText: 'text-orange-500/10'
        };
    }
  };

  // Filter list of notices based on search queries and type selects
  const filteredNotices = notices.filter(item => {
    const term = searchQuery.toLowerCase();
    const matchesSearch = item.title.toLowerCase().includes(term) || 
                          item.tagline.toLowerCase().includes(term) ||
                          item.description.toLowerCase().includes(term) ||
                          (item.promoCode && item.promoCode.toLowerCase().includes(term));
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div id="notices-offers-dashboard-root" className="space-y-10 text-left">
      
      {/* SECTION HEADER BLOCK */}
      <div className="border-b border-blue-900/10 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-mono font-extrabold text-[#e35a11] uppercase">
            <Bell size={13} className="animate-bounce" /> 
            <span>Digital B2B Promo Wall & Flyers</span>
          </div>
          <h2 className="font-serif text-3xl font-extrabold text-[#043259] tracking-tight">
            Notices & Offers Dashboard
          </h2>
          <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
            Monitor physical shop opening schedules, trade alerts, and print elegant promotional flyers. Click any "Apply Coupon" card to inject discounted wholesale bundles instantly into your checkout quotation!
          </p>
        </div>

        {/* Action button to create a custom offer flyer */}
        <button
          onClick={() => setIsPosterDrawerOpen(true)}
          className="bg-[#043259] hover:bg-[#07477d] text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-2xl shadow-lg flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus size={15} />
          Create custom Offer Poster
        </button>
      </div>

      {/* QUICK BENTO HIGHLIGHT CARDS: STATS & POLICIES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-orange-500/5 border border-orange-500/10 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600 shrink-0">
            <Percent size={20} />
          </div>
          <div className="space-y-1">
            <span className="font-mono text-[9px] font-bold text-orange-600 uppercase tracking-widest">Pre-Opening Schemes</span>
            <h4 className="font-serif text-sm font-bold text-slate-800">Direct Invoice Markdown</h4>
            <p className="text-xs text-slate-500 leading-normal">
              Apply valid coupons below. Orders registered before launch qualify for priority packing queue priority.
            </p>
          </div>
        </div>

        <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 shrink-0">
            <Coins size={20} />
          </div>
          <div className="space-y-1 text-left">
            <span className="font-mono text-[9px] font-bold text-blue-600 uppercase tracking-widest">Liquid Cash Settlement</span>
            <h4 className="font-serif text-sm font-bold text-slate-800">NEFT Bank Transfer Discount</h4>
            <p className="text-xs text-slate-500 leading-normal">
              Earn flat 2.5% rebate on all invoice tallies above ₹15,000 by clearing dues via IMPS/NEFT rather than standard cash.
            </p>
          </div>
        </div>

        <div className="bg-emerald-500/5 border border-green-500/10 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
            <MapPin size={20} />
          </div>
          <div className="space-y-1 text-left">
            <span className="font-mono text-[9px] font-bold text-[#10b981] uppercase tracking-widest">Local Transit Waiver</span>
            <h4 className="font-serif text-sm font-bold text-slate-800">Chalai Free Delivery Zone</h4>
            <p className="text-xs text-slate-500 leading-normal">
              Free courier drops for our Chalai Bazaar shop neighbors. Skip standard delivery parameters automatically.
            </p>
          </div>
        </div>

      </div>

      {/* BLOCK 1: PRESET PROFESSIONAL POSTERS GALLERY (GORGEOUS MERCHANDISING ADS) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-orange-500" />
          <h3 className="font-serif text-xl font-bold text-[#043259]">
            Active Promotional Posters Wall
          </h3>
        </div>
        <p className="text-xs text-slate-500 max-w-xl">
          Visual flyers matching our high-fidelity Kerala warehouse catalog. Click on any poster flyer to trigger high-resolution print rendering or direct discount injection.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          {posterPresets.map((poster, index) => {
            const styles = getStyleClasses(poster.style);
            return (
              <div 
                key={index}
                className={`rounded-3xl border ${styles.cardBg} shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[380px] p-6 group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl text-left`}
              >
                {/* Decorative background visual overlay */}
                <span className="absolute bottom-1 right-2 font-black font-sans text-8xl opacity-[0.04] pointer-events-none select-none tracking-tighter">
                  {poster.discount}% OFF
                </span>

                {/* Card Top */}
                <div className="space-y-4 relative z-10">
                  <div className="flex justify-between items-start gap-2">
                    <span className={`text-[9px] font-mono font-extrabold uppercase px-2.5 py-1 rounded-lg tracking-widest ${styles.badgeBg}`}>
                      {poster.badge}
                    </span>
                    <span className="font-mono text-[11px] font-semibold text-orange-400">
                      Code: {poster.promoCode}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <h4 className="font-serif text-lg sm:text-xl font-black leading-tight tracking-tight uppercase">
                      {poster.title}
                    </h4>
                    <p className="text-xs text-slate-300/90 leading-relaxed font-sans">{poster.tagline}</p>
                  </div>
                </div>

                {/* Middle design elements - Product visual widget */}
                <div className="my-5 p-4 rounded-2xl bg-black/20 border border-white/5 relative z-10 flex items-center gap-3">
                  {poster.imageUrl && (
                    <img 
                      src={poster.imageUrl} 
                      alt={poster.productName} 
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-lg object-cover shrink-0 bg-slate-900 border border-white/10" 
                    />
                  )}
                  <div className="text-left">
                    <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Promoted Product</div>
                    <div className="text-xs font-serif font-bold text-white line-clamp-1">{poster.productName}</div>
                    <div className="text-[10px] text-orange-400 font-mono font-extrabold mt-0.5">{poster.qtyGoal}</div>
                  </div>
                </div>

                {/* Card bottom buttons */}
                <div className="space-y-3 pt-4 border-t border-white/15 relative z-10">
                  <div className="text-[10.5px] text-slate-400 leading-normal italic text-left">
                    *{poster.notes}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        const targetProduct = WHOLESALE_PRODUCTS.find(p => p.name.includes(poster.productName) || p.id === 'p-02');
                        if (targetProduct) {
                          const promoProduct: WholesaleProduct = {
                            ...targetProduct,
                            name: `${targetProduct.name} (${poster.discount}% Off - Poster Special)`,
                            wholesalePrice: Math.round(targetProduct.wholesalePrice * (1 - poster.discount / 100)),
                            description: `[Official Poster Deal Applied] ${targetProduct.description}`
                          };
                          onAddToCart(promoProduct, targetProduct.minOrderQty);
                          triggerFlash(`Applied ${poster.discount}% discount code "${poster.promoCode}" successfully!`);
                        } else {
                          triggerFlash("Could not fetch associated product. Add directly from Products tab.");
                        }
                      }}
                      className="w-full bg-[#FAF7EE] text-[#043259] font-sans font-bold text-xs py-2.5 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors flex items-center justify-center gap-1 shadow-sm"
                    >
                      <ShoppingCart size={13} />
                      Claim Offer
                    </button>
                    
                    <button
                      onClick={() => {
                        setActivePrintPoster(poster);
                      }}
                      className="w-full bg-black/40 hover:bg-black/60 text-white font-mono text-[10px] font-bold py-2.5 rounded-xl border border-white/15 cursor-pointer transition-colors flex items-center justify-center gap-1"
                    >
                      <Eye size={13} />
                      Poster Specs
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BLOCK 2: SPLIT LAYOUT - ACTIVE NOTICES LIST & BOARD SEARCH */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">

        {/* NOTICES LIST PANEL (8 columns wide) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h3 className="font-serif text-xl font-bold text-[#043259] flex items-center gap-2">
              <Bell size={17} className="text-[#e35a11]" />
              Active Notices & Trade Announcements
            </h3>
            
            {/* Filter tags inside header block */}
            <div className="flex flex-wrap gap-1 bg-slate-200/50 p-1 rounded-xl border border-slate-300/30">
              {(['all', 'offer', 'announcement', 'alert'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1 text-[9.5px] uppercase tracking-wider font-extrabold rounded-lg transition-colors cursor-pointer ${
                    filterType === type 
                      ? 'bg-[#043259] text-white' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar Input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3 text-slate-400" size={15} />
            <input
              type="text"
              id="notice-board-search"
              placeholder="Search current notices, products, or promocodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#043259] focus:ring-1 focus:ring-[#043259]"
            />
          </div>

          {/* Notices Cards listing Stack */}
          <div id="active-notices-feed" className="space-y-4 pt-1">
            {filteredNotices.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 py-12 px-6 text-center space-y-3">
                <Info size={30} className="text-slate-400 mx-auto" />
                <p className="font-serif italic text-slate-500">No matching notices found.</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Try adjusting your search criteria or filter tags to find active logistics notices or grand opening announcements.
                </p>
              </div>
            ) : (
              filteredNotices.map((notice) => {
                const isOffer = notice.type === 'offer';
                const isAlert = notice.type === 'alert';
                const isAnnouncement = notice.type === 'announcement';

                return (
                  <div
                    key={notice.id}
                    className={`bg-white rounded-2xl border transition-all hover:shadow-md p-5 sm:p-6 text-left relative overflow-hidden flex flex-col md:flex-row md:items-start md:justify-between gap-4 ${
                      notice.isUrgent 
                        ? 'border-orange-500/20 shadow-sm' 
                        : 'border-slate-200'
                    }`}
                  >
                    {/* Urgent side accent strip */}
                    {notice.isUrgent && (
                      <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-orange-500" />
                    )}

                    <div className="space-y-2.5 flex-grow text-left">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[8.5px] font-mono font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${
                          isOffer 
                            ? 'bg-orange-100 text-orange-600' 
                            : isAlert 
                            ? 'bg-red-50 text-red-650' 
                            : isAnnouncement 
                            ? 'bg-blue-50 text-[#043259]' 
                            : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          {notice.badge}
                        </span>

                        <span className="font-mono text-[9px] text-slate-400">
                          Published: {notice.date}
                        </span>
                        {notice.expiryDate && (
                          <span className="font-mono text-[9px] text-amber-600 font-bold">
                            • Void: {notice.expiryDate}
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <h4 className="font-serif text-base font-bold text-slate-800 flex items-center gap-1.5">
                          {notice.title}
                          {notice.isUrgent && (
                            <span className="text-orange-500 font-serif text-xs px-1.5 py-0 border border-orange-500/10 rounded-md bg-orange-50 animate-pulse uppercase tracking-[0.1em] font-extrabold font-mono text-[8.5px]">
                              URGENT
                            </span>
                          )}
                        </h4>
                        <p className="text-xs font-serif font-semibold text-slate-600 italic">
                          "{notice.tagline}"
                        </p>
                      </div>

                      <p className="text-xs text-slate-500 font-sans leading-relaxed max-w-2xl">
                        {notice.description}
                      </p>

                      {/* Associated promoted product brief within notice text */}
                      {notice.associatedProductId && (
                        <div className="mt-2.5 bg-slate-50 rounded-xl px-3 py-2 border border-slate-100 flex items-center justify-between text-xs max-w-lg">
                          <div className="flex items-center gap-2">
                            <Tag size={12} className="text-orange-500" />
                            <span className="text-[11px] text-slate-500 font-bold">
                              Eligible: {WHOLESALE_PRODUCTS.find(p => p.id === notice.associatedProductId)?.name || 'Product'}
                            </span>
                          </div>
                          {notice.discountPercent && (
                            <span className="font-mono font-extrabold text-[10.5px] text-[#e35a11]">
                              SAVE {notice.discountPercent}% OFF
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Operational CTA block */}
                    <div className="flex sm:flex-col md:items-end justify-end shrink-0 gap-2 min-w-[140px] pt-2 md:pt-0">
                      {isOffer && notice.associatedProductId ? (
                        <button
                          onClick={() => handleClaimOffer(notice)}
                          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold font-sans uppercase tracking-wider cursor-pointer shadow-md transition-all flex items-center justify-center gap-1 w-full"
                        >
                          <ShoppingCart size={12} />
                          Apply Coupon
                        </button>
                      ) : notice.associatedProductId ? (
                        <button
                          onClick={() => handleClaimOffer(notice)}
                          className="px-4 py-2 bg-[#043259] hover:bg-[#07477d] text-white rounded-xl text-xs font-bold font-sans uppercase tracking-wider cursor-pointer shadow-md transition-all flex items-center justify-center gap-1 w-full"
                        >
                          <ShoppingCart size={12} />
                          Verify Stock
                        </button>
                      ) : null}

                      <button
                        onClick={() => {
                          const association = WHOLESALE_PRODUCTS.find(p => p.id === notice.associatedProductId);
                          setActivePrintPoster({
                            title: notice.title.toUpperCase(),
                            tagline: notice.tagline,
                            productName: association ? association.name : 'ALL STORES',
                            discount: notice.discountPercent || 0,
                            badge: notice.badge,
                            style: isOffer ? 'amber-sunrise' : isAlert ? 'premium-neon' : 'kerala-monsoon',
                            promoCode: notice.promoCode || 'PRIMEGLOBAL',
                            notes: notice.description,
                            imageUrl: association ? association.imageUrl : 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80'
                          });
                        }}
                        className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-[#043259] rounded-xl text-[10px] font-bold font-mono uppercase tracking-wider cursor-pointer transition-colors flex items-center justify-center gap-1 w-full"
                      >
                        <Printer size={12} />
                        Print Notice
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* SIDE BAR TRADER INFORMATION STATION (4 columns wide) */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-[#121c33] text-white border border-blue-900/45 rounded-3xl p-6 shadow-xl relative overflow-hidden text-left">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <span className="font-mono text-[8px] font-bold tracking-widest text-[#e35a11] uppercase bg-orange-500/10 px-2 py-0.5 rounded-md">
              STORE SCHEDULER
            </span>
            <h3 className="font-serif text-lg font-black text-white mt-1.5">Launch Phase Details</h3>
            
            <div className="mt-4 space-y-3.5 text-xs text-slate-300">
              
              <div className="flex items-start gap-2.5 pb-2 border-b border-white/5">
                <Calendar size={13} className="text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-150 block mb-0.5 text-white">Soft Launch Date</strong>
                  <span className="font-mono text-slate-400">June 28, 2026 - Chalai</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pb-2 border-b border-white/5">
                <Truck size={13} className="text-[#3b82f6] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-150 block mb-0.5 text-white">Inward Shipments</strong>
                  <span className="text-slate-400 leading-normal block">
                    Heavy polymer raw virgin loads expected daily. Special custom print molds deployed.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Check size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-150 block mb-0.5 text-white">Pre-Approved Partners</strong>
                  <span className="text-slate-400 leading-normal block">
                    Local dealers can clear security clearances at our office to skip initial VAT checks.
                  </span>
                </div>
              </div>

            </div>

            <div className="mt-6 bg-[#091124] rounded-2xl p-4 border border-white/5 space-y-2 text-center">
              <span className="text-[10px] font-mono text-slate-400 block tracking-wider font-extrabold uppercase">
                WH Wholesale Contact
              </span>
              <strong className="text-base text-orange-400 font-mono tracking-wide">+91 94460 51515</strong>
              <p className="text-[9.5px] text-slate-500">Contact Shafeek for custom institutional quotations.</p>
            </div>
          </div>

          {/* QUICK CHALAI WEATHER / MONSOON ALERT BAR */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-3xl p-6 text-left space-y-3">
            <span className="font-mono text-[8px] font-bold tracking-widest text-[#d97706] uppercase bg-amber-500/10 px-2 py-0.5 rounded-md">
              KERALA MONSOON ADVISORY
            </span>
            <h4 className="font-serif text-sm font-bold text-[#854d0e]">Logistics Moisture Alert</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Coastal air levels in Thiruvananthapuram are climbing to 92% humidity. We suggest all distributors utilize our **double-layered bubble wrap plys** and **50-micron carton tapes** to resist seam-slipping during standard transit.
            </p>
          </div>

        </div>

      </div>

      {/* FLYER / POSTER INTERACTIVE CREATOR DRAWER */}
      {isPosterDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in text-left">
          <div className="bg-[#121c33] border border-blue-900/40 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative my-8">
            
            <button
              onClick={() => setIsPosterDrawerOpen(false)}
              className="absolute top-6 right-6 p-1.5 px-3 bg-black/35 text-[10px] font-bold font-mono tracking-wider text-slate-300 hover:text-white border border-blue-900/40 rounded-lg cursor-pointer"
            >
              CANCEL
            </button>

            <div className="border-b border-white/5 pb-3">
              <h3 className="font-serif text-xl font-bold text-white">Create B2B Custom Offer Flyer</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Draft announcements or special discount alerts to advertise to your branch managers, retail partners or store supervisors.
              </p>
            </div>

            <form onSubmit={handleCreateCustomPoster} className="space-y-4 font-sans text-xs">
              
              <div className="space-y-1">
                <label className="block font-mono text-[9px] uppercase tracking-widest text-slate-400 font-bold">
                  Campaign Headline / Headline *
                </label>
                <input
                  type="text"
                  required
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g. GRAND LAUNCH CLEARANCE"
                  className="w-full bg-[#091124] rounded-xl border border-blue-900/30 p-2.5 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-mono text-[9px] uppercase tracking-widest text-slate-400 font-bold">
                  Sub-heading / Offer Description
                </label>
                <input
                  type="text"
                  value={customTagline}
                  onChange={(e) => setCustomTagline(e.target.value)}
                  placeholder="e.g. Free delivery inside Chalai Loop"
                  className="w-full bg-[#091124] rounded-xl border border-blue-900/30 p-2.5 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-mono text-[9px] uppercase tracking-widest text-slate-400 font-bold">
                    Link with Product (for active Cart apply)
                  </label>
                  <select
                    value={customProduct === 'none' ? 'none' : customProduct.id}
                    onChange={(e) => {
                      const found = WHOLESALE_PRODUCTS.find(p => p.id === e.target.value);
                      setCustomProduct(found || 'none');
                    }}
                    className="w-full bg-[#091124] rounded-xl border border-blue-900/30 p-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="none">None - General store flyer</option>
                    {WHOLESALE_PRODUCTS.map((prod) => (
                      <option key={prod.id} value={prod.id}>{prod.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-mono text-[9px] uppercase tracking-widest text-slate-400 font-bold">
                    Offer Discount Rate (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="90"
                    value={customDiscount}
                    onChange={(e) => setCustomDiscount(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#091124] rounded-xl border border-blue-900/30 p-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-mono text-[9px] uppercase tracking-widest text-slate-400 font-bold">
                    Poster Label Badge
                  </label>
                  <input
                    type="text"
                    value={customBadge}
                    onChange={(e) => setCustomBadge(e.target.value)}
                    placeholder="e.g. BULK ONLY"
                    className="w-full bg-[#091124] rounded-xl border border-blue-900/30 p-2.5 text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-mono text-[9px] uppercase tracking-widest text-slate-400 font-bold">
                    Flyer Theme Style
                  </label>
                  <select
                    value={customStyle}
                    onChange={(e: any) => setCustomStyle(e.target.value)}
                    className="w-full bg-[#091124] rounded-xl border border-blue-900/30 p-2.5 text-xs text-[#FAF7EE]"
                  >
                    <option value="kerala-monsoon">Kerala Ocean Blue</option>
                    <option value="amber-sunrise">Amber Dawn Gold</option>
                    <option value="premium-neon">Anodized Cyan/Teal</option>
                    <option value="kraft-eco">Forest Eco Green</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-mono text-[9px] uppercase tracking-widest text-slate-400 font-bold">
                    Custom Promo Code
                  </label>
                  <input
                    type="text"
                    value={customPromoCode}
                    onChange={(e) => setCustomPromoCode(e.target.value)}
                    placeholder="e.g. PRIMEOUTLET"
                    className="w-full bg-[#091124] rounded-xl border border-blue-900/30 p-2.5 text-xs text-white font-mono uppercase"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="block font-mono text-[9px] uppercase tracking-widest text-slate-400 font-bold">
                    Disclaimer Footnote
                  </label>
                  <input
                    type="text"
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    placeholder="e.g. Delivery terms apply."
                    className="w-full bg-[#091124] rounded-xl border border-blue-900/30 p-2.5 text-xs text-slate-400"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-end gap-2">
                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold py-3 rounded-2xl shadow-lg uppercase tracking-wider cursor-pointer transition-all"
                >
                  Generate & Preview Poster
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* FLYER HIGH-RES SPEC SHEET AND SIMULATED PRINT DIALOG MODAL */}
      {activePrintPoster && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in text-left">
          <div className="bg-[#FAF7EE] text-slate-900 border-4 border-[#043259] rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative my-8 p-0 flex flex-col justify-between">
            
            {/* Modal actions panel top */}
            <div className="bg-[#043259] text-[#FAF7EE] p-4 flex justify-between items-center shrink-0">
              <span className="font-mono text-[10px] tracking-widest font-extrabold uppercase">
                OFFICIAL WHOLESALE PROMOTION SHEET
              </span>
              <button
                onClick={() => setActivePrintPoster(null)}
                className="px-3 py-1 bg-white/10 text-white text-[10px] font-mono tracking-tight hover:bg-white/15 border border-white/20 rounded cursor-pointer"
              >
                CLOSE [X]
              </button>
            </div>

            {/* Printable Poster Container */}
            <div id="print-canvas-view" className="p-8 space-y-6 flex-grow bg-[#FAF7EE] text-left">
              
              {/* Header */}
              <div className="flex justify-between items-start border-b-2 border-slate-300 pb-4">
                <div className="space-y-1">
                  <span className="font-mono text-[9px] font-extrabold tracking-widest text-[#e35a11] uppercase bg-orange-500/10 px-2 py-0.5 rounded-md">
                    {activePrintPoster.badge || 'PROMOTION'}
                  </span>
                  <h1 className="font-serif text-xl sm:text-2xl font-black text-[#043259] leading-none uppercase mt-1">
                    PRIME TRADERS
                  </h1>
                  <p className="font-mono text-[8px] tracking-wider text-slate-500">
                    Chalai Main Road, Thiruvananthapuram, Kerala, India
                  </p>
                </div>
                
                {/* Simulated QR Code */}
                <div className="p-1 bg-white border border-slate-300 rounded-lg shadow-sm flex flex-col items-center gap-1">
                  <QrCode size={40} className="text-[#043259]" />
                  <span className="text-[7px] font-mono font-bold text-slate-500">CHALAI TVM</span>
                </div>
              </div>

              {/* Poster Body */}
              <div className="text-center py-6 border-b-2 border-dashed border-slate-300 space-y-3">
                {activePrintPoster.discount && activePrintPoster.discount > 0 ? (
                  <div className="inline-block transform -rotate-1 bg-[#e35a11] text-white px-5 py-2 rounded-2xl font-black font-mono tracking-tighter text-2xl sm:text-3xl shadow-md">
                    SAVE {activePrintPoster.discount}% OFF
                  </div>
                ) : (
                  <div className="inline-block bg-[#043259] text-[#FAF7EE] px-5 py-2 rounded-2xl font-black font-serif tracking-tight text-xl uppercase shadow-md">
                    SPECIAL OFFER
                  </div>
                )}

                <div className="space-y-2 pt-2">
                  <h2 className="font-serif text-xl sm:text-2xl font-black text-slate-900 leading-none">
                    {activePrintPoster.title}
                  </h2>
                  <p className="text-xs text-slate-600 italic font-serif leading-relaxed px-4">
                    "{activePrintPoster.tagline}"
                  </p>
                </div>
              </div>

              {/* Product link details and code */}
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-4 border border-slate-300 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono text-[8px] text-slate-400 uppercase font-extrabold">Wholesale Batch</span>
                    <h4 className="font-serif font-bold text-[#043259]">{activePrintPoster.productName}</h4>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-[8.5px] text-slate-400 block uppercase">Logistics Code</span>
                    <strong className="font-mono text-[#e35a11] font-bold text-[12px]">
                      {activePrintPoster.promoCode || 'PRIMEWH'}
                    </strong>
                  </div>
                </div>

                <div className="space-y-1.5 text-slate-500 text-[11px] leading-relaxed">
                  <p className="font-serif italic font-semibold text-[#043259]">
                    Notice Details / Logistics note:
                  </p>
                  <p className="border-l-2 border-orange-500 pl-2.5 text-slate-600 font-sans">
                    {activePrintPoster.notes || 'This wholesale voucher complies directly to the legal framework rules of State Goods and Services Act for coastal trader checkouts.'}
                  </p>
                </div>
              </div>

              {/* Voucher Footer */}
              <div className="pt-4 border-t border-slate-300 flex justify-between items-center text-[8.5px] font-mono text-slate-400">
                <span>&copy; PRIME TRADERS CHALAI CO-OPS</span>
                <span>CONTACT: +91 94460 51515</span>
              </div>

            </div>

            {/* Print trigger button action */}
            <div className="p-4 bg-slate-200/60 border-t border-slate-300 text-center flex gap-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="w-full bg-[#043259] hover:bg-[#07477d] text-white font-bold text-xs py-3 rounded-2xl flex items-center justify-center gap-1 cursor-pointer transition-colors"
              >
                <Printer size={15} /> Print Poster Flyer
              </button>
              
              <button
                onClick={() => {
                  triggerFlash(`Simulated download for "${activePrintPoster.title}" poster complete! Saved to device.`);
                  setActivePrintPoster(null);
                }}
                className="w-full bg-[#e35a11] hover:bg-[#c74c0b] text-white font-bold text-xs py-3 rounded-2xl flex items-center justify-center gap-1 cursor-pointer transition-colors"
              >
                <Download size={15} /> Download PDF Spec
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
