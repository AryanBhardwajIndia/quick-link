# QuickLink

URL shortener developed using React.js, Node.js, Express.js and MongoDB. Converts any provided link into a short URL by designating a 6-digit HEX code to it.

Live: http://quicklink.aryanbhardwaj.xyz

## Structure

```
. 
├── url-shortener-backend/
│ ├── package-lock.json 
│ ├── package.json 
│ └── server.js 
├── url-shortener-frontend/
│ ├── public/ 
│ │ ├── index.html 
│ │ └── manifest.json 
│ └── src/ 
│   ├── App.css 
│   ├── App.js 
│   ├── App.test.js 
│   ├── index.css 
│   └── index.js 
└── package.json
```

## How it works?

1. User inputs the link in the input section which after clicking on the 'Shorten Link' button is saved in the MongoDB database.

2. The backend server generates a 6-digit HEX code as an acronym for the website and adds it in the same row as the link input by the user.

3. Upon entering the link in the URL tab of the browser the backend server checks for the website in the MongoDB database, retrieves it and changes the shortened link with the actual website.

## Installation

1. Clone the repository

```bash
git clone http://www.github.com/AryanBhardwajIndia/quick-link
```

2. Install the required dependencies

```
npm install express mongoose cors
```

3. Start MongoDB

```bash
mongod
```

4. Start the backend server using terminal

```bash
cd url-shortener-backend
npm start
```

5. Deploy the frontend

```bash
cd ..
cd url-shortener-frontend
npm start
```