type CardProps = {
  title: string;
  description: string;
  imageUrl: string;
};

const cardData: CardProps[] = [
  {
    title: "Service One",
    description: "Short description of the service or product offered.",
    imageUrl:
      "https://images.unsplash.com/photo-1746469471553-afa9f34157fd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Service Two",
    description: "Short description of the service or product offered.",
    imageUrl:
      "https://images.unsplash.com/photo-1746591948888-7cc1e170c17b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Service Three",
    description: "Short description of the service or product offered.",
    imageUrl:
      "https://images.unsplash.com/photo-1743359610666-8d33497f6b70?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw5fHx8ZW58MHx8fHx8",
  },
];

export default function CardGrid() {
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
          Our Services
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cardData.map((card, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={card.imageUrl}
                alt={card.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                <p className="text-gray-600 mb-4">{card.description}</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center"></h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cardData.map((card, index) => {
            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md hover:shadow-xl overflow-hidden transition-shadow duration-300"
              >
                <img
                  src={card.imageUrl}
                  alt={card.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                  <p className="text-gray-600 mb-4">{card.description}</p>
                  <button className="bg-blue-600 rounded text-white px-4 py-2 hover:bg-blue-800">
                    Get mork,..
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
