export const checkAdmin = async () => {
    const res = await fetch('http://192.168.1.9:9000/api/admin/checkAdmin', {
        method: 'GET',
        headers: {
            'Content-Type':'application/json'
        },
        credentials: 'include'
    })
    const data = await res.json();
    return data.success;
}
export const checkUser = async () => {
    const res = await fetch('http://192.168.1.9:9000/api/user/check', {
        method: 'GET',
        headers: {
            'Content-Type':'application/json'
        },
        credentials: 'include'
    })
    const data = await res.json();
    return data.success;
}
export const checkStalf = async () => {
    const res = await fetch('http://192.168.1.9:9000/api/stalf/check-stalf', {
        method: 'GET',
        headers: {
            'Content-Type':'application/json'
        },
        credentials: 'include'
    })
    const data = await res.json();
    return data.success;
}