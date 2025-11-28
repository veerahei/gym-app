
export function getBarchartData(activityList) {

    let totalTime = activityList.reduce((acc, curr) => {
        acc[curr.activityName] = (acc[curr.activityName] || 0) + Number(curr.duration / 60);
        console.log(acc)
        return acc;
    }, {})

    console.log("TOTAL TIME", totalTime)

    const chartData = {
        labels: Object.keys(totalTime),
        datasets: [
            {
                data: Object.values(totalTime).map(number => Math.round(number * 100) / 100),
            },
        ],
    };

    return chartData;
}


export function getPiechartData(activityList) {

    let counts = activityList.reduce((acc, curr) => {
        acc[curr.activityName] = (acc[curr.activityName] || 0) + 1;
        return acc;
    }, {})

    //Color palette: https://mycolor.space/
    const colors = ["#7E57C2", "#9c72e1", "#140060", "#fbeaff", "#bb8eff", "#daacff", "#facaff", "#ffe8ff", "#4d2c91"]

    const formattedData = Object.entries(counts).map(([key, value], index) => ({
        name: key,
        occurrence: value,
        color: colors[index],
        legendFontColor: "#333",
        legendFontSize: 15,
    }));

    return formattedData;
}