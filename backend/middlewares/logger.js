// Middleware de logging - registra todas as requisições
const loggerMiddleware = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  
  console.log(`[${timestamp}] ${method} ${url}`);
  
  // Adiciona o timestamp ao request para uso posterior
  req.requestTime = timestamp;
  
  next();
};

module.exports = loggerMiddleware;