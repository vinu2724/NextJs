const stats = [
  { label: "Users", value: "25K+" },
  { label: "Downloads", value: "1M+" },
  { label: "Reviews", value: "4.8★" },
  { label: "Countries", value: "120+" },
];

export default function StatsGrid() {
  return (
    <>
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Our Impact</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="p-6 rounded-lg shadow-sm bg-gray-100 hover:shadow-md transition"
              >
                <p className="text-4xl font-bold text-blue-600">{stat.value}</p>
                <p className="text-gray-600 mt-2 text-lg">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-2 text-center ">
          <h2 className="text-3xl font-bold mb-8">Our Impact</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className=" p-6 bg-gray-100 rounded-2xl">
                <h1 className="text-blue-600 text-2xl font-bold  md:text-4xl mb-3 ">
                  {stat.value}
                </h1>
                <p className="text-lg text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
