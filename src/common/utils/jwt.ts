import jwt from 'jsonwebtoken'

const jwtSecret = process.env.JWT_SECRET!

export const generateJWT = (id: string): string=>{
    
    const token = jwt.sign({ id }, jwtSecret,{
        expiresIn: '24h'
    })
    return token
}

export const verifyJWT = (token: string)=>{
    
    const result = jwt.verify(token, jwtSecret)
    return result
    
}

