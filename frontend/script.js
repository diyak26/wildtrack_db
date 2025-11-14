/* GOOGLE FONT */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Inter", sans-serif;
}

body {
    background: #f7f6f2;
    color: #222;
}

/* NAVBAR */
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 50px;
    background: #fff;
    position: sticky;
    top: 0;
    z-index: 50;
    border-bottom: 1px solid #e5e5e5;
}

.logo {
    display: flex;
    align-items: center;
    gap: 10px;
}

.logo img {
    width: 45px;
}

.logo h2 {
    font-size: 20px;
    margin: 0;
}

.logo span {
    font-size: 12px;
    color: #777;
}

nav a {
    margin-left: 25px;
    text-decoration: none;
    color: #222;
    font-weight: 500;
    padding: 8px 16px;
    border-radius: 20px;
}

nav a:hover, nav .active {
    background: #e1f2e1;
    border: 1px solid #0f6b2b;
}

/* HERO */
.hero {
    height: 550px;
    background: linear-gradient(to right, rgba(3, 84, 35, 0.8), rgba(147, 98, 27, 0.7)),
        url('https://wallpapers.com/images/featured/elephant-animals-zoo-jungle-8k-wg9zu4v27s8p37jq.jpg');
    background-size: cover;
    background-position: center;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: white;
    padding: 30px;
}

.hero-content h1 {
    font-size: 60px;
    font-weight: 700;
}

.sub {
    font-size: 22px;
    margin: 10px 0;
}

.desc {
    max-width: 650px;
    margin: 15px auto;
    font-size: 17px;
}

.hero-buttons {
    margin-top: 20px;
}

.primary-btn, .secondary-btn {
    padding: 13px 22px;
    border-radius: 30px;
    border: none;
    cursor: pointer;
    font-size: 15px;
    margin: 8px;
}

.primary-btn {
    background: #0a5d29;
    color: white;
}

.secondary-btn {
    background: #fff;
    color: #0a5d29;
    border: 2px solid #0a5d29;
}

/* FEATURES */
.features {
    padding: 60px 50px;
    text-align: center;
}

.features h2 {
    font-size: 35px;
    margin-bottom: 10px;
}

.feature-sub {
    margin-bottom: 40px;
    color: #555;
}

.feature-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 25px;
}

.card {
    background: white;
    padding: 25px;
    border-radius: 12px;
    text-align: left;
    border: 1px solid #eee;
    transition: 0.3s;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0,0,0,0.1);
}

.icon {
    font-size: 35px;
    margin-bottom: 10px;
}

/* CTA */
.cta {
    height: 260px;
    background: linear-gradient(to right, #074d22, #b07a28);
    text-align: center;
    color: white;
    padding: 50px 20px;
}

.cta h2 {
    font-size: 35px;
}

.cta-btn {
    margin-top: 20px;
    padding: 14px 30px;
    background: white;
    color: #134d2c;
    border: none;
    border-radius: 25px;
    font-size: 16px;
    cursor: pointer;
}

/* FOOTER */
footer {
    background: #0a5d29;
    color: white;
    display: flex;
    justify-content: space-around;
    padding: 40px 30px;
}

footer h3 {
    margin-bottom: 10px;
}

footer p, footer a {
    color: #d9f5e0;
    text-decoration: none;
    font-size: 14px;
}

footer a:hover {
    text-decoration: underline;
}

.footer-bottom {
    background: #08441f;
    text-align: center;
    color: #c8f1d2;
    padding: 10px;
    font-size: 14px;
}
