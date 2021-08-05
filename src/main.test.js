import * as Perse from './main'
import { Store } from "./store"
import * as fs from 'fs'

const API_KEY = '8hJ2e4hq0S8Z8VDcj0ycY1a4awAt62vQ2XvFO1LP'

describe('Testing Middleware Detect Cases', () => {
  it('Should Initialize store with token value', () => {
    Perse.init(API_KEY)

    expect(Store.get('main/getApiKey')).toBe(API_KEY)
  })

  it('Should detect image and return status true', async () => {
    const image = fs.readFileSync('./image/test-image.jpg')
    let arraybuffer = new Blob([image])

    const response = await Perse.face.detect(arraybuffer)

    expect(response.status).toBe(true)
  })

  it('Should return correct error when sending empty file', async () => {
    const image = new Blob([])

    const response = await Perse.face.detect(image)

    expect(response).toStrictEqual({
      message: "The source file is empty or wasn't sent.",
      code: 'empty_file',
      status: false
    })
  })

  it('Should return correct error when sending unsupported file', async () => {
    const image = fs.readFileSync('./image/test-image.jpg')

    const response = await Perse.face.detect(image)

    expect(response).toStrictEqual({
      message: 'The source file is encoded in a format not supported by the API.',
      code: 'invalid_file_type',
      status: false
    })
  })

  it('Should parse detect response keys to camel case', async () => {
    Perse.init(API_KEY)

    const expectedKeys = [
      'totalFaces',
      'faces',
      'imageMetrics',
      'imageToken',
      'timeTaken',
      'status',
      'code',
      'message',
      'rightEye',
      'leftEye',
      'nose',
      'mouthRight',
      'mouthLeft',
      'livenessScore',
      'landmarks',
      'boundingBox',
      'confidence',
      'faceMetrics',
      'sharpness',
      'overexpose',
      'underexpose'
    ].sort()

    const image = fs.readFileSync('./image/test-image.jpg')
    let arraybuffer = new Blob([image])

    const response = await Perse.face.detect(arraybuffer)
    const responseRootKeys = Object.keys(response)
    const firstFaceObject = response.faces[0]

    const faceObjectKeys = Object.keys(firstFaceObject).reduce((objectKeys, key) => {
      if (firstFaceObject[key] instanceof Object && firstFaceObject[key].constructor === Object ) {
        objectKeys = [
          ...objectKeys,
          key,
          ...Object.keys(firstFaceObject[key])
        ]

        return objectKeys
      }

      objectKeys = [
        ...objectKeys,
        key
      ]

      return objectKeys
    }, [])

    const sortedResponseKeys = [
      ...responseRootKeys,
      ...faceObjectKeys
    ].sort()

    expect(sortedResponseKeys).toEqual(expectedKeys)
  })
})

describe('Testing function quality cases',  () => {
  it('Should return good quality for image', async () => {
    Perse.init(API_KEY)

    const image = fs.readFileSync('./image/test-image-good.jpg')
    let arraybuffer = new Blob([image])

    const response = await Perse.face.quality(arraybuffer)

    expect(response).toStrictEqual({
      status: true,
      code: 'success',
      message: 'Image is good enough to be used',
      totalFaces: 1,
      detailedFaces: [{
        isUnderexposed: false,
        isOverexposed: false,
        isBlurred: false
      }]
    })
  })

  it('Should return underexpose for image', async () => {
    Perse.init(API_KEY)

    const image = fs.readFileSync('./image/underexpose.jpg')
    let arraybuffer = new Blob([image])

    const response = await Perse.face.quality(arraybuffer)

    expect(response).toStrictEqual({
      status: false,
      code: 'bad_image_quality',
      message: 'Image is not good enough to be used',
      totalFaces: 1,
      detailedFaces: [{
        isUnderexposed: true,
        isOverexposed: false,
        isBlurred: true
      }]
    })
  })

  it('Should return overexpose for image', async () => {
    Perse.init(API_KEY)

    const image = fs.readFileSync('./image/overexpose.jpg')
    let arraybuffer = new Blob([image])

    const response = await Perse.face.quality(arraybuffer)

    expect(response).toStrictEqual({
      status: false,
      code: 'bad_image_quality',
      message: 'Image is not good enough to be used',
      totalFaces: 2,
      detailedFaces: [
        {
          isUnderexposed: false,
          isOverexposed: true,
          isBlurred: false,
        },
        {
          isBlurred: false,
          isOverexposed: true,
          isUnderexposed: false
        }
      ]
    })
  })

  it('Should return that image is not sharpened', async () => {
    Perse.init(API_KEY)

    const image = fs.readFileSync('./image/blur-with-face.jpg')
    let arraybuffer = new Blob([image])

    const response = await Perse.face.quality(arraybuffer)

    expect(response).toStrictEqual({
      status: false,
      code: 'bad_image_quality',
      message: 'Image is not good enough to be used',
      totalFaces: 1,
      detailedFaces: [{
        isUnderexposed: false,
        isOverexposed: false,
        isBlurred: true
      }]
    })
  })

  it('Should return that image is too big', async () => {
    Perse.init(API_KEY)

    const image = fs.readFileSync('./image/file-too-big.jpg')
    let arraybuffer = new Blob([image])

    const response = await Perse.face.quality(arraybuffer)

    expect(response).toStrictEqual({
      status: false,
      code: 'file_too_large',
      message: 'The source file byte size is too big. Please send files with less than 1 MB.'
    })
  })

  it('Should return that there is no face on image', async () => {
    Perse.init(API_KEY)

    const image = fs.readFileSync('./image/blur-no-face.jpg')
    let arraybuffer = new Blob([image])

    const response = await Perse.face.quality(arraybuffer)

    expect(response).toStrictEqual({
      status: false,
      code: 'no_face_detected',
      message: 'The model couldn\'t find a face in at least one of the images. Please check the property image_metrics for insight on the image quality.',
      totalFaces: 0,
      detailedFaces: []
    })
  })

  it('Should return object without isSpoofing flag', async () => {
    Perse.init(API_KEY)

    const image = fs.readFileSync('./image/blur-with-face.jpg')
    let arraybuffer = new Blob([image])

    const response = await Perse.face.quality(arraybuffer)

    expect(response).toStrictEqual({
      status: false,
      code: 'bad_image_quality',
      message: 'Image is not good enough to be used',
      totalFaces: 1,
      detailedFaces: [{
        isUnderexposed: false,
        isOverexposed: false,
        isBlurred: true
      }]
    })
  })

  it('Should return that picture has bad quality.', async () => {
    Perse.init(API_KEY)

    const image = fs.readFileSync('./image/spoof-image-bad-quality.jpg')
    let arraybuffer = new Blob([image])

    const response = await Perse.face.quality(arraybuffer)

    expect(response).toStrictEqual({
      status: false,
      code: 'bad_image_quality',
      message: 'Image is not good enough to be used',
      totalFaces: 2,
      detailedFaces: [
        {
          isUnderexposed: false,
          isOverexposed: true,
          isBlurred: false
        },
        {
          isUnderexposed: false,
          isOverexposed: false,
          isBlurred: false
        }]
    })
  })
})

describe('Testing function qualityWithSpoofCheck', () => {
  it('Should return that picture is spoof', async () => {
    Perse.init(API_KEY)

    const image = fs.readFileSync('./image/spoof-picture.jpg')
    let arraybuffer = new Blob([image])

    const response = await Perse.face.qualityWithSpoofCheck(arraybuffer)

    expect(response).toStrictEqual({
      status: false,
      code: 'bad_image_quality',
      message: 'Image is not good enough to be used',
      totalFaces: 1,
      detailedFaces: [{
        isUnderexposed: false,
        isOverexposed: false,
        isBlurred: false,
        isSpoofing: true
      }]
    })
  })

  it('Should return that picture has bad quality.', async () => {
    Perse.init(API_KEY)

    const image = fs.readFileSync('./image/spoof-image-bad-quality.jpg')
    let arraybuffer = new Blob([image])

    const response = await Perse.face.qualityWithSpoofCheck(arraybuffer)

    expect(response).toStrictEqual({
      status: false,
      code: 'bad_image_quality',
      message: 'Image is not good enough to be used',
      totalFaces: 2,
      detailedFaces: [
        {
          isUnderexposed: false,
          isOverexposed: true,
          isBlurred: false,
          isSpoofing: false
        },
        {
          isUnderexposed: false,
          isOverexposed: false,
          isBlurred: false,
          isSpoofing: true
        }]
    })
  })

  it('Should return that image is too big', async () => {
    Perse.init(API_KEY)

    const image = fs.readFileSync('./image/file-too-big.jpg')
    let arraybuffer = new Blob([image])

    const response = await Perse.face.qualityWithSpoofCheck(arraybuffer)

    expect(response).toStrictEqual({
      status: false,
      code: 'file_too_large',
      message: 'The source file byte size is too big. Please send files with less than 1 MB.'
    })
  })

  it('Should return good quality for image', async () => {
    Perse.init(API_KEY)

    const image = fs.readFileSync('./image/test-image-good-2.jpg')
    let arraybuffer = new Blob([image])

    const response = await Perse.face.qualityWithSpoofCheck(arraybuffer)

    expect(response).toStrictEqual({
      status: true,
      code: 'success',
      message: 'Image is good enough to be used',
      totalFaces: 1,
      detailedFaces: [{
        isUnderexposed: false,
        isOverexposed: false,
        isBlurred: false,
        isSpoofing: false
      }]
    })
  })

  it('Should return that is no face on image', async () => {
    Perse.init(API_KEY)

    const image = fs.readFileSync('./image/blur-no-face.jpg')
    let arraybuffer = new Blob([image])

    const response = await Perse.face.qualityWithSpoofCheck(arraybuffer)

    expect(response).toStrictEqual({
      status: false,
      code: 'no_face_detected',
      message: 'The model couldn\'t find a face in at least one of the images. Please check the property image_metrics for insight on the image quality.',
      totalFaces: 0,
      detailedFaces: []
    })
  })
})

describe('Testing function compare', () => {
  it('Should return picture compare result as true', async () => {
    Perse.init(API_KEY)

    const firstImageBuffer = fs.readFileSync('./image/test-image.jpg')
    const secondImageBuffer = fs.readFileSync('./image/test-image.jpg')

    const firstImageBinary = new Blob([firstImageBuffer])
    const secondImageBinary = new Blob([secondImageBuffer])

    const compareResult = await Perse.face.compare(firstImageBinary, secondImageBinary)

    expect(compareResult.status).toBe(true)
  })

  it('Should return error on picture compare', async () => {
    Perse.init(API_KEY)

    const firstImageBuffer = fs.readFileSync('./image/test-image.jpg')
    const secondImageBuffer = fs.readFileSync('./image/file-too-big.jpg')

    const firstImageBinary = new Blob([firstImageBuffer])
    const secondImageBinary = new Blob([secondImageBuffer])

    const compareResult = await Perse.face.compare(firstImageBinary, secondImageBinary)

    expect(compareResult).toStrictEqual({
      message: 'The source file byte size is too big. Please send files with less than 1 MB.',
      code: 'file_too_large',
      status: false
    })
  })

  it('Should parse compare response keys to camel case', async () => {
    Perse.init(API_KEY)

    const expectedKeys = [
      'similarity',
      'status',
      'code',
      'imageTokens',
      'timeTaken',
      'message'
    ].sort()

    const firstImageBuffer = fs.readFileSync('./image/test-image.jpg')
    const secondImageBuffer = fs.readFileSync('./image/test-image.jpg')

    const firstImageBinary = new Blob([firstImageBuffer])
    const secondImageBinary = new Blob([secondImageBuffer])

    const authenticateResult = await Perse.face.compare(firstImageBinary, secondImageBinary)

    expect(Object.keys(authenticateResult).sort()).toEqual(expectedKeys)
  })
})

describe('Testing function isSimilar', () => {
  it('Should return success when authenticating user', async () => {
    Perse.init(API_KEY)

    const firstImageBuffer = fs.readFileSync('./image/test-image.jpg')
    const secondImageBuffer = fs.readFileSync('./image/test-image.jpg')

    const firstImageBinary = new Blob([firstImageBuffer])
    const secondImageBinary = new Blob([secondImageBuffer])

    const authenticateResult = await Perse.face.isSimilar(firstImageBinary, secondImageBinary)

    expect(authenticateResult).toStrictEqual({
      status: true,
      code: 'similar',
      message: 'Similar person on both images'
    })
  })

  it('Should return error on authentication', async () => {
    Perse.init(API_KEY)

    const firstImageBuffer = fs.readFileSync('./image/test-image.jpg')
    const secondImageBuffer = fs.readFileSync('./image/test-image-good.jpg')

    const firstImageBinary = new Blob([firstImageBuffer])
    const secondImageBinary = new Blob([secondImageBuffer])

    const authenticateResult = await Perse.face.isSimilar(firstImageBinary, secondImageBinary)

    expect(authenticateResult).toStrictEqual({
      status: false,
      code: 'not_similar',
      message: 'Not similar person on sent images'
    })
  })

  it('Should return image size error', async () => {
    Perse.init(API_KEY)

    const firstImageBuffer = fs.readFileSync('./image/test-image-good.jpg')
    const secondImageBuffer = fs.readFileSync('./image/file-too-big.jpg')

    const firstImageBinary = new Blob([firstImageBuffer])
    const secondImageBinary = new Blob([secondImageBuffer])

    const authenticateResult = await Perse.face.isSimilar(firstImageBinary, secondImageBinary)

    expect(authenticateResult).toStrictEqual({
      status: false,
      code: 'file_too_large',
      message: 'The source file byte size is too big. Please send files with less than 1 MB.'
    })
  })
})
