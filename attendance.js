import React, { useState, useEffect } from 'react';

const TimetableQRGenerator = () => {
    const [qrData, setQrData] = useState(null);
    const [countdown, setCountdown] = useState(15);
    const [selectedDay, setSelectedDay] = useState('Monday');
    const [selectedSlot, setSelectedSlot] = useState(0);

    // Timetable data structure
    const timetable = {
        Monday: [
            { start: '08:00', end: '08:50', code: 'MECH1011' },
            { start: '09:00', end: '09:50', code: 'MECH1011' },
            { start: '10:00', end: '10:50', code: '24CSEN1041' },
            { start: '11:00', end: '11:50', code: '24CSEN1041' },
            { start: '13:00', end: '13:50', code: 'MATH1272' },
            { start: '14:00', end: '14:50', code: 'LANG1252' },
            { start: '15:00', end: '15:50', code: 'LANG1252' }
        ],
        Tuesday: [
            { start: '08:00', end: '08:50', code: 'MECH1011' },
            { start: '09:00', end: '09:50', code: 'MECH1011' },
            { start: '10:00', end: '10:50', code: 'MATH1272' },
            { start: '11:00', end: '11:50', code: 'CHEM1111' },
            { start: '14:00', end: '14:50', code: '24CSEN1002' }
        ],
        Wednesday: [
            { start: '08:00', end: '08:50', code: 'MECH1041' },
            { start: '09:00', end: '09:50', code: 'MECH1041' },
            { start: '10:00', end: '10:50', code: '24CSEN1041' },
            { start: '11:00', end: '11:50', code: '24CSEN1041' },
            { start: '14:00', end: '14:50', code: 'LANG1252' },
            { start: '15:00', end: '15:50', code: 'LANG1252' }
        ],
        Thursday: [
            { start: '08:00', end: '08:50', code: 'MECH1041' },
            { start: '09:00', end: '09:50', code: 'MECH1041' },
            { start: '10:00', end: '10:50', code: 'CHEM1111' },
            { start: '11:00', end: '11:50', code: 'MATH1272' },
            { start: '14:00', end: '14:50', code: '24CSEN1002' }
        ],
        Friday: [
            { start: '08:00', end: '08:50', code: 'CHEM1111' },
            { start: '10:00', end: '10:50', code: '24CSEN1041' },
            { start: '11:00', end: '11:50', code: '24CSEN1041' },
            { start: '13:00', end: '13:50', code: 'MATH1272' },
            { start: '14:00', end: '14:50', code: 'CHEM111IP' },
            { start: '15:00', end: '15:50', code: 'CHEM111IP' }
        ]
    };

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    const generateRandomDate = () => {
        const start = new Date(2024, 0, 1);
        const end = new Date(2025, 11, 31);
        const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
        const randomDate = new Date(randomTime);
        
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const day = String(randomDate.getDate()).padStart(2, '0');
        const month = months[randomDate.getMonth()];
        const year = randomDate.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const generateRandomTimeWithSeconds = () => {
        const hours = Math.floor(Math.random() * 24);
        const minutes = Math.floor(Math.random() * 60);
        const seconds = Math.floor(Math.random() * 60);
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const addSecondsToTime = (timeStr, secondsToAdd) => {
        const [hours, minutes, seconds] = timeStr.split(':').map(Number);
        let totalSeconds = hours * 3600 + minutes * 60 + seconds + secondsToAdd;
        
        const newHours = Math.floor(totalSeconds / 3600) % 24;
        totalSeconds %= 3600;
        const newMinutes = Math.floor(totalSeconds / 60);
        const newSeconds = totalSeconds % 60;
        
        return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}:${String(newSeconds).padStart(2, '0')}`;
    };

    const generateRandomNumber = () => {
        return Math.floor(1000000 + Math.random() * 9000000);
    };

    const generateQR = () => {
        const currentSlot = timetable[selectedDay][selectedSlot];
        
        const randomDate = generateRandomDate();
        const qrStartTime = generateRandomTimeWithSeconds();
        const qrEndTime = addSecondsToTime(qrStartTime, 15);
        const randomNum = generateRandomNumber();

        const payload = `${currentSlot.code}#${currentSlot.start}#${currentSlot.end}#${randomNum}#${randomDate}#${qrStartTime}#${qrEndTime}`;
        
        const base64Payload = btoa(payload);

        setQrData({
            active: true,
            payload: payload,
            base64: base64Payload,
            subject: currentSlot.code,
            classTime: `${currentSlot.start} - ${currentSlot.end}`,
            day: selectedDay,
            randomDate: randomDate,
            qrStartTime: qrStartTime,
            qrEndTime: qrEndTime,
            randomNum: randomNum
        });
    };

    useEffect(() => {
        generateQR();
        const interval = setInterval(() => {
            generateQR();
            setCountdown(15);
        }, 15000);

        return () => clearInterval(interval);
    }, [selectedDay, selectedSlot]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) return 15;
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">
                            College Attendance QR Generator
                        </h1>
                        <p className="text-gray-600 mb-4">
                            Random Date & Time Generator (Timetable-Based)
                        </p>
                        <div className="mt-4 inline-block bg-indigo-100 px-6 py-2 rounded-full">
                            <p className="text-indigo-700 font-semibold">
                                Next refresh in: <span className="text-2xl">{countdown}</span>s
                            </p>
                        </div>
                    </div>

                    <div className="mb-6 space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Select Day:</label>
                            <select 
                                value={selectedDay}
                                onChange={(e) => {
                                    setSelectedDay(e.target.value);
                                    setSelectedSlot(0);
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                {days.map(day => (
                                    <option key={day} value={day}>{day}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Select Time Slot:</label>
                            <select 
                                value={selectedSlot}
                                onChange={(e) => setSelectedSlot(Number(e.target.value))}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                {timetable[selectedDay].map((slot, idx) => (
                                    <option key={idx} value={idx}>
                                        {slot.start} - {slot.end} ({slot.code})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {qrData && (
                        <div className="space-y-6">
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
                                <h2 className="text-2xl font-bold mb-2">{qrData.subject}</h2>
                                <p className="text-indigo-100">Day: {qrData.day}</p>
                                <p className="text-indigo-100">Class Time: {qrData.classTime}</p>
                            </div>

                            <div className="flex justify-center bg-gray-50 p-8 rounded-xl">
                                <div className="bg-white p-6 rounded-lg shadow-lg">
                                    <img 
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData.base64)}`}
                                        alt="Attendance QR Code"
                                        className="w-72 h-72"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                                    <p className="text-sm text-purple-600 font-semibold mb-1">Random Date</p>
                                    <p className="text-purple-800 font-mono">{qrData.randomDate}</p>
                                </div>
                                <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                                    <p className="text-sm text-pink-600 font-semibold mb-1">Random 7-Digit No</p>
                                    <p className="text-pink-800 font-mono">{qrData.randomNum}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                    <p className="text-sm text-green-600 font-semibold mb-1">Random QR Start Time</p>
                                    <p className="text-green-800 font-mono">{qrData.qrStartTime}</p>
                                </div>
                                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                    <p className="text-sm text-red-600 font-semibold mb-1">QR End Time (+15s)</p>
                                    <p className="text-red-800 font-mono">{qrData.qrEndTime}</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-600 mb-2">Raw Payload:</h3>
                                    <div className="bg-white p-4 rounded border border-gray-200 font-mono text-sm break-all">
                                        {qrData.payload}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-gray-600 mb-2">Base64 Encoded:</h3>
                                    <div className="bg-white p-4 rounded border border-gray-200 font-mono text-xs break-all text-gray-700">
                                        {qrData.base64}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <p className="text-sm text-blue-800">
                                    <span className="font-semibold">ℹ️ Info:</span> This QR uses RANDOM dates and times but follows your timetable structure. 
                                    Auto-refreshes every 15 seconds with completely new random data.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-6 text-center text-gray-600 text-sm">
                    <p>⚡ Auto-refreshing every 15 seconds | 🎲 Random data generation | 🎓 Timetable-coordinated</p>
                </div>
            </div>
        </div>
    );
};

export default TimetableQRGenerator;
