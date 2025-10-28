import type { Request,Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken';
import type { TokenPayload } from '../types/token-payload.js'
import { JWT_SECRET, JWT_EXPIRATION, REFRESH_EXPIRATION } from '../config/env.js'

// --- Fonctions de création et de vérification des tokens ---
export function createAccessToken(user: TokenPayload) {
  return jwt.sign(user, JWT_SECRET as string, { expiresIn: JWT_EXPIRATION as string })
}

export function createRefreshToken(user: TokenPayload) {
  return jwt.sign(user, JWT_SECRET as string, { expiresIn: REFRESH_EXPIRATION as string })
}

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.access_token
  
  if (!token) {
    return res.status(401).json({ error: 'Token manquant' })
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload
    req.user = decoded
    next()
  } catch {
    res.status(403).json({ error: 'Token invalide ou expiré' })
  }
}