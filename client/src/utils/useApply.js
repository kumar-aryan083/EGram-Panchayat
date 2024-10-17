export const applyScheme = async (id) => {
    const res = await fetch(`http://192.168.1.9:9000/api/user/apply/${id}`,{
        method: 'GET',
        headers: {
            'Content-Type':'application/json'
        },
        credentials: 'include'
    })
    const data = await res.json();

    return data;
}