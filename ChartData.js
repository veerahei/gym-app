//Datan muotoilulogiikka omissa funktioissaan tässä tiedostossa

export function getBarchartData(activityList) {
    //console.log("Barchart datanmuokkausfunktiossa")
    //Paljonko aikaa käytetty Lähde: https://www.geeksforgeeks.org/javascript/count-occurrences-of-all-items-in-an-array-in-javascript/
    //Jaetaan 60 , jotta saadaan minuutit tunneiksi
    let totalTime = activityList.reduce((acc, curr) => {
        acc[curr.activityName] = (acc[curr.activityName] || 0) + Number(curr.duration / 60);
        return acc;
    }, {})

    console.log("TOTAL TIME", totalTime)

    const chartData = {
        labels: Object.keys(totalTime),
        datasets: [
            {
                data: Object.values(totalTime),
            },
        ],
    };

    return chartData;
}


export function getPiechartData(activityList) {
    // console.log("Piechart datanmuokkausfunktiossa")
    //Laske esiintymät. Lähde: https://www.geeksforgeeks.org/javascript/count-occurrences-of-all-items-in-an-array-in-javascript/
    let counts = activityList.reduce((acc, curr) => {
        acc[curr.activityName] = (acc[curr.activityName] || 0) + 1;
        return acc;
    }, {})

    //console.log("Esiintymiskerrat", counts)

    //Color palette: https://mycolor.space/
    const colors = ["#7E57C2", "#9c72e1", "#140060", "#fbeaff", "#bb8eff", "#daacff", "#facaff", "#ffe8ff", "#4d2c91"]

    //console.log(Object.entries(counts))

    //Data  piechartin tarvitsemaan muotoon.
    // TÄMÄ OBJECT.ENTRIES JA MAP RAKENNE on tismalleen sama, kuin firebase luentoesimerkissä, jossa tehdään poistotoiminto. 
    const formattedData = Object.entries(counts).map(([key, value], index) => ({
        name: key,
        occurrence: value,
        color: colors[index],
        legendFontColor: "#333",
        legendFontSize: 15,
    }));

    return formattedData;
}