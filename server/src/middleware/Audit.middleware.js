import useragent from 'useragent';
import geoip from 'geoip-lite';
import Audit from '../models/Audit.model.js';

const auditLogger = async (req, res, next) => {
  const start = Date.now();

  res.on('finish', async () => {
    const duration = Date.now() - start;
    const agent = useragent.parse(req.headers['user-agent']);
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
    const geo = geoip.lookup(ip);

    try {
      await Audit.create({
        userId: req.user?._id,
        userEmail: req.user?.email || 'Anonymous',
        action: `${req.method} ${req.originalUrl}`,
        method: req.method,
        endpoint: req.originalUrl,
        statusCode: res.statusCode,
        responseTime: `${duration}ms`,
        ipAddress: ip,
        details: {
          os: agent.os.toString(),
          device: agent.device.toString(),
          browser: agent.toAgent(),
         
          location: {
            city: geo?.city || 'Unknown',
            country: geo?.country || 'Unknown'
          },
          payload: req.method !== 'GET' ? req.body : null
        }
      });
    } catch (error) {
      
      console.error('Audit Log capture failed:', error.message);
    }
  });
  next();
};

export default auditLogger;