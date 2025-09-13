import React, { useState, useEffect } from 'react';
import './Adan.css';
import fajr from './images/fajr.png';
import adan from './adan.mp3';

function Adan() {

    const [city, setCity] = useState("Rabat");
    const [dataPray, setDataPray] = useState();
    const [audioPlay, setAudioPlay] = useState(false);
    const [clickpage, setClickpage] = useState(false);
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const today = new Date();
        const formattedDate = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
        fetch(`https://api.aladhan.com/v1/timingsByCity/${formattedDate}?city=${city}&country=Morocco&method=3`)
            .then((response) => response.json())
            .then((data) => setDataPray(data.data.timings));
    }, [city]);

    const checkPrayerTime = (prayerTime) => {
        const currenttime = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;
        return currenttime === prayerTime;
    };

    const playAudio = () => {
        if (!audioPlay) {
            const audio = new Audio(adan);
            audio.play();
            setAudioPlay(true);
        }
    };

    useEffect(() => {
        const startAudio = () => {
            if (!audioPlay) {
                setClickpage(true);
            }
        };
        document.addEventListener('click', startAudio);
        return () => {
            document.removeEventListener('click', startAudio);
        };
    }, [audioPlay]);

    useEffect(() => {
        if (clickpage && dataPray) {
            if (checkPrayerTime(dataPray.Fajr) || checkPrayerTime(dataPray.Dhuhr) ||
                checkPrayerTime(dataPray.Asr) || checkPrayerTime(dataPray.Maghrib) ||
                checkPrayerTime(dataPray.Isha)) {
                playAudio();
            }
        }
    }, [dataPray, clickpage]);

    const hindsubmit = (e) => {
        e.preventDefault();
        const data = e.target[0].value;
        const formattedData = data.charAt(0).toUpperCase() + data.slice(1).toLowerCase();
        setCity(formattedData);
    };

    const NextPrey = () => {
        if (!dataPray) return 'جاري التحميل...';

        const prayers = {
            "الفجر": dataPray.Fajr,
            "الظهر": dataPray.Dhuhr,
            "العصر": dataPray.Asr,
            "المغرب": dataPray.Maghrib,
            "العشاء": dataPray.Isha
        };

        const sortPreys = Object.entries(prayers).sort((a, b) => a[1].localeCompare(b[1]));
        const currenttime = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;

        for (let [name, prayTime] of sortPreys) {
            if (currenttime < prayTime) {
                return `${name} - ${prayTime}`;
            }
        }
        return "انتهت صلوات اليوم";
    }

    return (
        <div className="Adan">
            <div className='container'>
                <div className="header">
                    <div className="date">
                        <h1>{time.toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</h1>
                    </div>
                    <div className="time">
                        {clickpage ? <i className="fas fa-volume-up"></i> : <i className="fas fa-volume-mute"></i>}
                        <h1>
                            {time.getHours().toString().padStart(2, '0')} :
                            {time.getMinutes().toString().padStart(2, '0')} :
                            {time.getSeconds().toString().padStart(2, '0')}
                        </h1>
                    </div>
                </div>

                <div className="content">
                    <h1 className='title'>{city} مواقيت الصلاة</h1>
                    <form onSubmit={hindsubmit}>
                        <input type="text" placeholder="ابحث عن مدينة" />
                        <button type='submit'>بحث</button>
                    </form>

                    <div className="pray-times">
                        {["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].map((pray, index) => (
                            <div className="card" key={index}>
                                <img src={fajr} alt="" />
                                <div className="info">
                                    <h1>{["الفجر", "الظهر", "العصر", "المغرب", "العشاء"][index]}</h1>
                                    <h3>{dataPray ? dataPray[pray] : 'جاري التحميل...'}</h3>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pray-kadima">
                        <div className="box">
                            <h1>الصلاة القادمة</h1>
                            <h3>{NextPrey()}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Adan;
