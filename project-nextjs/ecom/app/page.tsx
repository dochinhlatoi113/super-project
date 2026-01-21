import BannerSlider from './components/BannerSlider';
import CategoryList from './components/CategoryList';
import FeaturedProducts from './components/FeaturedProducts';
import PromoBanner from './components/PromoBanner';
import NewsSection from './components/NewsSection';
import SideCategoryMenu from './components/SideCategoryMenu';

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex w-full max-w-7xl mx-auto px-2 mt-4 gap-4 mb-6">
        <div className="hidden md:block w-56 flex-shrink-0">
          <SideCategoryMenu />
        </div>
        <div className="flex-1">
          <div className="rounded-lg shadow bg-white overflow-hidden h-full flex items-center justify-center">
            <BannerSlider />
          </div>
        </div>
      </div>
      <div className="flex w-full max-w-7xl mx-auto px-2">
        <div className="flex-1 flex flex-col gap-4">
          <img src="/banner-tet.avif" alt="banner-tet" className="w-full h-32 rounded-lg shadow" />
          <FeaturedProducts />
          <PromoBanner />
          <NewsSection />
        </div>
      </div>
    </main>
  );
}
