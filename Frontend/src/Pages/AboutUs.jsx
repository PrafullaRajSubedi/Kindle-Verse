import React from 'react';

const AboutUs = () => {
  return (
    <div className="font-sans text-gray-800">
      {/* Hero Banner */}
      <div className="bg-blue-50 py-12 text-center">
        <h1 className="text-4xl font-bold text-blue-900">About KindleVerse</h1>
        <p className="text-gray-600 mt-3 max-w-xl mx-auto">
          Discover our mission, values, and the journey behind the KindleVerse platform.
        </p>
      </div>

      {/* Mission Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-3">
              At KindleVerse, our mission is to ignite a passion for reading by connecting readers
              with stories that inspire, educate, and entertain. We believe every book is a gateway
              to knowledge and creativity — and we strive to make that gateway accessible to all.
            </p>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer eget lacus nec justo
              ultricies tincidunt. Curabitur rutrum, augue vel vulputate dapibus, metus purus mattis
              felis, a facilisis nulla orci vitae enim.
            </p>
          </div>
          <div className="md:w-1/2">
            <img src="https://picsum.photos/400/300" alt="Our Mission" className="rounded-lg shadow-lg w-full object-cover h-80" />
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="bg-blue-100 py-16">
        <div className="container mx-auto px-6 md:px-12 flex flex-col-reverse md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <img src="https://picsum.photos/id/237/400/300" alt="Our Story" className="rounded-lg shadow-lg w-full object-cover h-80" />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Our Story</h2>
            <p className="text-gray-700 mb-3">
              Started by a group of book lovers in 2025, KindleVerse began as a college project and grew into a
              full-featured book discovery and purchasing platform. Our journey reflects our love for innovation,
              storytelling, and community.
            </p>
            <p className="text-gray-600">
              Donec accumsan sem nec risus sagittis, nec dignissim neque vestibulum. Pellentesque habitant morbi
              tristique senectus et netus et malesuada fames ac turpis egestas.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <h2 className="text-3xl font-bold text-blue-900 mb-8">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {['Accessibility', 'Community', 'Innovation'].map((title, idx) => (
              <div key={idx} className="p-6 bg-blue-50 rounded-lg shadow-md">
                <img src="../../Images/Bookcover.jpg" alt={title} className="rounded-lg shadow-lg w-full object-cover h-80 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-sm text-gray-700">
                  {title === 'Accessibility' && 'We ensure books are accessible to all readers, regardless of background.'}
                  {title === 'Community' && 'We empower readers and authors to build lasting connections.'}
                  {title === 'Innovation' && 'We use modern tools to enhance reading, learning, and discovering books.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
