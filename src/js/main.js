const url = "https://estapi.mandarin.weniv.co.kr";
const active_color = "#EA7F42";
const inactive_color = "#FFC7A7";

// 주어진 이름의 쿠키를 반환하는데,
// 조건에 맞는 쿠키가 없다면 undefined를 반환합니다.
function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options = {}) {

    options = {
        path: '/',
        // 필요한 경우, 옵션 기본값을 설정할 수도 있습니다.
        ...options
    };

    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }

    document.cookie = updatedCookie;
}

function deleteCookie(name) {
    setCookie(name, "", {
        'max-age': -1
    })
}

async function login(email, password) {
    const res = await fetch(url + "/user/login/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "user": {
                "email": email,
                "password": password
            }
        })
    });

    const resJson = await res.json();
    // console.log(resJson);

    if (res.status === 200 && resJson.status === undefined) {
        setCookie('token', resJson.token, {path: '/'});
        window.location.href = 'home.html';

        return '';
    } else {
        let msg = '';

        if (res.status !== 200) {
            msg = resJson;
        } else {
            msg = resJson.message;
        }

        return msg;
    }
}

function logout() {
    deleteCookie("token");

    setTimeout(() => window.location.href = 'login.html', 3000);
}

async function checkToken(token) {
    const res = await fetch(url+"/user/checktoken", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        body : JSON.stringify({
            "Authorization": `Bearer ${token}`,
        })
    });
    const resJson = await res.json();
    console.log(resJson);

    if(resJson.isValid === false) {
        logout();
    }
    else
    {
        return true;
    }

    return false;
}
