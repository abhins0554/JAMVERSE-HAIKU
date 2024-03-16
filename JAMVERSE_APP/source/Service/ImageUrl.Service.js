import RNFetchBlob from 'rn-fetch-blob';
import ImageResizer from '@bam.tech/react-native-image-resizer';

const ImageResize = async ({ url }) =>
  new Promise((resolve, reject) => {
    const fs = RNFetchBlob.fs;
    let imagePath = null;
    RNFetchBlob.config({
      fileCache: true,
    })
      .fetch('GET', url)
      // the image is now dowloaded to device's storage
      .then(resp => {
        // the image path you can use it directly with Image component
        imagePath = resp.path();
        return resp.readFile('base64');
      })
      .then(base64Data => {
        // here's base64 encoded image
        ImageResizer.createResizedImage(
          `data:image/jpeg;base64,${base64Data}`,
          100,
          100,
          'JPEG',
          80,
        )
          .then(response => {
            // response.uri is the URI of the new image that can now be displayed, uploaded...
            // response.path is the path of the new image
            // response.name is the name of the new image with the extension
            // response.size is the size of the new image
            resolve(response.uri);
          })
          .catch(err => {
            // Oops, something went wrong. Check that the filename is correct and
            // inspect err to get more details.
            resolve(url);
          });

        // remove the file from storage
        return fs.unlink(imagePath);
      });
  });

export default ImageResize;
