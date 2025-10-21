const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const crypto = require('crypto');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/urlshortener', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  clicks: {
    type: Number,
    default: 0,
  },
});

const Url = mongoose.model('Url', urlSchema);

function generateShortCode() {
  return crypto.randomBytes(3).toString('hex');
}

app.post('/api/shorten', async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ error: 'URL is required' });
    }

    try {
      new URL(originalUrl);
    } catch (err) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    let url = await Url.findOne({ originalUrl });

    if (url) {
      return res.json({
        shortUrl: `http://localhost:5002/${url.shortCode}`,
        shortCode: url.shortCode,
      });
    }

    let shortCode = generateShortCode();
    let exists = await Url.findOne({ shortCode });

    while (exists) {
      shortCode = generateShortCode();
      exists = await Url.findOne({ shortCode });
    }

    url = new Url({
      originalUrl,
      shortCode,
    });

    await url.save();

    res.json({
      shortUrl: `http://localhost:5002/${shortCode}`,
      shortCode: shortCode,
    });
  } catch (error) {
    console.error('Error shortening URL:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await Url.findOne({ shortCode });

    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    url.clicks += 1;
    await url.save();

    res.redirect(url.originalUrl);
  } catch (error) {
    console.error('Error redirecting:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/stats/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await Url.findOne({ shortCode });

    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    res.json({
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      clicks: url.clicks,
      createdAt: url.createdAt,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});