import { Search, ShoppingBag, Truck } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Browse Restaurants",
    description:
      "Explore a wide variety of local restaurants and cuisines near you.",
  },
  {
    icon: ShoppingBag,
    title: "Place Your Order",
    description:
      "Choose your favorite dishes and customize them to your liking.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description:
      "Get your food delivered fresh and hot right to your doorstep.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">How It Works</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Ordering food has never been easier — just three simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.title} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 text-orange-500 rounded-2xl mb-5">
                <step.icon className="w-7 h-7" />
              </div>
              <div className="text-sm text-orange-500 font-semibold mb-2">
                Step {index + 1}
              </div>
              <h3 className="text-lg font-bold mb-2">{step.title}</h3>
              <p className="text-gray-500 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
