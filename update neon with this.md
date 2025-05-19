# Sensor Data for Neon Database Update
## Sensor Data
### Sensor 1
```json{
  "installation_date": "2024-12-01T09:00:00.000Z",  "battery_status": 95,
  "longitude": 12978456,  "latitude": 55611234,
  "location_description": "Västra Hamnen - Turning Torso",  "sensor_failure": false,
  "lost_communication": false}
```****
Water level for Sensor 1:```json
{  "sensor_id": 1,
  "waterlevel": 4,  "rate_of_change": 1,
  "measured_at": "2025-05-12T10:30:00.000Z"}
```
### Sensor 2```json
{  "installation_date": "2025-01-15T13:30:00.000Z",
  "battery_status": 80,  "longitude": 12994573,
  "latitude": 55609235,  "location_description": "Malmö Harbor - North Pier",
  "sensor_failure": false,  "lost_communication": false
}```
Water level for Sensor 2:
```json{
  "sensor_id": 2,  "waterlevel": 3,
  "rate_of_change": 1,  "measured_at": "2025-05-12T10:30:00.000Z"
}```
### Sensor 3
```json{
  "installation_date": "2025-02-20T08:00:00.000Z",  "battery_status": 70,
  "longitude": 12935681,  "latitude": 55566789,
  "location_description": "Limhamn Coastal Area",  "sensor_failure": false,
  "lost_communication": false}
```
Water level for Sensor 3:```json
{  "sensor_id": 3,
  "waterlevel": 2,  "rate_of_change": 2,
  "measured_at": "2025-05-12T10:30:00.000Z"}
```
### Sensor 4```json
{  "installation_date": "2025-03-05T15:45:00.000Z",
  "battery_status": 60,  "longitude": 12956789,
  "latitude": 55572345,  "location_description": "Bunkeflostrand Coastal Path",
  "sensor_failure": false,  "lost_communication": false
}```
Water level for Sensor 4:
```json{
  "sensor_id": 4,  "waterlevel": 1,
  "rate_of_change": 0,  "measured_at": "2025-05-12T10:30:00.000Z"
}```
## API Endpoints for Updates
### For Sensors
POST /api/sensors
### For Water LevelsPOST /api/sensors/waterlevels
## Database Schema Reference
```sqlsensors(id, installation_date, battery_status, longitude, latitude, location_description, sensor_failure, lost_communication)
waterlevels(id, sensor_id [FK], waterlevel, rate_of_change, measured_at)```


























































