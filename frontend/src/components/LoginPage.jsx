import React, { useState, useEffect } from 'react';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        // Redirect to dashboard or handle successful login
        console.log('Login successful');
      } else {
        // Handle login error
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const doodles = document.querySelectorAll('.doodle');
    const doodleContainer = document.getElementById('doodle-container');
    const doodleExpressions = {
      'doodle-1': { default: 'mouth-line', clicked: 'mouth-surprised' },
      'doodle-2': { default: 'mouth-line', clicked: 'mouth-smile' },
      'doodle-3': { default: 'mouth-line', clicked: 'mouth-surprised' },
      'doodle-4': { default: 'mouth-line', clicked: 'mouth-smile' },
    };

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    document.addEventListener('mousemove', handleMouseMove);

    function updateDoodles() {
      doodles.forEach((doodle) => {
        const eyes = doodle.querySelectorAll('.eye');
        eyes.forEach((eye) => {
          const eyeRect = eye.getBoundingClientRect();
          const eyeX = eyeRect.left + eyeRect.width / 2;
          const eyeY = eyeRect.top + eyeRect.height / 2;
          const deltaX = mouseX - eyeX;
          const deltaY = mouseY - eyeY;
          const angle = Math.atan2(deltaY, deltaX);
          const distance = Math.min(2, Math.sqrt(deltaX * deltaX + deltaY * deltaY) * 0.01);
          const moveX = Math.cos(angle) * distance;
          const moveY = Math.sin(angle) * distance;
          eye.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });

        if (!doodle.classList.contains('squishing')) {
          const doodleRect = doodle.getBoundingClientRect();
          const doodleCenterX = doodleRect.left + doodleRect.width / 2;
          const doodleCenterY = doodleRect.top + doodleRect.height / 2;
          const deltaX = mouseX - doodleCenterX;
          const deltaY = mouseY - doodleCenterY;
          const maxTilt = 25;
          const maxSkew = 35;
          const influence = 0.07;
          let tiltX = -deltaY * influence;
          let tiltY = deltaX * influence;
          let skewX = deltaX * influence;
          tiltX = Math.max(-maxTilt, Math.min(maxTilt, tiltX));
          tiltY = Math.max(-maxTilt, Math.min(maxTilt, tiltY));
          skewX = Math.max(-maxSkew, Math.min(maxSkew, skewX));
          doodle.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) skewX(${skewX}deg)`;
        }
      });
      requestAnimationFrame(updateDoodles);
    }

    requestAnimationFrame(updateDoodles);

    doodles.forEach((doodle) => {
      doodle.addEventListener('click', () => {
        doodle.classList.add('squishing');
        setTimeout(() => {
          doodle.classList.remove('squishing');
        }, 300);

        const mouth = doodle.querySelector('.doodle-mouth');
        if (!mouth) return;
        const expressions = doodleExpressions[doodle.id];
        if (!expressions) return;

        const isDefault = mouth.classList.contains(expressions.default);
        if (isDefault) {
          mouth.classList.remove(expressions.default);
          mouth.classList.add(expressions.clicked);
          setTimeout(() => {
            mouth.classList.remove(expressions.clicked);
            mouth.classList.add(expressions.default);
          }, 1500);
        } else {
          mouth.classList.remove(expressions.clicked);
          mouth.classList.add(expressions.default);
        }
      });
    });

    if (doodleContainer) {
      doodleContainer.addEventListener('mouseleave', () => {
        doodles.forEach((doodle) => {
          if (!doodle.classList.contains('squishing')) {
            doodle.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) skewX(0deg)';
          }
        });
      });
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="doodle-section">
          <div id="doodle-container" className="doodle-container">
            <div className="doodle-wrapper">
              <div id="doodle-1" className="doodle doodle-1 cursor-pointer">
                <div className="eyes">
                  <div className="eye"></div>
                  <div className="eye"></div>
                </div>
                <div className="doodle-mouth mouth-line"></div>
              </div>
              <div id="doodle-2" className="doodle doodle-2 cursor-pointer">
                <div className="eyes">
                  <div className="eye"></div>
                  <div className="eye"></div>
                </div>
                <div className="doodle-mouth mouth-line"></div>
              </div>
              <div id="doodle-3" className="doodle doodle-3 cursor-pointer">
                <div className="eyes">
                  <div className="eye"></div>
                  <div className="eye"></div>
                </div>
                <div className="doodle-mouth mouth-line"></div>
              </div>
              <div id="doodle-4" className="doodle doodle-4 cursor-pointer">
                <div className="eyes">
                  <div className="eye"></div>
                  <div className="eye"></div>
                </div>
                <div className="doodle-mouth mouth-line"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="form-section">
          <div className="form-header">
            <div className="logo">
              <span className="material-symbols-outlined">add</span>
            </div>
            <h1>Welcome back!</h1>
            <p>Please enter your details</p>
          </div>
          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={togglePasswordVisibility}
              >
                <span className="material-symbols-outlined">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            <div className="form-options">
              <div className="remember-me">
                <input type="checkbox" id="remember-me" name="remember-me" />
                <label htmlFor="remember-me">Remember for 30 days</label>
              </div>
              <a href="#">Forgot password?</a>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Log In
              </button>
              <button type="button" className="btn btn-secondary">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjDRG7EHlRyHteGTdRfuQihUtjVCRpqe7VlVWJWlLiUaSaK7A4jWiLPdDdBu6wAPW6MnKYEAW0h7rwj9AMYyJHIecMBazUkG-VH8WNlK7QsHq1YjsWxOsLJejnJUi7lCCdPIgXqwdZHsojU_UPXRY_mV4VBq0e2Dx3k4YUXDcHOUTR9Fs0gHLRKBcfLd6HaDOci3jU0cKI--rUPxDZGs-Rh_RaRC4JimykzEnDoY21Ja8ffiyA7GdaV_MhLEWzyvEZmP7rukT_0Y3s"
                  alt="Google icon"
                />
                Log in with Google
              </button>
            </div>
          </form>
          <p className="signup-link">
            Don't have an account? <a href="#">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;