# Smart Plant Backend

## Setup

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Update `.env` with your MongoDB URI and Twilio WhatsApp credentials.

## API

- `POST /data` accepts `{ "device_id": "plant-001", "temp": 29, "humidity": 64, "moisture": 42, "water_level": 75 }`
- `GET /data/:device_id` returns historical readings and the latest status.
- `POST /plant` accepts `{ "plant_name": "Mint", "device_id": "plant-001" }`
- `GET /plant/:device_id` returns the saved plant profile.
