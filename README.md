# Brandon Hendrickson Elite Fitness Funnel

A premium, high-converting sales funnel built with Next.js, TypeScript, and Framer Motion. This project showcases modern web development techniques and conversion-focused design.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-FF0055)

## 🚀 Features

- **AI Qualification Bot**: Interactive chatbot that qualifies leads with personalized scoring
- **Video Sales Letter**: Custom video player with engagement tracking
- **Dynamic Countdown Timer**: Synchronized urgency timer with price increases
- **3D Payment Experience**: Modern checkout with real-time card validation
- **Animated UI**: Smooth animations and mouse-tracking effects throughout
- **Mobile Responsive**: Fully optimized for all devices
- **High Performance**: Optimized for Core Web Vitals

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Deployment**: Vercel/GitHub Pages ready

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/brandon-funnel.git
cd brandon-funnel
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file based on `.env.example`:
```bash
cp .env.example .env.local
```

4. Add your Stripe keys to `.env.local`:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_publishable_key
STRIPE_SECRET_KEY=your_secret_key
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## 📁 Project Structure

```
brandon-funnel/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx           # Landing page (redirects to /sales)
│   ├── sales/
│   │   └── page.tsx       # Main sales funnel page
│   ├── checkout/
│   │   └── page.tsx       # Payment page
│   └── thank-you/
│       └── page.tsx       # Post-purchase page
├── components/
│   ├── Hero.tsx           # Hero section with animations
│   ├── VideoSalesLetter.tsx # Custom video player
│   ├── AIQualificationBot.tsx # Interactive AI bot
│   ├── FuturisticTimer.tsx # Countdown timer
│   ├── Offer.tsx          # Product offer section
│   └── ...                # Other components
├── hooks/
│   └── useCountdownTimer.ts # Timer logic
└── public/
    ├── brandon-message.mp4 # Sales video
    └── ...                # Other assets
```

## 🎨 Design System

- **Primary Color**: Champion Gold (#D4AF37)
- **Background**: Dark luxury theme
- **Typography**: Montserrat (headings), Inter (body)
- **Effects**: Glass morphism, gradient overlays, particle animations

## ⚡ Performance

- Lighthouse Score: 95+
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Cumulative Layout Shift: < 0.1

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel
```

### GitHub Pages
1. Update `next.config.js` with your repository name:
```js
const nextConfig = {
  output: 'export',
  basePath: '/your-repo-name',
  images: {
    unoptimized: true,
  },
}
```

2. Build and deploy:
```bash
npm run build
# Deploy the 'out' directory to GitHub Pages
```

## 📝 Environment Variables

Required environment variables:

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `NEXT_PUBLIC_API_URL` - API endpoint (default: http://localhost:3000/api)

## 🎥 Video Assets

The project uses video files that need to be placed in the `public` directory:
- `brandon-message.mp4` - Main sales video
- `brandon-training.mp4` - Training preview video

**Note**: Video files are not included in the repository due to size. You'll need to add your own videos.

## 🔧 Customization

To adapt this funnel for your own use:

1. Replace video files in `/public`
2. Update text content in components
3. Modify color scheme in `tailwind.config.js`
4. Adjust pricing in `Offer.tsx` and `checkout/page.tsx`
5. Update Stripe product IDs

## 📄 License

This project is for demonstration purposes. All rights reserved.

## 🤝 Contributing

This is a demo project and not open for contributions.

---

Built with ❤️ using Next.js and modern web technologies.