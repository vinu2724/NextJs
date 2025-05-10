const plans = [
  {
    name: "Basic",
    price: "$19/mo",
    features: ["1 Project", "100GB Storage", "Basic Support"],
    popular: false,
  },
  {
    name: "Pro",
    price: "$49/mo",
    features: ["10 Projects", "1TB Storage", "Priority Support"],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$99/mo",
    features: ["Unlimited Projects", "10TB Storage", "24/7 Support"],
    popular: false,
  },
];

export default function PricingTable() {
  return (
    <>
      <section className="bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Pricing Plans
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`p-6 rounded-lg shadow-md bg-white text-center ${
                  plan.popular ? "border-4 border-blue-500" : ""
                }`}
              >
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className="text-3xl font-semibold text-blue-600 mb-4">
                  {plan.price}
                </p>
                <ul className="space-y-2 mb-6 text-gray-700">
                  {plan.features.map((feature, i) => (
                    <li key={i}>✔ {feature}</li>
                  ))}
                </ul>
                <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                  Choose Plan
                </button>
                {plan.popular && (
                  <span className="block mt-3 text-sm text-blue-500 font-semibold">
                    Most Popular
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-600 py-8">
        <div className="max-w-7xl mx-auto px-4 ">
          <h2 className="text-3xl text-center font-bold text-white mb-4">
            Pricing Plan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
            {plans.map((plan, index) => (
              <div
                className={` bg-white text-center rounded shadow-md py-8 ${
                  plan.popular ? "border-4 border-blue-500" : ""
                }`}
              >
                <h3 className="text-center font-bold text-2xl mb-2">
                  {plan.name}
                </h3>
                <p className="text-blue-600 text-3xl font-bold  mb-4">
                  {plan.price}
                </p>

                <ul className="mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="mb-2">
                      ✔{feature}
                    </li>
                  ))}
                </ul>
                <button className="rounded bg-blue-500 px-4 py-2 text-white ">
                  Choose Plan
                </button>
                {plan.popular ? (
                  <span className="block mt-4 text-2xl font-semibold text-blue-400 ">
                    Most Popular
                  </span>
                ) : (
                  ""
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
