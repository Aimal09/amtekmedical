import React from "react";
import './calendar.css'

export default function Day({date, schedules}){
    return(
        <div className="day cal-col">
            <div>{date}</div>
            <div><p style={{'--value':schedules['0']?.startValue + '%', '--endValue': schedules['0']?.endValue + '%'}}>{schedules && schedules['0']?.title}</p></div>
            <div><p style={{'--value':schedules['1']?.startValue + '%', '--endValue': schedules['1']?.endValue + '%'}}>{schedules && schedules['1']?.title}</p></div>
            <div><p style={{'--value':schedules['2']?.startValue + '%', '--endValue': schedules['2']?.endValue + '%'}}>{schedules && schedules['2']?.title}</p></div>
            <div><p style={{'--value':schedules['3']?.startValue + '%', '--endValue': schedules['3']?.endValue + '%'}}>{schedules && schedules['3']?.title}</p></div>
            <div><p style={{'--value':schedules['4']?.startValue + '%', '--endValue': schedules['4']?.endValue + '%'}}>{schedules && schedules['4']?.title}</p></div>
            <div><p style={{'--value':schedules['5']?.startValue + '%', '--endValue': schedules['5']?.endValue + '%'}}>{schedules && schedules['5']?.title}</p></div>
            <div><p style={{'--value':schedules['6']?.startValue + '%', '--endValue': schedules['6']?.endValue + '%'}}>{schedules && schedules['6']?.title}</p></div>
            <div><p style={{'--value':schedules['7']?.startValue + '%', '--endValue': schedules['7']?.endValue + '%'}}>{schedules && schedules['7']?.title}</p></div>
            <div><p style={{'--value':schedules['8']?.startValue + '%', '--endValue': schedules['8']?.endValue + '%'}}>{schedules && schedules['8']?.title}</p></div>
            <div><p style={{'--value':schedules['9']?.startValue + '%', '--endValue': schedules['9']?.endValue + '%'}}>{schedules && schedules['9']?.title}</p></div>
            <div><p style={{'--value':schedules['10']?.startValue + '%', '--endValue': schedules['10']?.endValue + '%'}}>{schedules && schedules['10']?.title}</p></div>
            <div><p style={{'--value':schedules['11']?.startValue + '%', '--endValue': schedules['11']?.endValue + '%'}}>{schedules && schedules['11']?.title}</p></div>
            <div><p style={{'--value':schedules['12']?.startValue + '%', '--endValue': schedules['12']?.endValue + '%'}}>{schedules && schedules['12']?.title}</p></div>
            <div><p style={{'--value':schedules['13']?.startValue + '%', '--endValue': schedules['13']?.endValue + '%'}}>{schedules && schedules['13']?.title}</p></div>
            <div><p style={{'--value':schedules['14']?.startValue + '%', '--endValue': schedules['14']?.endValue + '%'}}>{schedules && schedules['14']?.title}</p></div>
            <div><p style={{'--value':schedules['15']?.startValue + '%', '--endValue': schedules['15']?.endValue + '%'}}>{schedules && schedules['15']?.title}</p></div>
            <div><p style={{'--value':schedules['16']?.startValue + '%', '--endValue': schedules['16']?.endValue + '%'}}>{schedules && schedules['16']?.title}</p></div>
            <div><p style={{'--value':schedules['17']?.startValue + '%', '--endValue': schedules['17']?.endValue + '%'}}>{schedules && schedules['17']?.title}</p></div>
            <div><p style={{'--value':schedules['18']?.startValue + '%', '--endValue': schedules['18']?.endValue + '%'}}>{schedules && schedules['18']?.title}</p></div>
            <div><p style={{'--value':schedules['19']?.startValue + '%', '--endValue': schedules['19']?.endValue + '%'}}>{schedules && schedules['19']?.title}</p></div>
            <div><p style={{'--value':schedules['20']?.startValue + '%', '--endValue': schedules['20']?.endValue + '%'}}>{schedules && schedules['20']?.title}</p></div>
            <div><p style={{'--value':schedules['21']?.startValue + '%', '--endValue': schedules['21']?.endValue + '%'}}>{schedules && schedules['21']?.title}</p></div>
            <div><p style={{'--value':schedules['22']?.startValue + '%', '--endValue': schedules['22']?.endValue + '%'}}>{schedules && schedules['22']?.title}</p></div>
            <div><p style={{'--value':schedules['23']?.startValue + '%', '--endValue': schedules['23']?.endValue + '%'}}>{schedules && schedules['23']?.title}</p></div>
        </div>
    );
}