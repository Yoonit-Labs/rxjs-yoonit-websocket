# perse-sdk-js

## How to run the project
``
npm install
npm run serve
``

## How to build and use it on another project
After installing the project:

1- At the root of Perse sdk directory, run: `npm link`

2- In the project that you want to use Perse sdk, run: `npm link @cyberlabsai/perse-sdk-js`

3- Then, run `npm run watch` on Perse directory

## Authenticate

Signature: `Perse.face.authenticate(personFirstImage, personSecondImage)`

| Parameter             | Description     | Type |
| --------------        |:---------------:| ----:|
| personFirstImage      | An image file   | File or Blob |
| personSecondImage     | An image file   | File or Blob |

Returns:
<br>

| Property      | Description                         | Type    |
| ------------- |:-----------------------------------:| -------:|
| status        | Represents if authenticated succeed | boolean |
| code          | Success or failure code             | string  |
| message       | Feedback message                    | string  |


## Compare

Signature: `Perse.face.compare(personFirstImage, personSecondImage)`

| Parameter             | Description     | Type |
| --------------        |:---------------:| ----:|
| personFirstImage      | An image file   | File or Blob |
| personSecondImage     | An image file   | File or Blob |

Returns:
<br>

| Property      | Description                                                    | Type             |
| ------------- |:--------------------------------------------------------------:| ----------------:|
| status        | Represents if request succeed                                  | boolean          |
| similarity    | A number that represents the similarity gradation              | number (0-100)   |
| code          | Success or failure code                                        | string           |
| image_tokens  | An Array with array unique identifier generated from Perse API | `Array<string>`  |
| time_taken    | Time taken to fulfill request                                  | number           |
| message       | Feedback message                                               | string           |

## Detect

Signature: `Perse.face.detect(personImage)`

| Parameter             | Description     | Type |
| --------------        |:---------------:| ----:|
| personImage           | An image file   | File or Blob |

Returns:
<br>
| Property      | Description                                   | Type    |
| ------------- |:--------------------------------------------: | -------:|
| status        | Represents if authenticated succeed           | boolean |
| code          | Success or failure code                       | string  |
| message       | Feedback message                              | string  |
| faces         | Faces detected by Parse. see more             | array   |
| image_metrics | An object with image quality data. see more   | object  |
| image_token   | A unique image identifier                     | string  |
| time_taken    | Time taken to fulfill request                 | number  |
| total_faces   | Total faces that are on image                 | number  |

## Validate

Signature: `Perse.face.validate(personImage)`

| Parameter             | Description     | Type |
| --------------        |:---------------:| ----:|
| personImage           | An image file   | File or Blob |

Returns:
<br>

| Property      | Description                                   | Type    |
| ------------- |:--------------------------------------------: | -------:|
| status        | Represents if authenticated succeed           | boolean |
| code          | Success or failure code                       | string  |
| message       | Feedback message                              | array   |
