export default function HeroSection() {
  return (
    <>
      <section className="bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col-reverse md:flex-row items-center gap-10">
          {/* Text Section */}
          <div className="text-center md:text-left md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Build Stunning Websites Faster
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Supercharge your development workflow with our fast and intuitive
              tools built for modern devs.
            </p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition">
              Get Started
            </button>
          </div>

          {/* Image Section */}
          <div className="md:w-1/2">
            <img
              src="https://illustrations.popsy.co/gray/web-design.svg"
              alt="Hero Illustration"
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-20">
        <div
          className="max-w-7xl mx-auto px-4 flex flex-col-reverse md:flex-row items-center gap-10
        "
        >
          <div className="text-center md:text-left md:w-1/2 ">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Build Stunning Websites Faster
            </h1>
            <p className="text-lg  text-gray-600 mb-4">
              Supercharge your development workflow with our fast and intuitive
              tools built for modern devs.
            </p>
            <button className="bg-blue-600 px-6 py-3 rounded-2xl text-lg text-white">
              Get Started
            </button>
          </div>
          <div className="md:w-1/2">
            <img
              src="https://illustrations.popsy.co/gray/web-design.svg"
              alt="Hero"
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>
    </>
  );
}
