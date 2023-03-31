// import React from "react";
// import ChatBox from "./ChatBox";
// import ChatList from "./ChatList";
// import Person from "../images/user.svg"
// import "./Test.css";
// import { maxHeight } from "@mui/system";

// // import VideoTile from './VideoTile';
// // import './Meeting.css';

// const participants = [
//   { i: 'tile-1', x: 0, y: 0, w: 1, h: 1 },
//   { i: 'tile-4', x: 1, y: 1, w: 1, h: 1 },
//   { i: 'tile-4', x: 1, y: 1, w: 1, h: 1 },
//   { i: 'tile-4', x: 1, y: 1, w: 1, h: 1 },
//   { i: 'tile-4', x: 1, y: 1, w: 1, h: 1 }
// ];

// function Test() {
//   return (

//         <div className="grid-container">
//           {participants.map((participant) => (
//             <div className="grid-item">
//             <img src={Person} alt="Person"/>
//             </div>
//           ))}
//         </div>
//       );
//     };
    

// export default Test;

import { ImageGrid } from "react-fb-image-video-grid";

const Image = ({ count, images }) => {
  const pic = (c, i) => {
    return (
      <img
        style={{ objectFit: "cover" }}
        src={c}
        alt={i}
        key={Math.random(i)}
      />
    );
  };

  return (
    <>
      {count >= 2 ? (
        <ImageGrid>
          {images
            .filter((arg, i) => (i + 1 <= count ? true : false))
            .map((a) => pic(a))}
        </ImageGrid>
      ) : (
        <ImageGrid>{pic(images[0])}</ImageGrid>
      )}
    </>
  );
};

export default Image;
