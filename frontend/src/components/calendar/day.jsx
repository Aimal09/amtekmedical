// import React, { useEffect, useState } from "react";
// import "./calendar.css";
// import { useNavigate } from "react-router-dom";
// import CallApi from "../../callApi";

// export default function Day({ date, schedules }) {
//   const navigate = useNavigate();
//   const hours = [
//     0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
//     21, 22, 23,
//   ];
//     const [appoinmentId, setAppoinmentId] = useState();

//   const handleDaySelect = (id) => {
//     setAppoinmentId(id);
//     console.log("Selected appointment ID:", id);
//     navigate(`/schedule?id=${id}`);
//   };
//   const [formFilledMap, setFormFilledMap] = useState({});

// useEffect(() => {
//   const fetchAppointmentByAppointmentId = async () => {
//     let apiURL = `GetAppointmentByAppointmentId?appoinmentId=${appoinmentId}`;
//     try {
//       const data = await CallApi(apiURL);
//       if (data.length > 0) {
//         // setAppoinmentHistory(data);
//         setFormFilledMap((prev) => ({
//           ...prev,
//           [appoinmentId]: true,
//         }));
//       } else {
//         setFormFilledMap((prev) => ({
//           ...prev,
//           [appoinmentId]: false,
//         }));
//       }
//     } catch (error) {
//       console.error("Error fetching appointment data:", error);
//     }
//   };

//   if (appoinmentId) {
//     fetchAppointmentByAppointmentId();
//   }
// }, [appoinmentId]);

//   return (
//     <div className="day cal-col">
//       <div>{date}</div>
//       {hours.map((hour) => (
//         <div key={hour}>
//           {schedules &&
//             schedules[hour] &&
//             schedules[hour].map((s, i) => (
//               // <p
//               //   key={i}
//               //   style={{
//               //     "--value": s && s?.startTime + "%",
//               //     "--endTime": s && s?.endTime + "%",
//               //   }}
//               //   onClick={() => handleDaySelect(s.id)}
//               // >
//               //   {s && s?.title}
//               // </p>
//               <p
//   key={i}
//   style={{
//     "--value": s?.startTime + "%",
//     "--endTime": s?.endTime + "%",
//     backgroundColor: formFilledMap[s?.id] ? "red" : "blue",
//     color: "white",
//     padding: "2px 4px",
//     borderRadius: "4px",
//     cursor: "pointer",
//   }}
//   onClick={() => handleDaySelect(s.id)}
// >
//   {s?.title}
// </p>

//             ))}
//         </div>
//       ))}
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import "./calendar.css";
import { useNavigate } from "react-router-dom";
import CallApi from "../../callApi";

export default function Day({ date, schedules }) {
  const navigate = useNavigate();
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const [formFilledMap, setFormFilledMap] = useState({});

  // 🔄 Fetch once for all appointment IDs in this day
  // useEffect(() => {
  //   const fetchFormFilledStatus = async () => {
  //     const allAppointmentIds = [];

  //     // Collect all unique appointment IDs from schedules
  //     for (const hour of hours) {
  //       if (schedules[hour]) {
  //         schedules[hour].forEach((s) => {
  //           if (s?.id) allAppointmentIds.push(s.id);
  //         });
  //       }
  //     }

  //     // Remove duplicates
  //     const uniqueIds = [...new Set(allAppointmentIds)];

  //     // Fetch status for each appointment
  //     const statusMap = {};
  //     for (const id of uniqueIds) {
  //       try {
  //         const data = await CallApi(
  //           `GetAppointmentByAppointmentId?appoinmentId=${id}`
  //         );
  //         statusMap[id] = data.length > 0;
  //       } catch (error) {
  //         console.error(`Error fetching appointment ${id}:`, error);
  //         statusMap[id] = false;
  //       }
  //     }

  //     setFormFilledMap(statusMap);
  //   };

  //   if (schedules) {
  //     fetchFormFilledStatus();
  //   }
  // }, [schedules]);

  const handleDaySelect = (id) => {
    navigate(`/schedule?id=${id}`);
  };

  return (
    <div className="day cal-col">
      <div>{date}</div>
      {hours.map((hour) => (
        <div key={hour}>
          {schedules[hour] &&
            schedules[hour].map((s, i) => (
              <p
                key={i}
                style={{
                  "--value": s?.startTime + "%",
                  "--endTime": s?.endTime + "%",
                  "background-image": s.isViewd
                    ? "repeating-linear-gradient(45deg, #7775 0px, #7775 5px, #fff5 6px, #fff5 10px)"
                    : "blue",
                }}
                onClick={() => handleDaySelect(s.id)}
              >
                {s?.title}

              </p>
            ))}
        </div>
      ))}
    </div>
  );
}
