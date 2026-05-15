import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Order?</h2>
        <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
          Join thousands of happy customers enjoying delicious meals delivered
          fast.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/restaurants"
            className="inline-flex items-center justify-center gap-2 bg-white text-orange-600 font-semibold py-3.5 px-8 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Order Now
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 bg-transparent font-semibold py-3.5 px-8 rounded-lg hover:bg-white/10 transition-colors border-2 border-white"
          >
            Create Account
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
