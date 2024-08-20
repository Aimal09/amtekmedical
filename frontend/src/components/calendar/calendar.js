import React, { useEffect, useState } from "react";
import './calendar.css'
import Day from "./day";

export default function Calendar({ schedules }) {
    return (
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
            {schedules && schedules.map(schedule => (<Day key={schedule.date} date={schedule.date} schedules={schedule} />))}
        </div>
    );
}