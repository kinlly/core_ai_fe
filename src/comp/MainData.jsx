import React from "react";

const Loader = <>LOADING....</>;

export function MainData() {
    const [data, setData] = React.useState([]);

    React.useEffect(() => {
        (async () => {
            const res = await fetch('http://127.0.0.1:8000/main-data', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const responseData = await res.json();
            setData(responseData)
        })()
    }, []);

    return data.length ? data.map((l) => <p>{l.instruction}</p>) : Loader;
}