// 各地域のAPI URL (地域コードに基づくURL)
const apiUrls = {
    "130000": "https://www.jma.go.jp/bosai/forecast/data/forecast/130000.json", // 東京
    "110000": "https://www.jma.go.jp/bosai/forecast/data/forecast/110000.json", // 埼玉
    "014100": "https://www.jma.go.jp/bosai/forecast/data/forecast/014100.json" // 釧路・根室地方
};

// 初期状態で天気を表示するための関数
async function getWeather() {
    const areaId = document.getElementById('area').value;  // 選択された地域IDを取得
    const url = apiUrls[areaId];  // 地域IDに対応するAPI URLを取得

    try {
        const response = await fetch(url);  // APIからデータを取得
        const data = await response.json();  // JSONとしてパース

        // データ構造を確認
        console.log(data);  // デバッグ：データの構造を確認する

        displayWeather(data);  // 取得したデータを表示
    } catch (error) {
        console.error('天気データの取得に失敗しました:', error);  // エラーハンドリング
    }
}

// 天気予報をHTMLの表に表示する関数
function displayWeather(data) {
    const locationElement = document.getElementById('location');
    const forecast = data[0].timeSeries[0];  // 予報データ

    // 地域名を表示 (最初の地域の名前を取得)
    const areaName = forecast.areas[0].area.name;
    locationElement.textContent = `${areaName}の天気予報`;

    // 更新日時を表示
    const updateDate = new Date(data[0].reportDatetime);
    document.getElementById('updatedate').textContent = `更新日時: ${updateDate.toLocaleString()}`;

    // 表形式で天気情報を表示
    let table = `
        <table>
            <thead>
                <tr>
                    <th>日付</th>
                    <th>天気</th>
                    <th>最高気温 (℃)</th>
                    <th>最低気温 (℃)</th>
                </tr>
            </thead>
            <tbody>
    `;

    // 3日分の天気情報をループして表示
    for (let i = 0; i < 3; i++) {
        const time = forecast.timeDefines[i];  // 日付・時刻
        const weatherCode = forecast.areas[0].weatherCodes[i];  // 天気コード
        const tempMin = data[1].timeSeries[1].areas[0].tempsMin[i];  // 最低気温
        const tempMax = data[1].timeSeries[1].areas[0].tempsMax[i];  // 最高気温

        // 日付を表示
        const date = new Date(time);
        table += `
            <tr>
                <td>${date.toLocaleDateString('ja-JP')}</td>
                <td><img src="https://www.jma.go.jp/bosai/forecast/img/${weatherCode}.png" alt="天気アイコン"></td>
                <td>${tempMax}℃</td>
                <td>${tempMin}℃</td>
            </tr>
        `;
    }

    table += `
            </tbody>
        </table>
    `;

    // 表を表示する
    document.querySelector('.weatherForecast').innerHTML = table;
}

// 初期表示
getWeather();

// セレクトボックスが変更されたときに天気を再取得する
document.getElementById('area').addEventListener('change', getWeather);
