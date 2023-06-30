// import React, { useState } from 'react';

// export default function Attendees () {

//     return (
//         <div className="carousel rounded-box w-3/5 mx-auto absolute bottom-6 left-0 right-0">
//         <div className="carousel-item m-4">
//           <img
//             src="https://www.purina.co.uk/sites/default/files/styles/square_medium_440x440/public/2022-06/Bengal-Cat.jpg?itok=-n4U6Hsa"
//             alt="User1"
//             className="rounded-full w-24 h-24 object-cover"
//           />
//         </div>
//         <div className="carousel-item m-4">
//           <img
//             src="https://cdn.britannica.com/91/181391-050-1DA18304/cat-toes-paw-number-paws-tiger-tabby.jpg"
//             alt="User2"
//             className="rounded-full w-24 h-24 object-cover"
//           />
//         </div>
//         <div className="carousel-item m-4">
//           <img
//             src="https://images.unsplash.com/flagged/photo-1557427161-4701a0fa2f42?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8fA%3D%3D&w=1000&q=80"
//             alt="User2"
//             className="rounded-full w-24 h-24 object-cover"
//           />
//         </div>
//         <div className="carousel-item m-4">
//           <img
//             src="https://d3544la1u8djza.cloudfront.net/APHI/Blog/2022/02-11/gray+stripe+domestic+shortahair+tabby+cat+resting+in+a+maroon+cat+tree+bed-min.jpg"
//             alt="User3"
//             className="rounded-full w-24 h-24 object-cover"
//           />
//         </div>
//         <div className="carousel-item m-4">
//           <img
//             src="https://media.istockphoto.com/id/1361394182/photo/funny-british-shorthair-cat-portrait-looking-shocked-or-surprised.jpg?s=612x612&w=0&k=20&c=6yvVxdufrNvkmc50nCLCd8OFGhoJd6vPTNotl90L-vo="
//             alt="User4"
//             className="rounded-full w-24 h-24 object-cover"
//           />
//         </div>
//         <div className="carousel-item m-4">
//           <img
//             src="https://cnr.ncsu.edu/news/wp-content/uploads/sites/10/2019/07/07182019-leopard-tree-unsplash-facebook.jpg"
//             alt="User5"
//             className="rounded-full w-24 h-24 object-cover"
//           />
//         </div>
//         <div className="carousel-item m-4">
//           <img
//             src="https://www.comfortzone.com/-/media/Project/OneWeb/ComfortZone/Images/Blog/bringing-new-kitten-home.jpg"
//             alt="User6"
//             className="rounded-full w-24 h-24 object-cover"
//           />
//         </div>
//         <div className="carousel-item m-4">
//           <img
//             src="https://as2.ftcdn.net/v2/jpg/03/99/33/85/1000_F_399338584_CGn2KUHUzcxoFgyRr4MZWTNW81L61Sd4.jpg"
//             alt="User7"
//             className="rounded-full w-24 h-24 object-cover"
//           />
//         </div>
//       </div>

//     )
// }

import React, { useState } from 'react';

export default function Attendees() {
  const [activeIndex, setActiveIndex] = useState(0);
  const imagesPerSlide = 5;

  const attendees = [
    "https://www.purina.co.uk/sites/default/files/styles/square_medium_440x440/public/2022-06/Bengal-Cat.jpg?itok=-n4U6Hsa",
    "https://cdn.britannica.com/91/181391-050-1DA18304/cat-toes-paw-number-paws-tiger-tabby.jpg",
    "https://images.unsplash.com/flagged/photo-1557427161-4701a0fa2f42?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8fA%3D%3D&w=1000&q=80",
    "https://d3544la1u8djza.cloudfront.net/APHI/Blog/2022/02-11/gray+stripe+domestic+shortahair+tabby+cat+resting+in+a+maroon+cat+tree+bed-min.jpg",
    "https://media.istockphoto.com/id/1361394182/photo/funny-british-shorthair-cat-portrait-looking-shocked-or-surprised.jpg?s=612x612&w=0&k=20&c=6yvVxdufrNvkmc50nCLCd8OFGhoJd6vPTNotl90L-vo=",
    "https://cnr.ncsu.edu/news/wp-content/uploads/sites/10/2019/07/07182019-leopard-tree-unsplash-facebook.jpg",
    "https://www.comfortzone.com/-/media/Project/OneWeb/ComfortZone/Images/Blog/bringing-new-kitten-home.jpg",
    "https://as2.ftcdn.net/v2/jpg/03/99/33/85/1000_F_399338584_CGn2KUHUzcxoFgyRr4MZWTNW81L61Sd4.jpg"
  ];

  const handlePrevious = () => {
    setActiveIndex((prevIndex) => prevIndex > 0 ? prevIndex - 1 : 0);
  };

  const handleNext = () => {
    const lastIndex = Math.max(attendees.length - imagesPerSlide, 0);
    setActiveIndex((prevIndex) => prevIndex < lastIndex ? prevIndex + 1 : prevIndex);
  };

  const renderImages = () => {
    const startIndex = activeIndex;
    const endIndex = Math.min(startIndex + imagesPerSlide, attendees.length);
    const renderedImages = [];

    for (let i = startIndex; i < endIndex; i++) {
      renderedImages.push(
        <div key={i} className="carousel-item m-4">
          <img
            src={attendees[i]}
            alt={`User${i + 1}`}
            className="rounded-full w-24 h-24 object-cover"
          />
        </div>
      );
    }

    return renderedImages;
  };

  return (
    <div className="carousel carousel-center rounded-box w-3/5 mx-auto absolute bottom-6 left-0 right-0 flex justify-center">
      {activeIndex > 0 && (
        <button className="carousel-arrow left-arrow" onClick={handlePrevious}>
          <span className="carousel-arrow-icon text-4xl">&lt;</span>
        </button>
      )}

      {renderImages()}

      {activeIndex < attendees.length - imagesPerSlide && (
        <button className="carousel-arrow right-arrow" onClick={handleNext}>
          <span className="carousel-arrow-icon text-4xl">&gt;</span>
        </button>
      )}
    </div>
  );
}
