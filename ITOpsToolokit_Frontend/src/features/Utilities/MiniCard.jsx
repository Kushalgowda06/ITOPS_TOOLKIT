import React, { useState, useEffect } from 'react';
import { CardActionArea } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

const MiniCard = ({ images, imgClasses = ['h-75 w-75'], counts, CardContentClass, TotalCost }) => {
  const [animatedCounts, setAnimatedCounts] = useState({
    totalInstances: 0,
    running: 0,
    stopped: 0
  });

  useEffect(() => {
    let interval;
    if (!counts) {
      interval = setInterval(() => {
        setAnimatedCounts({
          totalInstances: Math.floor(Math.random() * 1000),
          running: Math.floor(Math.random() * 1000),
          stopped: Math.floor(Math.random() * 1000)
        });
      }, 50);
    } else {
      clearInterval(interval);
      setAnimatedCounts({
        totalInstances: counts.totalInstances,
        running: counts.running,
        stopped: counts.stopped
      });
    }

    return () => clearInterval(interval);
  }, [counts]);

  return (
    <div className="w-100 pe-2">
        <Card  className={`${CardContentClass} border-5 `}>
          <CardActionArea>
            <CardContent>
              <div className='row'>
                <div className='col-4'>
                  <div className="d-flex flex-wrap justify-content-center align-items-center">
                    {images.map((imageSrc, index) => (
                      <img key={index} src={imageSrc} className={`${imgClasses} cloud-logo-shadow image-responsive`} alt={`imageSrc ${index + 1}`} />
                    ))}
                  </div>
                </div>
                <div className="col-8 border-primary border-start padding-bottom border-2 pt-1 ps-3">
                  <span className='text-primary f-size fw-bold d-block pb-1'>
                    Total Instances : {animatedCounts.totalInstances}
                  </span>
                  <span className='text-success f-size fw-bold d-block pb-1'>
                    Running : {animatedCounts.running}
                  </span>
                  <span className='text-danger f-size fw-bold d-block pb-1'>
                    Stopped : {animatedCounts.stopped}
                  </span>
                  <span className='text-color f-size fw-bold d-block pb-1'>
                    Total Cost : {`$ ${TotalCost}`}
                  </span>
                </div>
              </div>
            </CardContent>
          </CardActionArea>
        </Card>
      </div>
  );
};

export default MiniCard;



// import React from 'react';
// import { CardActionArea } from "@mui/material";
// import Card from "@mui/material/Card";
// import CardContent from "@mui/material/CardContent";
// import Typography from "@mui/material/Typography";

// const MiniCard = ({images, imgClasses=['h-75 w-75'],counts}) => {

//     console.log("counts from mini : ",counts)
//   return (
//     <div className="w-100 pe-2">
//       <div>
//         <Card sx={{ maxWidth: 345, minHeight: 110 }}>
//           <CardActionArea>
//             <CardContent>
//             {/* <small className="text-center fw-bold">Total Instances</small> */}
//               <div className='row'>
//                 <div className='col-4'>
//                   <div className="d-flex flex-wrap justify-content-center align-items-center">
//                     {images.map((imageSrc, index) => (
//                       <img key={index} src={imageSrc} className={`${imgClasses} cloud-logo-shadow`} alt={`imageSrc ${index + 1}`} />
//                     ))}
//                   </div>
//                 </div>
//                 <div className="col-8">
//                     <span className='text-primary f-size fw-bold d-block pb-1'>Total Instances : {counts ?  counts.totalInstances : 0}</span>
//                     <span className='text-success f-size fw-bold d-block pb-1'>Running : {counts ?  counts.running : 0} </span>
//                     <span className='text-danger f-size fw-bold d-block pb-1'>Stopped : {counts ?  counts.stopped : 0} </span>
//                 </div>
//               </div>
//             </CardContent>
//           </CardActionArea>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default MiniCard;
