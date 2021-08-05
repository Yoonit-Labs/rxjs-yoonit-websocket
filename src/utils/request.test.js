import { requester, promiseMaker } from '.'

describe('Request utils module', () => {
  it('Should create axios instance based on parameters received, returning a valid Promise', async () => {
    try {
      const formData = new FormData()
      formData.append('image_file', '')

      requester({
        method: 'POST',
        headers: {
          "Content-Type": "multipart/form-data",
          "x-api-key": '8hJ2e4hq0S8Z8VDcj0ycY1a4awAt62vQ2XvFO1LP'
        },
        url: '/face/detect/',
        data: formData
      })

    } catch (e) {
      expect(e.response.data).toStrictEqual({
        status: 400,
        code: 'empty_file',
        message: 'image_file cant be empty',
        time_taken: 0
      })
    }
  })

  it('Should parse response from a success promise', async () => {
    const resolvedPromise = await promiseMaker(Promise.resolve({ status: true }))

    expect(resolvedPromise).toStrictEqual([
      { status: true },
      undefined
    ])
  })

  it('Should parse response from a failed promise', async () => {
    const resolvedPromise = await promiseMaker(Promise.reject('error'))

    expect(resolvedPromise).toStrictEqual([
      undefined,
      'error'
    ])
  })

  it('Should break execution when argument is not a promise', async () => {
    const resolvedPromise = await promiseMaker(null)

    expect(resolvedPromise).toBe(undefined)
  })
})
