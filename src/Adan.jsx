import React, { useState, useEffect } from 'react';
import './Adan.css';
import fajr from './images/fajr.png';
import Timer from './componants/Timer';
import adan from './adan.mp3';

function Adan() {

    const [city, setCity] = useState("Rabat");
    const [dataPray, setDataPray] = useState();
    const [audioPlay, setAudioPlay] = useState(false);
    const [clickpage, setClickpage] = useState(false);
    const [time, setTime] = useState(new Date());

    // const [currenttime, setCurrenttime] = useState('16:48');
    setInterval(() => {
        setTime(new Date());
    }, 1000);



    const today = new Date();
    useEffect(() => {
        const formattedDate = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;

        fetch(`https://api.aladhan.com/v1/timingsByCity/${formattedDate}?city=${city}&country=Morocco&method=3`)
            .then((response) => response.json())
            .then((data) => setDataPray(data.data.timings));
    }, [city]);

    const checkPrayerTime = (prayerTime) => {
        const currentTime = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;
        return currentTime === prayerTime;
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
        const prayers = dataPray ? {
            "الفجر": dataPray.Fajr,
            "الظهر": dataPray.Dhuhr,
            "العصر": dataPray.Asr,
            "المغرب": dataPray.Maghrib,
            "العشاء": dataPray.Isha
        } : {};

        const sortPreys = Object.entries(prayers).sort((a, b) => a[1].localeCompare(b[1]));
        for (let [name, prayTime] of sortPreys) {
            if (currenttime < prayTime) {
                return `${name} - ${prayTime}`;

            }
        }
    }

    return (
        <div className="Adan">
            <div className='container'>
                <div className="header">

                    <div className="date">
                        <h1>{time.toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</h1>
                    </div>
                    <div className="time">
                        {clickpage ? <i class="fas fa-volume-up"></i> : <i class="fas fa-volume-mute"></i>}

                        <h1>
                            {time.getSeconds().toString().padStart(2, '0')} :
                            {time.getMinutes().toString().padStart(2, '0')} :
                            {time.getHours().toString().padStart(2, '0')}
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
                        <div className="card">
                            <img src={fajr} alt="" />
                            <div className="info">
                                <h1>الفجر</h1>
                                <h3>{dataPray ? dataPray.Fajr : 'جاري التحميل...'}</h3>
                            </div>
                        </div>
                        <div className="card">
                            <img src={fajr} alt="" />
                            <div className="info">
                                <h1>الظهر</h1>
                                <h3>{dataPray ? dataPray.Dhuhr : 'جاري التحميل...'}</h3>
                            </div>
                        </div>
                        <div className="card">
                            <img src={fajr} alt="" />
                            <div className="info">
                                <h1>العصر</h1>
                                <h3>{dataPray ? dataPray.Asr : 'جاري التحميل...'}</h3>
                            </div>
                        </div>
                        <div className="card">
                            <img src={fajr} alt="" />
                            <div className="info">
                                <h1>المغرب</h1>
                                <h3>{dataPray ? dataPray.Maghrib : 'جاري التحميل...'}</h3>
                            </div>
                        </div>
                        <div className="card">
                            <img src={fajr} alt="" />
                            <div className="info">
                                <h1>العشاء</h1>
                                <h3>{dataPray ? dataPray.Isha : 'جاري التحميل...'}</h3>
                            </div>
                        </div>
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
