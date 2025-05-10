const cards = [
  {
    title: "Fast Development",
    description:
      "Use modern tools and frameworks to build applications in less time.",
    icon: "⚡",
  },
  {
    title: "Responsive Design",
    description: "Design once, run anywhere — optimized for all screen sizes.",
    icon: "📱",
  },
  {
    title: "Secure by Default",
    description:
      "Security-first architecture with industry-standard practices.",
    icon: "🔒",
  },
];

export default function CardList() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300"
            >
              <div className="text-4xl mb-4">{card.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {card.title}
              </h3>
              <p className="text-gray-600">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
