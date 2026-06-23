import { useEffect, useState } from "react";

export default function CarLoader() {
    const [show, setShow] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    if (!show) return null;

    return (
        <div className="loader-overlay">
            <div className="car">🚗</div>
            <div className="road">
            </div>
        </div>
    );
}