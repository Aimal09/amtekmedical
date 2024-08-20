import React from "react";
import './calendar.css'

export default function Day({ date, schedules }) {
    const hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
    return (
        <div className="day cal-col">
            <div>{date}</div>
            {hours.map(hour =>
                <div key={hour}>
                    {(schedules && schedules[hour]) && schedules[hour].map((s, i) =>
                        <p key={i} style={{ '--value': s && s?.startTime + '%', '--endTime': s && s?.endTime + '%' }}>{s && s?.title}</p>
                    )}
                </div>
            )
            }
        </div>
    );
}