import React, { useEffect, useState } from 'react';
import './css/Register.css';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';

const Register = ({ user, newUser, setMessage, pos }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setLoading] = useState(false);
  const Nav = useNavigate();

  useEffect(() => {
    if(user) {
      Nav('/');
    }
  }, [])


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };


  // Handle form submission and registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const res = await fetch(`http://192.168.1.9:9000/api/${pos}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        password: form.password
      }),
      credentials: 'include', 
    });

    const data = await res.json();

    if (res.ok) {
      newUser(data.user); // Registration successful
      setForm({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      })
      Nav('/');
    } else {
      // Handle error case
      setMessage(data.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <>
    {isLoading && <Loader/>}
    <section className="fullRegisterPage">
      <section className="registerUpper">
        <div className="registerCard">
          <div className="rCard">
            <h1>Register / {pos.toUpperCase()}</h1>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Enter your Name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Enter your Email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Enter your Password"  
                value={form.password}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your Password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
              <input type="submit" value="Register" />
            </form>
          </div>
        </div>
      </section>
      <section className="registerLower">
        <div className="rlFirst">
          <h3>Important:</h3>
          <ul>
            <li>Password must be at least 8 characters long.</li>
            <li>Ensure the email address is valid for verification.</li>
            <li>Passwords must match.</li>
          </ul>
          <p>
            By registering, you agree to the terms and conditions and the privacy policy of our platform.
          </p>
        </div>
      </section>
    </section>
    <section className="loginLower rExtra">
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
</>
  );
};

export default Register;
