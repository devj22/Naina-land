import { Button } from "@/components/ui/button";

const ParallaxSection = () => {
  return (
    <section 
      className="py-24 bg-fixed bg-center bg-no-repeat bg-cover" 
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80')`
      }}
    >
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
        Why Choose Nainaland Deals?

        </h2>
        <p className="text-white text-lg max-w-3xl mx-auto mb-12">
        Over 20 Years of Industry Experience.

        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white bg-opacity-10 backdrop-blur-sm p-8 rounded-lg border border-white border-opacity-20">
            <div className="text-[#FF6B35] text-4xl mb-4">
              <i className="fas fa-chart-line"></i>
            </div>
            <h3 className="text-white text-xl font-semibold mb-3">Consistent Appreciation</h3>
            <p className="text-white opacity-90">
            Land in Panvel, Khalapur, and Karjat has shown steady growth over the years—making it a smart choice for long-term wealth creation and secure investment returns.
            </p>
          </div>
          
          <div className="bg-white bg-opacity-10 backdrop-blur-sm p-8 rounded-lg border border-white border-opacity-20">
            <div className="text-[#FF6B35] text-4xl mb-4">
              <i className="fas fa-shield-alt"></i>
            </div>
            <h3 className="text-white text-xl font-semibold mb-3">Limited & Valuable</h3>
            <p className="text-white opacity-90">
            With land becoming increasingly scarce in these rapidly developing areas, owning a plot today means holding a valuable asset for tomorrow.
            </p>
          </div>
          
          <div className="bg-white bg-opacity-10 backdrop-blur-sm p-8 rounded-lg border border-white border-opacity-20">
            <div className="text-[#FF6B35] text-4xl mb-4">
              <i className="fas fa-home"></i>
            </div>
            <h3 className="text-white text-xl font-semibold mb-3">Multiple Possibilities</h3>
            <p className="text-white opacity-90">
            Whether you're planning to build a dream home, start a business, or simply grow your portfolio—our curated plots offer unmatched flexibility and potential.
            </p>
          </div>
        </div>
        
        <div className="mt-12">
          <a href="#contact">
            <Button className="inline-block bg-[#FF6B35] text-white py-3 px-8 rounded-md hover:bg-opacity-90 transition">
              Speak to an Investment Advisor
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ParallaxSection;
