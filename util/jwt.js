const crypto = require('crypto')

// 인코딩 함수
const encoding = (value) => {
    const encoded = Buffer.from(JSON.stringify(value)).toString('base64').replace(/[=]/g, '')

    return encoded
}

// 시그니처 생성 함수
const createSignature = (eHeader, ePayload) => {
    const message = `${eHeader}.${ePayload}`
    const signature = crypto.createHmac('sha256', Buffer.from('salt'))
        .update(message)
        .digest('hex')
        .replace(/[=]/g, '')

    return signature
}

// jwt 토큰 생성 함수
const createJWT = (payloadObj) => {
    const header = {
        "alg": "HS256", // sha256 말고 hs256 씀 (왜????)
        "typ": "JWT"
    }
    const payload = { ...payloadObj }
    const eHeader = encoding(header)
    const ePayload = encoding(payload)
    const signature = createSignature(eHeader, ePayload)
    const jwt = `${eHeader}.${ePayload}.${signature}`

    return jwt
}

// jwt 인증 확인 함수
const verifyJWT = (jwt) => {
    const [head, pay, sign] = jwt.split('.')
    const verifySign = createSignature(head, pay)
    if (verifySign === sign) { return true }
    else { return false }
}

// payload 디코딩 함수
const decoding = (jwt) => {
    const [, pay,] = jwt.split('.')
    const decoded = JSON.parse(Buffer.from(pay, 'base64').toString('utf-8'))
    return decoded
}

module.exports = {
    encoding,
    createSignature,
    createJWT,
    verifyJWT,
    decoding
}