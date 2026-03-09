const AboutPortal = () => {
    return (
        <div className="animate-fadeIn">
            <div className="flex flex-col lg:flex-row gap-12">
                {/* Text Content */}
                <div className="flex-1">
                    <h1 className="text-red-600 font-black text-5xl mb-2 tracking-tight">ABOUT NETLEAP</h1>
                    <h2 className="text-slate-900 text-4xl font-semibold mb-6 leading-tight">Innovating Digital Future</h2>

                    <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                        At NetLeap, we are committed to delivering top-notch web solutions,
                        software development, and digital transformation services. With a
                        focus on creativity, technology, and innovation, we empower
                        businesses to leap ahead in the competitive digital landscape.
                    </p>

                    <ul className="space-y-3">
                        {['Cutting-edge Web Development', 'AI & Automation Integration', 'Scalable Cloud Solutions'].map((item) => (
                            <li key={item} className="flex items-center text-slate-800 font-medium text-lg">
                                <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Hero Image Section */}
                <div className="flex-1">
                    <img
                        src="/meeting-image.jpg"
                        alt="Corporate Training"
                        className="rounded-lg shadow-xl w-full object-cover h-80"
                    />
                </div>
            </div>

            {/* Secondary Graphics Row */}
            <div className="mt-16 flex items-center gap-12">
                <img src="/networking-graphic.png" alt="Hardware & Networking" className="h-40 object-contain" />
                <img src="/nits-logo-full.png" alt="NITS Training" className="h-24 object-contain" />
            </div>
        </div>
    );
};

export default AboutPortal;
