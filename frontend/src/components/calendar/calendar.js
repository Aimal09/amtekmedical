import React from "react";
import './calendar.css'
import Day from "./day";

export default function Calendar(){
    let schedules = [
        {date:'01','0':{title:'Dr: Aimal',startValue:0,endValue:75},'3':{title:'',startValue:0,endValue:0}},
        {date:'02','1':{title:'Dr: Aimal',startValue:0,endValue:75},'2':{title:'Dr: Humayl',startValue:50,endValue:150},'3':{title:'Dr: Humayl',startValue:0,endValue:75}},
        {date:'03','3':{title:'Dr: Aimal',startValue:0,endValue:75},'3':{title:'',startValue:0,endValue:0}},
        {date:'04'},
        {date:'05'},
        {date:'06'},
        {date:'07'}
    ];
    return(
        <div className="appointment-calendar">
            <div className="tools">
                <div></div>
                <div className="datePicker">

                </div>
                <div className="doctors">
                    <p>Filter Docters</p>
                </div>
            </div>

            <div className="calendar weekview d-flex">
                <div className="hours cal-col">
                    <div><p></p></div>
                    <div><p>12:00</p></div>
                    <div><p>01:00</p></div>
                    <div><p>02:00</p></div>
                    <div><p>03:00</p></div>
                    <div><p>04:00</p></div>
                    <div><p>05:00</p></div>
                    <div><p>06:00</p></div>
                    <div><p>07:00</p></div>
                    <div><p>08:00</p></div>
                    <div><p>09:00</p></div>
                    <div><p>10:00</p></div>
                    <div><p>11:00</p></div>
                    <div><p>12:00</p></div>
                    <div><p>13:00</p></div>
                    <div><p>14:00</p></div>
                    <div><p>15:00</p></div>
                    <div><p>16:00</p></div>
                    <div><p>17:00</p></div>
                    <div><p>18:00</p></div>
                    <div><p>19:00</p></div>
                    <div><p>20:00</p></div>
                    <div><p>21:00</p></div>
                    <div><p>22:00</p></div>
                    <div><p>23:00</p></div>
                </div>
                {schedules.map(schedule=>{
                    return (<Day date={schedule.date} schedules={schedule}/>)
                })}
                {/* <Day date="01" schedules={1}/>
                <Day date="02" schedules={{'2':{title:'asdsd',startValue:25,endValue:125}}}/>
                <Day date="03" schedules={{'1':{title:'asdsd',startValue:25,endValue:125}}}/>
                <Day date="04" schedules={{'0':{title:'asdsd',startValue:25,endValue:125}}}/>
                <Day date="05" schedules={{'0':{title:'asdsd',startValue:25,endValue:125}}}/>
                <Day date="06" schedules={{'0':{title:'asdsd',startValue:25,endValue:125}}}/>
                <Day date="07" schedules={{'0':{title:'asdsd',startValue:25,endValue:125}}}/>
                <Day date="08" schedules={{'0':{title:'asdsd',startValue:25,endValue:125}}}/>
                <Day date="09" schedules={{'0':{title:'asdsd',startValue:25,endValue:125}}}/> */}
            </div>
        </div>
    );
}