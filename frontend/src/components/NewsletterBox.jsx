import React from 'react';

const NewsletterBox = () => {
  const onSubmitHandler = (event) => {
    event.preventDefault();
    // Add your newsletter integration here.
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-[#ece9f6] via-[#f6f7fb] to-[#e6e0fa] rounded-3xl shadow-2xl max-w-2xl mx-auto my-16 font-poppins border border-[#ded7fc]">
      <div className="text-center">
        <p className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#8E7BEF] to-[#A084E8] mb-2 tracking-tight drop-shadow">
          Subscribe &amp; Enjoy 20% Off
        </p>
        <p className="text-[#5c548c] text-base md:text-lg mb-8">
          Be the first to receive exclusive real estate deals, market insights, and luxury listings.
        </p>
        <form
          onSubmit={onSubmitHandler}
          className="w-full max-w-lg mx-auto flex flex-col sm:flex-row items-center gap-3 bg-white bg-opacity-80 rounded-xl shadow-lg p-2 border border-[#eae6fb] backdrop-blur"
        >
          <input
            className="w-full flex-1 px-5 py-3 rounded-lg outline-none border-none text-base bg-transparent placeholder-[#8E7BEF] font-medium"
            type="email"
            placeholder="Enter your email"
            required
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-[#8E7BEF] to-[#A084E8] hover:from-[#A084E8] hover:to-[#8E7BEF] text-white font-bold px-8 py-3 rounded-lg shadow transition-all duration-300 uppercase tracking-wider"
          >
            Subscribe
          </button>
        </form>
        <div className="mt-4 text-xs text-[#8E7BEF] italic">
          We respect your privacy. Unsubscribe anytime.
        </div>
      </div>
    </section>
  );
};

export default NewsletterBox;