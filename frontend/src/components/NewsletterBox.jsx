import React from 'react';

const NewsletterBox = () => {
  const onSubmitHandler = (event) => {
    event.preventDefault();
    // Add your newsletter integration here.
  };

  return (
    <section className="py-14 px-4 bg-gradient-to-br from-purple-400 via-purple-300 to-purple-200 rounded-[2.5rem] shadow-xl max-w-4xl mx-auto my-16 font-poppins border border-purple-200 relative overflow-hidden">
      {/* Optionally add decorative shapes here for extra effect */}
      <div className="text-center">
        <p className="text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight drop-shadow-lg">
          Get Listed Your Asset As A Owner
        </p>
        <p className="text-white text-base md:text-lg mb-8 opacity-90">
          Put your email address and get listed
        </p>
        <form
          onSubmit={onSubmitHandler}
          className="w-full max-w-xl mx-auto flex items-center gap-4 bg-white/30 rounded-2xl shadow-lg p-2 backdrop-blur-lg"
        >
          <input
            className="w-full flex-1 px-6 py-4 rounded-xl outline-none border-none text-base bg-transparent text-white placeholder-white/90 font-medium"
            type="email"
            placeholder="Enter your mail address"
            required
          />
          <button
            type="submit"
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold px-7 py-3 rounded-xl shadow transition-all duration-300 text-base"
            style={{ minWidth: 130 }}
          >
            Get Started
          </button>
        </form>
      </div>
      {/* Decorative geometric shapes */}
      <div className="absolute left-0 bottom-0 w-56 h-44 bg-white/10 rounded-[2rem] -z-1 blur-md" />
      <div className="absolute right-0 top-0 w-40 h-40 bg-white/10 rounded-[2rem] -z-1 blur-md" />
    </section>
  );
};

export default NewsletterBox;