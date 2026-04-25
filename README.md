# Smart Plant Monitoring App

This workspace contains a complete beginner-friendly Smart Plant Monitoring project:

- `frontend/` - React Native Expo app with dashboard, graphs, insights and plant setup.
- `backend/` - Express + MongoDB API with Mongoose models and Twilio WhatsApp alerts.

## Run Backend

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

## Run Frontend

```bash
cd frontend
npm install
npm start
```

When testing on a physical phone, replace `frontend/app.json` `extra.apiUrl` with your computer LAN IP, for example:

```json
"apiUrl": "http://192.168.1.10:5000"
```

## Sample Sensor Request

```bash
curl -X POST http://localhost:5000/data ^
  -H "Content-Type: application/json" ^
  -d "{\"device_id\":\"plant-001\",\"temp\":29,\"humidity\":64,\"moisture\":42,\"water_level\":75}"
```
