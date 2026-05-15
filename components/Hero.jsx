import Link from "next/link";
import { ArrowRight, Clock, Star, Truck } from "lucide-react";

const stats = [
  { icon: Star, value: "4.9", label: "Customer Rating" },
  { icon: Clock, value: "30 min", label: "Average Delivery" },
  { icon: Truck, value: "50+", label: "Restaurant Partners" },
];

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-yellow-500 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-20 lg:py-28">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 bg-orange-500/20 text-orange-400 text-sm font-medium rounded-full mb-6">
            Delivering happiness to your doorstep
          </span>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Discover{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
              Great Food
            </span>{" "}
            Nearby
          </h1>

          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Order from your favorite local restaurants with fast delivery, fresh
            ingredients, and excellent service — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/restaurants"
              className="inline-flex items-center justify-center gap-2 bg-orange-500 text-white font-semibold py-3.5 px-8 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Browse Restaurants
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold py-3.5 px-8 rounded-lg hover:bg-white/20 transition-colors border border-white/20"
            >
              Sign Up Free
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="w-5 h-5 text-orange-400 mx-auto mb-2" />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
