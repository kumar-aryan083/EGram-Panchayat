import React, { useEffect, useState } from 'react'
import './css/Login.css'
import { useNavigate } from 'react-router-dom'
import Loader from '../components/Loader'
const Login = ({
    newUser,
    user,
    setMessage,
    pos
}) => {
    const Nav = useNavigate();
    const [isLoading, setLoading] = useState(false);
    useEffect(() => {
        document.title = `${pos} Login | EGram Panchyat`
        if(user){
            Nav('/');
        }
    }, [])
    const [form, setForm] = useState({
        id: '',
        password: ''
    })
    const handleChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        setForm({
            ...form,
            [name]:value
        })
    }
    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        const res = await fetch(`http://192.168.1.9:9000/api/${pos}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form),
            credentials: 'include',  
        });
        const data = await res.json();
        if (res.ok) {
            newUser(data.user);
            setMessage(data.message);
            Nav('/');
        } else {
            setMessage(data.message);
        }
        setLoading(false);
    };
    
  return (
    <>
    {isLoading && <Loader/>}
    <section className="fullLoginPage">
        <section className="loginUpper">
            <div className="loginCard">
                <div className="lCard">
                    <h1>Login / {pos.toUpperCase()}</h1>
                    <form onSubmit={handleSubmit}>
                        <input type="text" name = 'id' placeholder='Enter you Id' value = {form.id} onChange={handleChange} required />
                        <input type="password" name = 'password' placeholder='Enter you Password' value = {form.password} onChange={handleChange} required />
                        <input type="submit" value="Login" />
                    </form>
                    
                </div>
            </div>
            <div className="loginInfo">
                <h2>Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci repellat, ad repudiandae debitis velit nam?</h2>
                <ul>
                    <li>Lorem ipsum dolor sit amet consectetur adipisicing.</li>
                    <li>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Totam, similique! Sed, magni.</li>
                    <li>Lorem ipsum dolor sit amet.</li>
                </ul>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab veritatis illum quasi atque deserunt doloribus exercitationem.</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum possimus odit molestiae?</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis iusto, qui commodi doloremque aliquid hic sapiente, omnis est minima quas ipsum?</p>
            </div>
        </section>
        <section className="loginLower">
            <div className="llFirst">
                <h3>Things to remember:</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque, natus maxime vitae aspernatur est laboriosam asperiores, delectus, iure neque nihil voluptatibus magni odio? Magni atque dicta libero tempora iusto! Ad deleniti asperiores beatae doloremque nostrum accusantium laudantium quam id dignissimos. Corrupti sequi obcaecati dicta tempora eius beatae architecto animi libero optio atque maxime suscipit officiis nostrum ex culpa, consequuntur ipsa soluta? Ipsam, tempora facere similique sequi autem impedit, quas reiciendis perferendis recusandae ab maiores consequatur quaerat porro illo, voluptas est suscipit aperiam corporis possimus vero nam blanditiis. Dicta alias earum maxime minus exercitationem commodi harum molestiae voluptatem minima, velit odit incidunt quasi architecto dolores blanditiis facilis, illum qui. Quibusdam voluptatem, ut perspiciatis fugiat porro aut quos vitae commodi sit voluptatum modi nobis possimus veritatis ratione. Quidem, commodi! Cum omnis facilis delectus in mollitia non eos quis saepe quos, dolor iure eius alias aspernatur dolorem magni hic praesentium, distinctio a ratione doloribus voluptatum id! Odio voluptatem nemo aspernatur accusamus error omnis molestiae! Eius quod hic minima commodi in, iste aperiam explicabo sunt, quidem debitis blanditiis fugiat officia iure assumenda? Maxime enim ratione modi soluta illum tenetur labore incidunt alias, rem qui cumque mollitia iure eveniet natus quo sit fugiat veniam unde.</p>
                <ul>
                    <li>Lorem ipsum dolor sit amet consectetur adipisicing elit.</li>
                    <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus commodi aspernatur veritatis.</li>
                    <li>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsa obcaecati quisquam cum quibusdam veritatis voluptatibus, modi dolores. Dicta dolore voluptates itaque?</li>
                    <li>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Distinctio, facilis nostrum. Rem.</li>
                    <li>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repudiandae, doloribus.</li>
                </ul>
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Adipisci eligendi obcaecati cupiditate rem animi ex placeat perferendis vel, optio voluptatibus nam ducimus aliquid aliquam. Dolores ipsum, doloremque at sunt nemo blanditiis mollitia molestiae similique minima reiciendis voluptas. Omnis eius sapiente inventore nam explicabo praesentium, a impedit quas ea cumque dicta, sed ut. Natus delectus nihil culpa non accusantium enim magni rem illum, quod alias odio, officia dolore cupiditate molestias repellendus explicabo maiores pariatur. Velit in quasi tenetur quos incidunt consequatur, perspiciatis culpa, et, illum ipsam alias repellat dolorum blanditiis neque nihil laboriosam eveniet. Assumenda nulla autem cum ipsa aliquam error impedit similique, fugit exercitationem nisi repellat quam recusandae voluptas iure enim sequi dolorum? Doloribus ipsa explicabo facere tempore dignissimos maiores!</p>
            </div>
        </section>
    </section>
    </>
  )
}

export default Login