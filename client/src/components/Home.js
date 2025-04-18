// import React from "react";
// import "../css/Home.css";
// import FAQ from "./FAQ";

// const Home = () => {
//   return (
//     <div className="home-container">
//       <div className="home-card">
//         <h2>Welcome to Your Dashboard 🚀</h2>
//         <p>Your central hub for managing notes and user information.</p>

//         {/* Image Section */}
//         <img 
//         src="https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?w=800&q=80" 
//         alt="Dashboard" 
//         className="rounded-lg shadow-md w-full"
//         />
//         {/* FAQ Section */}
//         <FAQ />
//       </div>
//     </div>
//   );
// };

// export default Home;

import React from "react";


const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-4xl w-full text-center animate-fade-in">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome to Your Dashboard 🚀
        </h2>
        <p className="text-gray-600 mb-6 text-lg">
          Your central hub for managing notes and user information.
        </p>

        {/* Image Section */}
        <div className="overflow-hidden rounded-lg shadow-lg mb-8">
          <img
            src="https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?w=800&q=80"
            alt="Dashboard"
            className="w-full object-cover hover:scale-105 transition-transform duration-300 ease-in-out"
          />
        </div>

       
      </div>
    </div>
  );
};

export default Home;
