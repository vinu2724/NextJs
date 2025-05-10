const testimonials = [
  {
    name: "Amit Sharma",
    title: "CEO at TechCo",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    quote:
      "This service transformed our business. The support is top-notch and the results are phenomenal.",
  },
  {
    name: "Neha Kapoor",
    title: "Product Manager at DevStudio",
    image: "https://randomuser.me/api/portraits/women/45.jpg",
    quote:
      "Excellent experience! I’d recommend this to anyone looking for fast, reliable solutions.",
  },
  {
    name: "Rahul Verma",
    title: "Freelancer",
    image: "https://randomuser.me/api/portraits/men/65.jpg",
    quote:
      "It helped me scale my freelance work. The dashboard is clean and intuitive.",
  },
];

export default function Testimonials() {
  return (
    <>
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="border rounded-lg shadow-md p-6 bg-gray-50 hover:shadow-lg transition"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.title}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center font-bold text-3xl mb-4">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 ">
            {testimonials.map((person, index) => (
              <div
                key={index}
                className="bg-gray border border-black p-6 rounded flex flex-col"
              >
                <div className="flex space-x-4 ">
                  <img
                    src={person.image}
                    alt={person.name}
                    className="rounded-full w-12 h-12"
                  />
                  <div className="flex flex-col ">
                    <p className="font-bold">{person.name}</p>
                    <p className="text-gray-500 text-sm">{person.title}</p>
                  </div>
                </div>
                <p className="text-gray-800 italic mt-4 p-2">
                  {" "}
                  "{person.quote}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
